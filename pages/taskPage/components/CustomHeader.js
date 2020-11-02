import React from "react";
import { Body, Header, Left, Right, Title } from "native-base";
import auth from "@react-native-firebase/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { currentThemeState, userState } from "../../../recoil/atoms";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { PRIMARY_LIGHT } from "../../../constants/colors";
import AsyncStorage from "@react-native-community/async-storage";

const CustomHeader = ({ navigation }) => {
  const [currentTheme, setCurrentTheme] = useRecoilState(currentThemeState);
  const setCurrentUser = useSetRecoilState(userState);
  return (
    <Header
      style={{
        backgroundColor: currentTheme === "dark" ? "#242424" : PRIMARY_LIGHT,
      }}
    >
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
            {currentTheme === "light" ? (
              <IconButton
                onPress={async () => {
                  setCurrentTheme("dark");
                  await AsyncStorage.setItem("@theme", "dark");
                }}
                icon={"weather-night"}
                color={"white"}
              />
            ) : (
              <IconButton
                onPress={async () => {
                  setCurrentTheme("light");
                  await AsyncStorage.setItem("@theme", "light");
                }}
                icon={"white-balance-sunny"}
                color={"white"}
              />
            )}
          </View>
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
