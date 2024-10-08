import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Welcome from "./components/pages/Welcome";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import Default from "./components/pages/Default";
import CreateModulePage from "./components/pages/CreateModulePage";
import NotFound from "./components/pages/NotFound";
import NotAuthorized from "./components/pages/NotAuthorized";
import MyAccount from "./components/pages/MyAccount";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";

import { AuthenticatedUser } from "./types/AuthTypes";
import authAPIClient from "./APIClients/AuthAPIClient";
import * as Routes from "./constants/Routes";
import ManageUserPage from "./components/pages/ManageUserPage";
import { SocketProvider } from "./contexts/SocketContext";
import MakeHelpRequestPage from "./components/pages/MakeHelpRequestPage";
import ViewHelpRequestsPage from "./components/pages/ViewHelpRequestsPage";
import HelpRequestPage from "./components/pages/HelpRequestPage";
import CreatePasswordPage from "./components/pages/CreatePasswordPage";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser | null =
    getLocalStorageObj<AuthenticatedUser | null>(AUTHENTICATED_USER_KEY);

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(currentUser);

  // Some sort of global state. Context API replaces redux.
  // Split related states into different contexts as necessary.
  // Split dispatcher and state into separate contexts as necessary.
  const [sampleContext, dispatchSampleContextUpdate] = useReducer(
    sampleContextReducer,
    DEFAULT_SAMPLE_CONTEXT,
  );

  const HOUR_MS = 3300000;
  useEffect(() => {
    const interval = setInterval(async () => {
      if (currentUser != null) {
        const success = await authAPIClient.refresh();
        if (!success) {
          setAuthenticatedUser(null);
        }
      }
    }, HOUR_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [currentUser]);

  return (
    <SampleContext.Provider value={sampleContext}>
      <SampleContextDispatcherContext.Provider
        value={dispatchSampleContextUpdate}
      >
        <AuthContext.Provider
          value={{ authenticatedUser, setAuthenticatedUser }}
        >
          <SocketProvider id={authenticatedUser?.id}>
            <Router>
              <Switch>
                <Route exact path={Routes.WELCOME_PAGE} component={Welcome} />
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <PrivateRoute
                  exact
                  path={Routes.HOME_PAGE}
                  component={Default}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.MY_ACCOUNT_PAGE}
                  component={MyAccount}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.CREATE_MODULE_PAGE}
                  component={CreateModulePage}
                  allowedRoles={["Administrator"]}
                />
                <Route
                  exact
                  path={Routes.NOT_AUTHORIZED_PAGE}
                  component={NotAuthorized}
                />
                <PrivateRoute
                  exact
                  path={Routes.CREATE_PASSWORD_PAGE}
                  component={CreatePasswordPage}
                  allowedRoles={["Administrator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.MANAGE_USERS_PAGE}
                  component={ManageUserPage}
                  allowedRoles={["Administrator"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.MAKE_HELP_REQUEST_PAGE}
                  component={MakeHelpRequestPage}
                  allowedRoles={["Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.VIEW_HELP_REQUESTS_PAGE}
                  component={ViewHelpRequestsPage}
                  allowedRoles={["Facilitator"]}
                />
                <PrivateRoute
                  exact
                  path={`${Routes.VIEW_HELP_REQUESTS_PAGE}/:id`}
                  component={HelpRequestPage}
                  allowedRoles={["Facilitator"]}
                />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </Router>
          </SocketProvider>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
  );
};

export default App;
