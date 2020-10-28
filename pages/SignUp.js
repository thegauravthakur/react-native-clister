import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ProgressBarAndroid,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import AsyncStorage from "@react-native-community/async-storage";
import Config from "react-native-config";
import Axios from "axios";

import {
  Label,
  Header,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Item,
  Input,
  Toast,
} from "native-base";
import { Redirect } from "react-router-native";
import { TextInput, Button } from "react-native-paper";

const LoginPage = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  if (currentUser) {
    return <Redirect to={"/tasks/default"} />;
  }
  return (
    <View
      style={{
        backgroundColor: "black",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <Header style={{ backgroundColor: "#242424" }}>
        <Body>
          <Title>CLister</Title>
        </Body>
        <Right>
          <Button onPress={() => history.push("/")} transparent>
            <Title>LOGIN</Title>
          </Button>
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
          autoCompleteType={"email"}
          left={<TextInput.Icon name="email" color="white" />}
          keyboardType={"email-address"}
          style={{ marginBottom: 20 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          mode="outlined"
          label="Email"
          theme={{
            colors: {
              placeholder: "#a3a3a3",
              text: "white",
              primary: "rgb(29,161,242)",
              underlineColor: "transparent",
              background: "#000000",
            },
          }}
        />
        {/*<Item style={{ marginBottom: 20 }} floatingLabel>*/}
        {/*  <Label>Username</Label>*/}
        {/*  <Input*/}
        {/*    autoCompleteType={"email"}*/}
        {/*    keyboardType={"email-address"}*/}
        {/*    value={email}*/}
        {/*    onChangeText={(text) => setEmail(text)}*/}
        {/*  />*/}
        {/*</Item>*/}
        <TextInput
          secureTextEntry={true}
          autoCompleteType={"password"}
          left={<TextInput.Icon name="lock" color="white" />}
          style={{ marginBottom: 20 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          mode="outlined"
          label="Password"
          theme={{
            colors: {
              placeholder: "#a3a3a3",
              text: "white",
              primary: "rgb(29,161,242)",
              underlineColor: "transparent",
              background: "#000000",
            },
          }}
        />
        {/*{loading ? (*/}
        {/*  <ActivityIndicator color="teal" />*/}
        {/*) : (*/}
        {/*  <Button*/}
        {/*    full*/}
        {/*    onPress={async () => {*/}
        {/*      setLoading(true);*/}
        {/*      await AsyncStorage.removeItem("@list");*/}
        {/*      await auth()*/}
        {/*        .signInWithEmailAndPassword(email, password)*/}
        {/*        .then(({ user }) => {*/}
        {/*          setLoading(false);*/}
        {/*          const { uid } = user;*/}
        {/*          console.log(uid);*/}
        {/*          setCurrentUser(uid);*/}
        {/*        })*/}
        {/*        .catch((error) => {*/}
        {/*          setLoading(false);*/}
        {/*          switch (error.code) {*/}
        {/*            case "auth/user-not-found":*/}
        {/*              Toast.show({*/}
        {/*                text: "User Not Found",*/}
        {/*                buttonText: "Okay",*/}
        {/*                type: "danger",*/}
        {/*              });*/}
        {/*              break;*/}
        {/*            default:*/}
        {/*              Toast.show({*/}
        {/*                text: error.code,*/}
        {/*                buttonText: "Okay",*/}
        {/*                type: "danger",*/}
        {/*              });*/}
        {/*          }*/}
        {/*        });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Text style={{ color: "white" }}>Login</Text>*/}
        {/*  </Button>*/}
        {/*)}*/}
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
                console.log(Config.API_URL);
                console.error(error);
              });
          }}
          loading={loading}
          mode={"contained"}
          style={{ backgroundColor: "rgb(29,161,242)" }}
          disabled={loading}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  root: {},
  title: {
    alignSelf: "center",
    color: "rgb(29,161,242)",
    fontSize: 50,
  },
  button: {
    width: 200,
  },
});

export default LoginPage;
