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

import AsyncStorage from "@react-native-community/async-storage";
import {
  List,
  ListItem,
  Text,
  Icon,
  Right,
  Left,
  Card,
  Input,
} from "native-base";
import { Button, TextInput, Colors, Dialog, Portal } from "react-native-paper";

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
    <View
      style={{
        backgroundColor: "#3d3d3d",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <Portal>
        <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
          <Dialog.Title>Create New List</Dialog.Title>
          <Dialog.Content>
            <TextInput
              style={{ marginBottom: 20 }}
              value={dialogText}
              onChangeText={(text) => setDialogText(text)}
              label="Enter List Name"
              theme={{
                colors: {
                  placeholder: "#a3a3a3",
                  text: "white",
                  primary: "rgb(29,161,242)",
                  underlineColor: "transparent",
                  background: "transparent",
                },
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode={"text"}
              color="rgb(29,161,242)"
              onPress={() => setDialog(false)}
            >
              Cancel
            </Button>
            <Button
              mode={"text"}
              color="rgb(29,161,242)"
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
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={{}}>
        <List>
          <ListItem
            icon
            button
            onPress={() => {
              setDialog(true);
            }}
          >
            <Icon
              style={{ color: "rgb(29,161,242)" }}
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
            <Text
              style={{
                color: "default" === currentList ? "rgb(29,161,242)" : "white",
              }}
            >
              {"default"}
            </Text>
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
                      color:
                        document === currentList ? "rgb(29,161,242)" : "white",
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
                      } catch (e) {}
                    }}
                    style={{ fontSize: 22, color: "rgb(29,161,242)" }}
                    type="MaterialIcons"
                    name="delete"
                  />
                </Right>
              </ListItem>
            );
          })}
        </List>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    minHeight: Dimensions.get("window").height,
    backgroundColor: "#000000",
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
  const currentList = useRecoilValue(currentListState);
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
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 35,
          color: "white",
          marginVertical: 12,
        }}
      >
        {listName}
      </Text>
    );
  };

  return (
    <View style={styles.root}>
      <CustomHeader refRBSheet={refRBSheet} navigation={navigation} />
      <Text
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 35,
          color: "white",
          marginVertical: 12,
        }}
      >
        {listName}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          marginBottom: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            // right={<TextInput.Icon name="plus" color="white" />}
            value={task}
            onChangeText={(text) => setTask(text)}
            mode="outlined"
            label="New Item"
            theme={{
              colors: {
                placeholder: "#a3a3a3",
                text: "white",
                primary: "rgb(29,161,242)",
                underlineColor: "transparent",
                background: "#000000",
              },
            }}
          />
        </View>
        <Button
          onPress={async () => {
            try {
              await AsyncStorage.setItem("@list", currentList);
            } catch (e) {
              console.log(e);
            }
            let temp = [...tasks, task];
            setTasks(temp);
            setTask("");
            await firestore()
              .collection(currentUser)
              .doc(currentList)
              .set({ task: temp });
          }}
          mode={"contained"}
          compact
          style={{
            height: 56,
            display: "flex",
            justifyContent: "center",
            backgroundColor: "rgb(29,161,242)",
          }}
        >
          hello
        </Button>
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 19,
          }}
        >
          No Item Found
        </Text>
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
