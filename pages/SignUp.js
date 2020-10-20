import React, { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import { Redirect } from "react-router-native";
import {
  Body,
  Button,
  Header,
  Icon,
  Input,
  Item,
  Label,
  Left,
  Right,
  Title,
  Toast,
} from "native-base";
import Axios from "axios";

const SignUp = ({ history }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  if (currentUser) {
    return <Redirect to={"/tasks/default"} />;
  }
  return (
    <View>
      <Header>
        <Left>
          <Button transparent>
            <Icon type="FontAwesome" name="bars" />
          </Button>
        </Left>
        <Body>
          <Title>CLister</Title>
        </Body>
        <Right>
          <Button onPress={() => history.push("/")} transparent>
            <Title>Log In</Title>
          </Button>
        </Right>
      </Header>
      <View style={style.root}>
        <Text style={style.title}>SignUp</Text>
        <Item style={{ marginBottom: 20 }} floatingLabel>
          <Label>Email</Label>
          <Input
            autoCompleteTypes={"email"}
            keyboardType={"email-address"}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </Item>
        <Item style={{ marginBottom: 40 }} floatingLabel>
          <Label>Password</Label>
          <Input
            autoCompleteType={"password"}
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </Item>

        {loading ? (
          <ActivityIndicator color="teal" />
        ) : (
          <Button
            full
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
                url: "https://rapidapi.p.rapidapi.com/mail/send",
                headers: {
                  "content-type": "application/json",
                  "x-rapidapi-host": "rapidprod-sendgrid-v1.p.rapidapi.com",
                  "x-rapidapi-key":
                    "5b2c629feemsh19321dfe48d26c8p157e05jsne14663bbb608",
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
                  console.error(error);
                });
            }}
          >
            <Text style={{ color: "white" }}>Sign Up</Text>
          </Button>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  root: {
    alignItems: "center",
  },
  title: {
    color: "teal",
    fontSize: 50,
  },
  button: {
    width: 200,
  },
});

export default SignUp;
