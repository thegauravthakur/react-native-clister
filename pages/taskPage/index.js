import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { Redirect } from "react-router-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentListState, userState } from "../../recoil/atoms";
import firestore from "@react-native-firebase/firestore";
import CustomHeader from "./components/CustomHeader";
import CustomActionButton from "./components/CustomActionButton";
import CustomRbSheet from "./components/CustomRBSheet";
import CustomCard from "./components/CustomCard";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-community/async-storage";
import { List, ListItem, Text, Icon, Right, Left, Card } from "native-base";

const Index = () => {
  const Drawer = createDrawerNavigator();

  return (
    <View style={styles.root}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Notifications"
          drawerContent={(props) => <CustomDrawer {...props} />}
        >
          <Drawer.Screen name="Home" component={CustomHeader} />
          <Drawer.Screen name="Notifications" component={TaskPage} />
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
};

const CustomDrawer = ({ navigation }) => {
  const [dialog, setDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [currentList, setCurrentList] = useRecoilState(currentListState);
  const currentUser = useRecoilValue(userState);
  const [documents, setDocuments] = useState([]);
  const inputRef = useRef();
  useEffect(() => {
    const ref = firestore().collection(currentUser);
    ref.onSnapshot((data) => {
      let temp = [];
      data.docs.forEach((d) => temp.push(d["id"]));
      setDocuments(temp);
    });
  }, []);
  return (
    <View>
      <Dialog.Container visible={dialog}>
        <Dialog.Title>Add a new list</Dialog.Title>
        <Dialog.Input
          textInputRef={inputRef}
          value={dialogText}
          onChangeText={(text) => setDialogText(text)}
          autoFocus
          placeholder={"Enter here"}
          style={{ borderBottomWidth: 1 }}
        />
        <Dialog.Button label="Cancel" onPress={() => setDialog(false)} />
        <Dialog.Button
          label="Add"
          onPress={async () => {
            let temp = [...documents, dialogText];
            setDocuments(temp);
            setCurrentList(dialogText);
            setDialog(false);
            navigation.closeDrawer();
            setDialogText("");
            await firestore()
              .collection(currentUser)
              .doc(dialogText)
              .set({ task: [] });
          }}
        />
      </Dialog.Container>
      <List>
        <ListItem
          icon
          button
          onPress={() => {
            setDialog(true);
          }}
        >
          <Icon
            style={{ color: "#3F51B5" }}
            type={"FontAwesome"}
            name={"plus"}
          />
        </ListItem>
        <ListItem
          selected={"default" === currentList}
          button
          onPress={() => {
            setCurrentList("default");
            navigation.closeDrawer();
          }}
        >
          <Text>{"default"}</Text>
        </ListItem>
        {documents.map((document, index) => {
          return document === "default" ? null : (
            <ListItem
              key={index}
              selected={document === currentList}
              button
              onPress={() => {
                setCurrentList(document);
                navigation.closeDrawer();
              }}
            >
              <Left>
                <Text
                  style={{
                    fontWeight: document === currentList ? "bold" : "normal",
                  }}
                >
                  {document}
                </Text>
              </Left>
              <Right>
                <Icon
                  onPress={async () => {
                    try {
                      let temp = [...documents];
                      temp.splice(index, 1);
                      setCurrentList("default");
                      setDocuments(temp);
                      await firestore()
                        .collection(currentUser)
                        .doc(document)
                        .delete();
                      const value = await AsyncStorage.getItem("@list");
                      if (value !== null) {
                        if (value === document) {
                          await AsyncStorage.setItem("@list", "default");
                        }
                      }
                    } catch (e) {
                      // error reading value
                    }
                  }}
                  style={{ fontSize: 22, color: "#3F51B5" }}
                  type="MaterialIcons"
                  name="delete"
                />
              </Right>
            </ListItem>
          );
        })}
      </List>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    minHeight: Dimensions.get("window").height,
  },
});

//-----

const TaskPage = ({ navigation }) => {
  const listName = useRecoilValue(currentListState);
  const [componentHeight, setComponentHeight] = useState(100);
  const currentUser = useRecoilValue(userState);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const refRBSheet = useRef();
  useEffect(() => {
    const subscriber = firestore()
      .collection(currentUser)
      .doc(listName)
      .onSnapshot((documentSnapshot) => {
        const { task } = documentSnapshot.data();
        setTasks(task);
      });

    return () => subscriber();
  }, [listName]);

  if (!currentUser) {
    return <Redirect to={"/"} />;
  }

  const renderItem = ({ item, index }) => {
    return (
      <CustomCard tasks={tasks} setTasks={setTasks} task={item} index={index} />
    );
  };

  const listHeaderComponent = () => {
    return (
      <View>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 35,
            color: "teal",
            marginVertical: 12,
          }}
        >
          {listName}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <CustomHeader refRBSheet={refRBSheet} navigation={navigation} />

      {tasks.length > 0 ? (
        <FlatList
          ListHeaderComponent={listHeaderComponent}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Card>
          <Text style={{ textAlign: "center", padding: 20 }}>
            No Item Found
          </Text>
        </Card>
      )}

      <CustomRbSheet
        refRBSheet={refRBSheet}
        task={task}
        componentHeight={componentHeight}
        setComponentHeight={setComponentHeight}
        setTasks={setTasks}
        tasks={tasks}
        setTask={setTask}
      />
      {/*<CustomActionButton refRBSheet={refRBSheet} />*/}
    </View>
  );
};

export default Index;
