import React from "react";
import { Body, CardItem, Icon } from "native-base";
import { Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentListState, userState } from "../../../recoil/atoms";
import Ripple from "react-native-material-ripple";
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
            {/*<Ripple*/}
            {/*  rippleSize={100}*/}
            {/*  style={{ flex: 1 }}*/}
            {/*  onPress={async () => {*/}
            {/*    let temp = [...tasks];*/}
            {/*    temp.splice(index, 1);*/}
            {/*    setTasks(temp);*/}
            {/*    await firestore()*/}
            {/*      .collection(currentUser)*/}
            {/*      .doc(currentSection)*/}
            {/*      .set({ task: temp });*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <Icon*/}
            {/*    style={{ fontSize: 22, color: "rgb(29,161,242)" }}*/}
            {/*    type="MaterialIcons"*/}
            {/*    name="delete"*/}
            {/*  />*/}
            {/*</Ripple>*/}
            <IconButton
              onPress={async () => {
                let temp = [...tasks];
                temp.splice(index, 1);
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
