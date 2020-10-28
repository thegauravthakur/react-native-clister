import React, { useState } from "react";
import { View } from "react-native";
import CustomHeader from "./CustomHeader";
import { Text, Toast } from "native-base";
import { Button, TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import firestore from "@react-native-firebase/firestore";

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
  return (
    <View>
      <View>
        <CustomHeader navigation={navigation} />
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
            }}
            mode={"contained"}
            compact
            style={{
              height: 56,
              minWidth: 56,
              display: "flex",
              justifyContent: "center",
              backgroundColor: "rgb(29,161,242)",
            }}
          >
            Add
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
