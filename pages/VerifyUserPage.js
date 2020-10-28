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
import { Toast } from "native-base";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import { Redirect } from "react-router-native";
import { TextInput, Button } from "react-native-paper";

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
          color: "white",
        }}
      >
        Enter the OTP
      </Text>
      <TextInput
        style={{ marginBottom: 20 }}
        value={userOtp}
        onChangeText={(text) => setUserOtp(text)}
        label="OTP"
        theme={{
          colors: {
            placeholder: "#a3a3a3",
            text: "white",
            primary: "rgb(29,161,242)",
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
                    console.log(uid);
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
        style={{ backgroundColor: "rgb(29,161,242)" }}
        disabled={loading}
      >
        Verify
      </Button>
    </View>
  );
};

export default VerifyUserPage;
