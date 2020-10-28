import React from "react";
import { Body, Button, Header, Icon, Left, Right, Title } from "native-base";
import auth from "@react-native-firebase/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms";
import Ripple from "react-native-material-ripple";
import { View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { IconButton } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

const CustomHeader = ({ navigation, refRBSheet }) => {
  const setCurrentUser = useSetRecoilState(userState);
  return (
    <Header style={{ backgroundColor: "#242424" }}>
      <Left>
        {/*<Ripple*/}
        {/*  onPress={() => navigation.toggleDrawer()}*/}
        {/*  rippleContainerBorderRadius={100}*/}
        {/*  rippleSize={100}*/}
        {/*>*/}
        {/*  <Button transparent>*/}
        {/*    <Icon type="FontAwesome" name="bars" />*/}
        {/*  </Button>*/}
        {/*</Ripple>*/}
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
            {/*<Ripple*/}
            {/*  onPress={async () => {*/}
            {/*    await auth().signOut();*/}
            {/*    setCurrentUser(null);*/}
            {/*  }}*/}
            {/*  rippleContainerBorderRadius={100}*/}
            {/*  rippleSize={100}*/}
            {/*>*/}
            {/*  <Button transparent>*/}
            {/*    <Icon type="FontAwesome" name="sign-out" />*/}
            {/*  </Button>*/}
            {/*</Ripple>*/}
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
