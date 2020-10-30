import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ProgressBarAndroid,
} from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentThemeState, userState } from "../recoil/atoms";
import Config from "react-native-config";
import Axios from "axios";

import { Header, Body, Right, Title, Toast } from "native-base";
import { Redirect } from "react-router-native";
import { TextInput, Button, IconButton } from "react-native-paper";
import { PRIMARY_LIGHT } from "../constants/colors";
import AsyncStorage from "@react-native-community/async-storage";

const LoginPage = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [currentTheme, setCurrentTheme] = useRecoilState(currentThemeState);
  if (currentUser) {
    return <Redirect to={"/tasks/default"} />;
  }
  const style = StyleSheet.create({
    root: { marginHorizontal: 7 },
    title: {
      alignSelf: "center",
      color: currentTheme === "dark" ? "rgb(29,161,242)" : "teal",
      fontSize: 50,
    },
    button: {
      width: 200,
    },
  });
  return (
    <View
      style={{
        backgroundColor: currentTheme === "dark" ? "black" : "white",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <Header
        style={{
          backgroundColor: currentTheme === "dark" ? "#242424" : PRIMARY_LIGHT,
        }}
      >
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
              <Button onPress={() => history.push("/")} transparent>
                <Title>SIGN IN</Title>
              </Button>
            </View>
          </View>
        </Right>
      </Header>
      {loading ? (
        <ProgressBarAndroid
          color={"teal"}
          styleAttr="Horizontal"
          style={{ marginVertical: -7 }}
        />
      ) : null}
      <View style={style.root}>
        <Text style={style.title}>Sign Up</Text>
        <TextInput
          textContentType={"none"}
          autoCompleteType={"email"}
          left={
            <TextInput.Icon
              name="email"
              color={currentTheme === "dark" ? "white" : PRIMARY_LIGHT}
            />
          }
          keyboardType={"email-address"}
          style={{ marginBottom: 20 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          mode="outlined"
          label="Email"
          theme={{
            colors: {
              placeholder: "#a3a3a3",
              text: currentTheme === "dark" ? "white" : "black",
              primary:
                currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
              underlineColor: "transparent",
              background: currentTheme === "dark" ? "#000000" : "white",
            },
          }}
        />

        <TextInput
          textContentType={"none"}
          secureTextEntry={true}
          autoCompleteType={"password"}
          left={
            <TextInput.Icon
              name="lock"
              color={currentTheme === "dark" ? "white" : PRIMARY_LIGHT}
            />
          }
          style={{ marginBottom: 20 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          mode="outlined"
          label="Password"
          theme={{
            colors: {
              placeholder: "#a3a3a3",
              text: currentTheme === "dark" ? "white" : "black",
              primary:
                currentTheme === "dark" ? "rgb(29,161,242)" : PRIMARY_LIGHT,
              underlineColor: "transparent",
              background: currentTheme === "dark" ? "#000000" : "white",
            },
          }}
        />

        <Button
          onPress={() => {
            setLoading(true);
            let randomFixedInteger = function (length) {
              return Math.floor(
                Math.pow(10, length - 1) +
                  Math.random() *
                    (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
              );
            };
            let otp = randomFixedInteger(6);
            let options = {
              method: "POST",
              url: Config.API_URL,
              headers: {
                "content-type": Config.CONTENT_TYPE,
                "x-rapidapi-host": Config.X_RAPIDAPI_HOST,
                "x-rapidapi-key": Config.X_RAPIDAPI_KEY,
              },
              data: {
                personalizations: [
                  { to: [{ email: email }], subject: "Verify your email!" },
                ],
                from: { email: "no_reply@clister.tech" },
                content: [{ type: "text/plain", value: `you otp is ${otp}` }],
              },
            };
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!reg.test(email)) {
              Toast.show({
                text: "Enter Valid Email!",
                buttonText: "Okay",
                type: "danger",
              });
              setLoading(false);
            } else if (password.length < 6) {
              Toast.show({
                text: "Password should be at least six",
                buttonText: "Okay",
                type: "danger",
              });
              setLoading(false);
            } else {
              Axios.request(options)
                .then(function (response) {
                  setLoading(false);
                  history.push({
                    pathname: "/verifyUser",
                    state: { email, password, otp },
                  });
                  console.log("OTP SENT");
                })
                .catch(function (error) {
                  setLoading(false);
                  Toast.show({
                    text: error.message,
                    buttonText: "Okay",
                    type: "danger",
                  });
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
            SIGN UP
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default LoginPage;
