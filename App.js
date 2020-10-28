import React, { useEffect } from "react";
import { NativeRouter, Route, Switch } from "react-router-native";
import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import { RecoilRoot } from "recoil";
import TaskPage from "./pages/taskPage";
import Startup from "./components/startup";
import { Root } from "native-base";
import SplashScreen from "react-native-splash-screen";
import VerifyUserPage from "./pages/VerifyUserPage";
import { Provider as PaperProvider } from "react-native-paper";
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <PaperProvider>
      <RecoilRoot>
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
      </RecoilRoot>
    </PaperProvider>
  );
};

export default App;
