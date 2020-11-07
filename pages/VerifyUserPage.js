import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ProgressBarAndroid,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Body, Header, Right, Title, Toast } from "native-base";
import { useRecoilState } from "recoil";
import { currentThemeState, userState } from "../recoil/atoms";
import { Redirect } from "react-router-native";
import { TextInput, Button, IconButton } from "react-native-paper";
import { PRIMARY_LIGHT } from "../constants/colors";

const VerifyUserPage = ({ location }) => {
  const [loading, setLoading] = useState(false);
  const [userOtp, setUserOtp] = useState("");
  const { email, password, otp } = location.state;
  useEffect(() => {
    Toast.show({
      text: `OTP send to ${email}`,
      buttonText: "Okay",
      type: "success",
    });
  }, []);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [currentTheme, setCurrentTheme] = useRecoilState(currentThemeState);
  if (currentUser) {
    return <Redirect to={"/tasks/default"} />;
  } else {
    return (
      <View
        style={{
          backgroundColor: currentTheme === "dark" ? "black" : "white",
          minHeight: Dimensions.get("window").height,
        }}
      >
        <Header
          style={{
            backgroundColor:
              currentTheme === "dark" ? "#242424" : PRIMARY_LIGHT,
          }}
        >
          <Body>
            <Title>C-LISTER</Title>
          </Body>
          <Right>
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
          </Right>
        </Header>
        {loading ? (
          <ProgressBarAndroid
            color={"teal"}
            styleAttr="Horizontal"
            style={{ marginVertical: -7 }}
          />
        ) : null}
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 20,
            fontWeight: "bold",
            color: currentTheme === "dark" ? "white" : "black",
          }}
        >
          Enter the OTP
        </Text>
        <TextInput
          style={{
            marginBottom: 20,
            borderBottomWidth: currentTheme === "light" ? 0.1 : 0,
          }}
          value={userOtp}
          onChangeText={(text) => setUserOtp(text)}
          label="OTP"
          theme={{
            colors: {
              placeholder: "#a3a3a3",
              text: currentTheme === "dark" ? "white" : "black",
              primary:
                currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
              underlineColor: "transparent",
              background: "transparent",
            },
          }}
        />

        <Button
          onPress={async () => {
            if (otp.toString() === userOtp) {
              setLoading(true);
              await AsyncStorage.removeItem("@list");
              await auth()
                .createUserWithEmailAndPassword(email, password)
                .then(({ user }) => {
                  const { uid } = user;
                  firestore()
                    .collection(uid)
                    .doc("default")
                    .set({ task: [] })
                    .then(() => {
                      setCurrentUser(uid);
                      setLoading(false);
                    });
                })
                .catch((error) => {
                  setLoading(false);
                  switch (error.code) {
                    case "auth/email-already-in-use":
                      Toast.show({
                        text: "Email already in use",
                        buttonText: "Okay",
                        type: "danger",
                      });
                      break;
                    default:
                      Toast.show({
                        text: error.code,
                        buttonText: "Okay",
                        type: "danger",
                      });
                  }
                });
            } else {
              Toast.show({
                text: "Wrong OTP",
                buttonText: "Okay",
                type: "danger",
              });
            }
          }}
          loading={loading}
          mode={"contained"}
          style={{
            backgroundColor:
              currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
          }}
          disabled={loading}
        >
          <Text style={{ color: currentTheme === "dark" ? "black" : "white" }}>
            VERIFY
          </Text>
        </Button>
      </View>
    );
  }
};

export default VerifyUserPage;
