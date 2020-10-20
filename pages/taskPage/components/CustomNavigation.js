import React from "react";
import CustomHeader from "./CustomHeader";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from "react-native";

const CustomNavigation = () => {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Notifications"
        drawerContent={(props) => <CustomHeader {...props} />}
      >
        <Drawer.Screen name="Home" component={page2} />
        <Drawer.Screen name="Notifications" component={page2} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
const page2 = () => {
  return <Text>hello</Text>;
};
export default CustomNavigation;
