import React, { useEffect, useState } from "react";
import { Dimensions, ProgressBarAndroid, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentListState,
  currentThemeState,
  userState,
} from "../recoil/atoms";
import AsyncStorage from "@react-native-community/async-storage";
import SplashScreen from "react-native-splash-screen";

const Startup = ({ children }) => {
  const setCurrentUser = useSetRecoilState(userState);
  const setCurrentList = useSetRecoilState(currentListState);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useRecoilState(currentThemeState);
  useEffect(() => {
    const fetchUser = async () => {
      SplashScreen.hide();
      await auth().onAuthStateChanged(async (user) => {
        try {
          console.log(user);
          setCurrentUser(user ? user.uid : null);
          const value = await AsyncStorage.getItem("@list");
          const theme = await AsyncStorage.getItem("@theme");
          if (theme != null) {
            setCurrentTheme(theme);
          }

          if (value !== null) {
            setCurrentList(value);
          } else {
            setCurrentList("default");
          }
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      });
    };
    fetchUser().then();
  }, []);
  if (loading) {
    return (
      <View
        style={{
          minHeight: Dimensions.get("window").height,
          backgroundColor: currentTheme === "dark" ? "black" : "white",
        }}
      >
        <ProgressBarAndroid
          styleAttr="Horizontal"
          style={{ marginVertical: -7 }}
        />
      </View>
    );
  }
  return <View>{children}</View>;
};

export default Startup;
