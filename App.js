import React, { useEffect } from "react";
import { NativeRouter, Route, Switch } from "react-router-native";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import { RecoilRoot, useSetRecoilState } from "recoil";
import TaskPage from "./pages/taskPage";
import Startup from "./components/startup";
import { Root } from "native-base";
import SplashScreen from "react-native-splash-screen";
import VerifyUserPage from "./pages/VerifyUserPage";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import { currentThemeState } from "./recoil/atoms";

const App = () => {
  const setCurrentTheme = useSetRecoilState(currentThemeState);
  useEffect(async () => {}, []);
  return (
    <RecoilRoot>
      <PaperProvider>
        <Root>
          <Startup>
            <NativeRouter>
              <Switch>
                <Route exact path={"/"} component={LoginPage} />
                <Route exact path={"/signUp"} component={SignUp} />
                <Route exact path={"/verifyUser"} component={VerifyUserPage} />
                <Route exact path={"/tasks/:listName"} component={TaskPage} />
              </Switch>
            </NativeRouter>
          </Startup>
        </Root>
      </PaperProvider>
    </RecoilRoot>
  );
};

export default App;
