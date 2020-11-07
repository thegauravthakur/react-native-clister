import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { Redirect } from "react-router-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { SwipeListView } from "react-native-swipe-list-view";
import {
  currentListState,
  currentThemeState,
  userState,
} from "../../recoil/atoms";
import firestore from "@react-native-firebase/firestore";
import CustomHeader from "./components/CustomHeader";
import CustomCard from "./components/CustomCard";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-community/async-storage";
import { List, ListItem, Text, Icon, Right, Left, Toast } from "native-base";
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  IconButton,
} from "react-native-paper";
import TaskHeader from "./components/TaskHeader";
import { PRIMARY_LIGHT } from "../../constants/colors";

export const useInitialRender = (): boolean => {
  const [isInitialRender, setIsInitialRender] = useState(false);

  if (!isInitialRender) {
    setTimeout(() => setIsInitialRender(true), 1);
    return true;
  }
  return false;
};
const Index = () => {
  const isInitialRender = useInitialRender();
  const Drawer = createDrawerNavigator();

  const styles = StyleSheet.create({
    root: {
      minHeight: Dimensions.get("window").height,
    },
  });
  return (
    <View style={styles.root}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerStyle={{ width: isInitialRender ? 0 : 250 }}
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
  const currentTheme = useRecoilValue(currentThemeState);
  useEffect(() => {
    const ref = firestore().collection(currentUser);
    ref.onSnapshot((data) => {
      let temp = [];
      data.docs.forEach((d) => temp.push(d["id"]));
      setDocuments(temp);
    });
  }, []);
  const onSubmitHandler = async () => {
    if (dialogText === "") {
      Toast.show({
        text: "List Name Shouldn't Be Empty!",
        buttonText: "Okay",
        type: "danger",
      });
    } else {
      let temp = [...documents, dialogText];
      setDocuments(temp);
      setCurrentList(dialogText);
      setDialog(false);
      navigation.closeDrawer();

      setDialogText("");
      await firestore()
        .collection(currentUser)
        .doc(dialogText)
        .set({ task: [] })
        .then(() => {
          Toast.show({
            text: "New List Created!",
            buttonText: "Okay",
            type: "success",
          });
        });
    }
  };
  return (
    <View
      style={{
        backgroundColor: currentTheme === "dark" ? "#3d3d3d" : "white",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <Portal>
        <Dialog
          style={{
            backgroundColor: currentTheme === "dark" ? "#3d3d3d" : "white",
          }}
          visible={dialog}
          onDismiss={() => setDialog(false)}
        >
          <Dialog.Title
            style={{ color: currentTheme === "dark" ? "white" : "black" }}
          >
            Create New List
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              onSubmitEditing={onSubmitHandler}
              style={{
                marginBottom: 20,
                borderBottomWidth: currentTheme === "light" ? 0.1 : 0,
              }}
              onChangeText={(text) => setDialogText(text)}
              label="Enter List Name"
              theme={{
                colors: {
                  placeholder: currentTheme === "dark" ? "#a3a3a3" : "black",
                  text: currentTheme === "dark" ? "white" : "black",
                  primary:
                    currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
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
              onPress={onSubmitHandler}
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
              style={{
                color:
                  currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
              }}
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
                color:
                  "default" === currentList
                    ? currentTheme === "dark"
                      ? "rgb(29,161,242)"
                      : PRIMARY_LIGHT
                    : currentTheme === "dark"
                    ? "white"
                    : "black",
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
                        document === currentList
                          ? currentTheme === "dark"
                            ? "rgb(29,161,242)"
                            : PRIMARY_LIGHT
                          : currentTheme === "dark"
                          ? "white"
                          : "black",
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
                        Toast.show({
                          text: "List Deleted!",
                          buttonText: "Okay",
                          type: "success",
                        });
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
                    style={{
                      fontSize: 22,
                      color:
                        currentTheme === "dark"
                          ? "rgb(29,161,242)"
                          : PRIMARY_LIGHT,
                    }}
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

//-----

const TaskPage = ({ navigation }) => {
  const listName = useRecoilValue(currentListState);
  const currentUser = useRecoilValue(userState);
  const [tasks, setTasks] = useState([]);
  const currentList = useRecoilValue(currentListState);
  const currentTheme = useRecoilValue(currentThemeState);
  const [dialogText, setDialogText] = useState("");
  const [dialog, setDialog] = useState(false);
  const [index, setIndex] = useState();
  const dialogRef = useRef();
  const styles = StyleSheet.create({
    root: {
      minHeight: Dimensions.get("window").height,
      backgroundColor: currentTheme === "dark" ? "#000000" : "white",
    },
  });
  useEffect(() => {
    const subscriber = firestore()
      .collection(currentUser)
      .doc(listName)
      .onSnapshot((documentSnapshot) => {
        const { task } = documentSnapshot.data();
        setTasks(task);
        AsyncStorage.setItem("@list", currentList);
      });

    return () => subscriber();
  }, [listName]);
  const onSubmitHandler = async () => {
    if (dialogText === "") {
      Toast.show({
        text: "Item should not be empty!",
        buttonText: "Okay",
        type: "danger",
      });
    } else {
      try {
        await AsyncStorage.setItem("@list", currentList);
      } catch (e) {
        console.log(e);
      }
      let temp = [...tasks];
      temp[index] = dialogText;
      setTasks(temp);
      dialogRef.current.safeCloseOpenRow();
      setDialog(false);
      Toast.show({
        text: "Name Changed!",
        buttonText: "Okay",
        type: "success",
      });
      await firestore()
        .collection(currentUser)
        .doc(currentList)
        .set({ task: temp });
    }
  };
  if (!currentUser) {
    return <Redirect to={"/"} />;
  }

  return (
    <View style={styles.root}>
      <Portal>
        <Dialog
          style={{
            backgroundColor: currentTheme === "dark" ? "#3d3d3d" : "white",
          }}
          visible={dialog}
          onDismiss={() => setDialog(false)}
        >
          <Dialog.Title
            style={{ color: currentTheme === "dark" ? "white" : "black" }}
          >
            Enter The New Name
          </Dialog.Title>
          <Dialog.Content>
            <TextInput
              onSubmitEditing={onSubmitHandler}
              autoFocus
              selectTextOnFocus
              style={{
                marginBottom: 20,
                borderBottomWidth: currentTheme === "light" ? 0.1 : 0,
              }}
              defaultValue={dialogText}
              onChangeText={(text) => setDialogText(text)}
              label="Enter List Name"
              theme={{
                colors: {
                  placeholder: currentTheme === "dark" ? "#a3a3a3" : "black",
                  text: currentTheme === "dark" ? "white" : "black",
                  primary:
                    currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
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
              onPress={() => {
                dialogRef.current.safeCloseOpenRow();
                setDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              mode={"text"}
              color="rgb(29,161,242)"
              onPress={onSubmitHandler}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {tasks.length > 0 ? (
        <SwipeListView
          closeOnRowPress
          ref={dialogRef}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps={"handled"}
          ListHeaderComponent={
            <TaskHeader
              listName={listName}
              navigation={navigation}
              setTasks={setTasks}
              tasks={tasks}
              currentUser={currentUser}
              currentList={currentList}
              empty={false}
            />
          }
          data={tasks}
          renderItem={(data, rowMap) => (
            <CustomCard
              tasks={tasks}
              rowMap={rowMap}
              setTasks={setTasks}
              task={data.item}
              index={data.index}
            />
          )}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingTop: 7,
                paddingRight: 5,
              }}
            >
              <IconButton
                onPress={() => {
                  setDialog(true);
                  setDialogText(data.item);
                  setIndex(data.index);
                }}
                icon="pencil"
                style={{}}
                color={
                  currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT
                }
              />
            </View>
          )}
          leftOpenValue={50}
          rightOpenValue={-50}
          disableRightSwipe
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
