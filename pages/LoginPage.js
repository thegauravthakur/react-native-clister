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
import { TextInput, Button, ProgressBar } from "react-native-paper";

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
          <Title>C-LISTER</Title>
        </Body>
        <Right>
          <Button onPress={() => history.push("/signUp")} transparent>
            <Title>Sign Up</Title>
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
        <Text style={style.title}>Login</Text>
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
          loading={loading}
          mode={"contained"}
          style={{ backgroundColor: "rgb(29,161,242)" }}
          disabled={loading}
        >
          Sign In
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
