import React, { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import AsyncStorage from "@react-native-community/async-storage";
import {
  Label,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
  Item,
  Input,
  Toast,
} from "native-base";
import { Redirect } from "react-router-native";

const LoginPage = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  if (currentUser) {
    return <Redirect to={"/tasks/default"} />;
  }
  return (
    <View>
      <Header>
        <Body>
          <Title>CLister</Title>
        </Body>
        <Right>
          <Button onPress={() => history.push("/signUp")} transparent>
            <Title>Sign Up</Title>
          </Button>
        </Right>
      </Header>
      <View style={style.root}>
        <Text style={style.title}>Login</Text>
        <Item style={{ marginBottom: 20 }} floatingLabel>
          <Label>Username</Label>
          <Input
            autoCompleteType={"email"}
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
            onPress={async () => {
              setLoading(true);
              await AsyncStorage.removeItem("@list");
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
            }}
          >
            <Text style={{ color: "white" }}>Login</Text>
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

export default LoginPage;
