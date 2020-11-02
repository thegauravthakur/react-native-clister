import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ProgressBarAndroid,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentThemeState, userState } from "../recoil/atoms";
import AsyncStorage from "@react-native-community/async-storage";
import { Header, Body, Right, Title, Toast } from "native-base";
import { Redirect } from "react-router-native";
import { TextInput, Button, ProgressBar, IconButton } from "react-native-paper";
import { PRIMARY_LIGHT } from "../constants/colors";

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
              <Button onPress={() => history.push("/signUp")} transparent>
                <Title>Sign Up</Title>
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
        <Text style={style.title}>Login</Text>
        <TextInput
          textContentType={"emailAddress"}
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
          textContentType={"password"}
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
          onPress={async () => {
            setLoading(true);
            await AsyncStorage.removeItem("@list");
            if (email === "") {
              Toast.show({
                text: "Email can't be empty!",
                buttonText: "Okay",
                type: "danger",
              });
              setLoading(false);
            } else if (password === "") {
              Toast.show({
                text: "Password can't be empty!",
                buttonText: "Okay",
                type: "danger",
              });
              setLoading(false);
            } else {
              await auth()
                .signInWithEmailAndPassword(email, password)
                .then(({ user }) => {
                  setLoading(false);
                  const { uid } = user;
                  console.log(uid);
                  setCurrentUser(uid);
                })
                .catch((error) => {
                  setLoading(false);
                  switch (error.code) {
                    case "auth/user-not-found":
                      Toast.show({
                        text: "User Not Found",
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
            SIGN IN
          </Text>
        </Button>
      </View>
    </View>
  );
};

export default LoginPage;
