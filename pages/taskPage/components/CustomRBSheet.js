import React from "react";
import { Dimensions, StatusBar, Text, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Button, Input, Item, Label } from "native-base";
import firestore from "@react-native-firebase/firestore";
import RBSheet from "react-native-raw-bottom-sheet";
import { useRecoilValue } from "recoil";
import { currentListState, userState } from "../../../recoil/atoms";

const CustomRbSheet = ({
  refRBSheet,
  componentHeight,
  setComponentHeight,
  task,
  tasks,
  setTasks,
  setTask,
}) => {
  const DEVICE_HEIGHT = Dimensions.get("screen").height;
  const STATUS_BAR = StatusBar.statusBarHeight || 24;
  const WINDOW_HEIGHT = Dimensions.get("window").height;
  const currentUser = useRecoilValue(userState);
  const currentList = useRecoilValue(currentListState);
  return (
    <View>
      <RBSheet
        height={DEVICE_HEIGHT - (STATUS_BAR + WINDOW_HEIGHT + componentHeight)}
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View
          onLayout={(e) => {
            let { height } = e.nativeEvent.layout;
            setComponentHeight(height);
            console.log(height);
          }}
        >
          <Item style={{ marginBottom: 10 }} floatingLabel>
            <Label>Enter a new item</Label>
            <Input value={task} onChangeText={(text) => setTask(text)} />
          </Item>
          <Button
            full
            onPress={async () => {
              try {
                await AsyncStorage.setItem("@list", currentList);
              } catch (e) {
                console.log(e);
              }
              let temp = [...tasks, task];
              setTasks(temp);
              setTask("");
              refRBSheet.current.close();
              await firestore()
                .collection(currentUser)
                .doc(currentList)
                .set({ task: temp });
            }}
          >
            <Text style={{ color: "white" }}>Add</Text>
          </Button>
        </View>
      </RBSheet>
    </View>
  );
};

export default CustomRbSheet;
