import React from "react";
import { Body, Button, Header, Icon, Left, Right, Title } from "native-base";
import auth from "@react-native-firebase/auth";
import { useSetRecoilState } from "recoil";
import { userState } from "../../../recoil/atoms";
import Ripple from "react-native-material-ripple";

const CustomHeader = ({ navigation, refRBSheet }) => {
  return (
    <Header>
      <Left>
        <Ripple
          onPress={() => navigation.toggleDrawer()}
          rippleContainerBorderRadius={100}
          rippleSize={100}
        >
          <Button transparent>
            <Icon type="FontAwesome" name="bars" />
          </Button>
        </Ripple>
      </Left>
      <Body>
        <Title>CLister</Title>
      </Body>
      <Right>
        <Ripple
          onPress={() => refRBSheet.current.open()}
          rippleContainerBorderRadius={100}
          rippleSize={100}
        >
          <Button transparent>
            <Icon type="FontAwesome" name="plus" />
          </Button>
        </Ripple>
      </Right>
    </Header>
  );
};

export default CustomHeader;
