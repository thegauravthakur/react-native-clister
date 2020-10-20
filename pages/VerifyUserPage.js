import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Toast } from "native-base";
import { useRecoilState } from "recoil";
import { userState } from "../recoil/atoms";
import { Redirect } from "react-router-native";

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
    <View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Enter the OTP
      </Text>
      <TextInput
        value={userOtp}
        onChangeText={(text) => setUserOtp(text)}
        placeholder={"enter the otp"}
      />
      {!loading ? (
        <Button
          title={"Verify"}
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
              console.log("don't match");
            }
          }}
        />
      ) : (
        <ActivityIndicator color="teal" />
      )}
    </View>
  );
};

export default VerifyUserPage;
