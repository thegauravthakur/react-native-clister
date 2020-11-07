import React, { useEffect } from "react";
import { Body, Toast } from "native-base";
import { Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useRecoilValue } from "recoil";
import {
  currentListState,
  currentThemeState,
  userState,
} from "../../../recoil/atoms";
import { Card, IconButton } from "react-native-paper";
import { PRIMARY_LIGHT } from "../../../constants/colors";

const CustomCard = ({ task, index, tasks, setTasks, rowMap }) => {
  const currentSection = useRecoilValue(currentListState);
  const currentUser = useRecoilValue(userState);
  const currentTheme = useRecoilValue(currentThemeState);

  return (
    <Card
      style={{
        backgroundColor: currentTheme === "dark" ? "#3d3d3d" : "white",
        marginBottom: 20,
        elevation: 12,
        marginHorizontal: 7,
      }}
    >
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
                  flex: index >= 9 ? 1.3 : 1,
                  fontWeight: "bold",
                  color:
                    currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
                  fontSize: 18,
                }}
              >
                {index + 1}
              </Text>
              <Text
                style={{
                  flex: index >= 9 ? 10.7 : 11,
                  fontSize: 16,
                  fontWeight: "normal",
                  color: currentTheme === "dark" ? "white" : "teal",
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
              style={{ margin: -2, padding: 0 }}
              color={
                currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT
              }
            />
          </View>
        </Body>
      </Card.Content>
    </Card>
  );
};

export default CustomCard;
