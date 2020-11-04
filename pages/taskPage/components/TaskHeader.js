import React, { useState } from "react";
import { View } from "react-native";
import CustomHeader from "./CustomHeader";
import { Text, Toast } from "native-base";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import firestore from "@react-native-firebase/firestore";
import { useRecoilValue } from "recoil";
import { currentThemeState } from "../../../recoil/atoms";
import { PRIMARY_LIGHT } from "../../../constants/colors";

const TaskHeader = ({
  listName,
  navigation,
  currentList,
  tasks,
  setTasks,
  currentUser,
  empty,
}) => {
  const [task, setTask] = useState("");
  const currentTheme = useRecoilValue(currentThemeState);
  const onSubmitHandler = async () => {
    if (task === "") {
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
      let temp = [...tasks, task];
      setTasks(temp);
      Toast.show({
        text: "Item Added!",
        buttonText: "Okay",
        type: "success",
      });
      setTask("");
      await firestore()
        .collection(currentUser)
        .doc(currentList)
        .set({ task: temp });
    }
  };
  return (
    <View>
      <View>
        <CustomHeader navigation={navigation} />
        <Text
          onPress={async () => {
            try {
              await AsyncStorage.setItem("@list", listName);
            } catch (e) {
              console.log(e);
            }
          }}
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 35,
            color: currentTheme === "dark" ? "white" : "teal",
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
            marginHorizontal: 7,
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              // right={<TextInput.Icon name="plus" color="white" />}
              onSubmitEditing={onSubmitHandler}
              value={task}
              onChangeText={(text) => setTask(text)}
              mode="outlined"
              label="New Item"
              theme={{
                colors: {
                  placeholder: "#a3a3a3",
                  text: currentTheme === "dark" ? "white" : "black",
                  primary:
                    currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
                  underlineColor: "transparent",
                  background: currentTheme === "dark" ? "#000000" : "white",
                },
              }}
            />
          </View>
          <Button
            onPress={onSubmitHandler}
            mode={"contained"}
            compact
            style={{
              height: 56,
              minWidth: 56,
              display: "flex",
              justifyContent: "center",
              backgroundColor:
                currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
            }}
          >
            <Text
              style={{ color: currentTheme === "dark" ? "black" : "white" }}
            >
              ADD
            </Text>
          </Button>
        </View>

        {empty ? (
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
        ) : null}
      </View>
    </View>
  );
};

export default TaskHeader;
