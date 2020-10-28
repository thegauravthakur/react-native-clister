import React from "react";
import { Body, Toast } from "native-base";
import { Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useRecoilValue } from "recoil";
import { currentListState, userState } from "../../../recoil/atoms";
import { Card, IconButton } from "react-native-paper";

const CustomCard = ({ task, index, tasks, setTasks }) => {
  const currentSection = useRecoilValue(currentListState);
  const currentUser = useRecoilValue(userState);
  return (
    <Card style={{ backgroundColor: "#3d3d3d", marginBottom: 20 }}>
      <Card.Content>
        <Body>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", flex: 11, alignItems: "center" }}
            >
              <Text
                style={{
                  flex: 1,
                  fontWeight: "bold",
                  color: "rgb(29,161,242)",
                  fontSize: 18,
                }}
              >
                {index + 1}
              </Text>
              <Text
                style={{
                  flex: 11,
                  fontSize: 16,
                  fontWeight: "normal",
                  color: "white",
                }}
              >
                {task}
              </Text>
            </View>

            <IconButton
              onPress={async () => {
                let temp = [...tasks];
                temp.splice(index, 1);
                Toast.show({
                  text: "Item Deleted!",
                  buttonText: "Okay",
                  type: "success",
                });
                setTasks(temp);
                await firestore()
                  .collection(currentUser)
                  .doc(currentSection)
                  .set({ task: temp });
              }}
              icon="delete"
              style={{ margin: -5, padding: 0 }}
              color={"rgb(29,161,242)"}
            />
          </View>
        </Body>
      </Card.Content>
    </Card>
  );
};

export default CustomCard;
