import React, { useEffect, useState } from "react";
import { Dimensions, ProgressBarAndroid, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useSetRecoilState } from "recoil";
import { currentListState, userState } from "../recoil/atoms";
import AsyncStorage from "@react-native-community/async-storage";

const Startup = ({ children }) => {
  const setCurrentUser = useSetRecoilState(userState);
  const setCurrentList = useSetRecoilState(currentListState);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      await auth().onAuthStateChanged(async (user) => {
        try {
          console.log(user);
          setCurrentUser(user ? user.uid : null);
          const value = await AsyncStorage.getItem("@list");
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
          backgroundColor: "black",
        }}
      >
        {loading ? (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            style={{ marginVertical: -7 }}
          />
        ) : null}
      </View>
    );
  }
  return <View>{children}</View>;
};

export default Startup;
