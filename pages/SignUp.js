import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ProgressBarAndroid,
} from "react-native";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import Config from "react-native-config";
import Axios from "axios";

import { Header, Body, Right, Title, Toast } from "native-base";
import { Redirect } from "react-router-native";
import { TextInput, Button } from "react-native-paper";

const LoginPage = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <Title>C-LISTER</Title>
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
          textContentType={"none"}
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

        <TextInput
          textContentType={"none"}
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
