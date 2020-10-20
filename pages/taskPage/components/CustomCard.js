import React from "react";
import { Body, Card, CardItem, Icon } from "native-base";
import { Text, View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { useRecoilValue } from "recoil";
import { userState } from "../../../recoil/atoms";
import Ripple from "react-native-material-ripple";

const CustomCard = ({ task, index, tasks, setTasks }) => {
  const currentUser = useRecoilValue(userState);
  return (
    <Card>
      <CardItem>
        <Body>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", flex: 11, alignItems: "center" }}
            >
              <Text
                style={{
                  flex: 1,
                  fontWeight: "bold",
                  color: "teal",
                  fontSize: 18,
                }}
              >
                {index + 1}
              </Text>
              <Text style={{ flex: 11, fontSize: 16, fontWeight: "normal" }}>
                {task}
              </Text>
            </View>
            <Ripple
              rippleSize={100}
              style={{ flex: 1 }}
              onPress={async () => {
                let temp = [...tasks];
                temp.splice(index, 1);
                setTasks(temp);
                await firestore()
                  .collection(currentUser)
                  .doc("default")
                  .set({ task: temp });
              }}
            >
              <Icon
                style={{ fontSize: 22, color: "teal" }}
                type="MaterialIcons"
                name="delete"
              />
            </Ripple>
          </View>
        </Body>
      </CardItem>
    </Card>
  );
};

export default CustomCard;
