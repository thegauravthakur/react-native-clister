import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { Redirect } from "react-router-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentListState, userState } from "../../recoil/atoms";
import firestore from "@react-native-firebase/firestore";
import CustomHeader from "./components/CustomHeader";
import CustomCard from "./components/CustomCard";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-community/async-storage";
import { List, ListItem, Text, Icon, Right, Left } from "native-base";
import { Button, TextInput, Dialog, Portal } from "react-native-paper";
import TaskHeader from "./components/TaskHeader";

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
  const currentUser = useRecoilValue(userState);
  const [tasks, setTasks] = useState([]);
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
      <View>
        <TaskHeader
          listName={listName}
          navigation={navigation}
          setTasks={setTasks}
          tasks={tasks}
          currentUser={currentUser}
          currentList={currentList}
          empty={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {tasks.length > 0 ? (
        <FlatList
          ListHeaderComponent={listHeaderComponent}
          data={tasks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <TaskHeader
          listName={listName}
          navigation={navigation}
          setTasks={setTasks}
          tasks={tasks}
          currentUser={currentUser}
          currentList={currentList}
          empty={true}
        />
      )}
    </View>
  );
};

export default Index;
