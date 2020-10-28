import React from "react";
import { Body, Header, Left, Right, Title } from "native-base";
import auth from "@react-native-firebase/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms";
import { View } from "react-native";
import { IconButton } from "react-native-paper";

const CustomHeader = ({ navigation }) => {
  const setCurrentUser = useSetRecoilState(userState);
  return (
    <Header style={{ backgroundColor: "#242424" }}>
      <Left>
        <IconButton
          onPress={() => navigation.toggleDrawer()}
          icon="menu"
          color={"white"}
        />
      </Left>
      <Body>
        <Title>C-LISTER</Title>
      </Body>
      <Right>
        <View style={{ flexDirection: "row" }}>
          <View>
            <IconButton
              onPress={async () => {
                await auth().signOut();
                setCurrentUser(null);
              }}
              icon="logout"
              color={"white"}
            />
          </View>
        </View>
      </Right>
    </Header>
  );
};

export default CustomHeader;
