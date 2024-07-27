import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useReducer, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { io, Socket } from "socket.io-client";
import Welcome from "./components/pages/Welcome";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import PrivateRoute from "./components/auth/PrivateRoute";
import CreatePage from "./components/pages/CreatePage";
import Default from "./components/pages/Default";
import CreateModulePage from "./components/pages/CreateModulePage";
import DisplayPage from "./components/pages/DisplayPage";
import NotFound from "./components/pages/NotFound";
import NotAuthorized from "./components/pages/NotAuthorized";
import UpdatePage from "./components/pages/UpdatePage";
import MyAccount from "./components/pages/MyAccount";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import AuthContext from "./contexts/AuthContext";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import EditTeamInfoPage from "./components/pages/EditTeamPage";
import HooksDemo from "./components/pages/HooksDemo";

import { AuthenticatedUser } from "./types/AuthTypes";
import authAPIClient from "./APIClients/AuthAPIClient";
import * as Routes from "./constants/Routes";
import ManageUserPage from "./components/pages/ManageUserPage";
import { SocketContext } from "./contexts/SocketContext";
import MakeHelpRequestPage from "./components/pages/MakeHelpRequestPage";
import ViewHelpRequestPage from "./components/pages/ViewHelpRequestsPage";

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

  const socketRef = useRef<Socket | null>(null); // avoid infinite rerenders

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

  useEffect(() => {
    if (!currentUser) return;
    socketRef.current = io(process.env.REACT_APP_BACKEND_URL as string, {
      autoConnect: false, // can make it so we need a current user for this to work at all
      query: { userId: currentUser.id },
    });

    socketRef.current.connect();

    socketRef.current.on("connect", () => {
      console.log("connected");
    });
    socketRef.current.on(
      "notification:new",
      (data) => console.log("new notification", data),
      // need to like set it in like a global state later
    );
    // eslint-disable-next-line consistent-return
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [currentUser]);

  return (
    <SampleContext.Provider value={sampleContext}>
      <SampleContextDispatcherContext.Provider
        value={dispatchSampleContextUpdate}
      >
        <AuthContext.Provider
          value={{ authenticatedUser, setAuthenticatedUser }}
        >
          <SocketContext.Provider value={socketRef.current}>
            <Router>
              <Switch>
                <Route exact path={Routes.WELCOME_PAGE} component={Welcome} />
                <Route exact path={Routes.LOGIN_PAGE} component={Login} />
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <Route exact path={Routes.HOOKS_PAGE} component={HooksDemo} />
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
                  path={Routes.CREATE_ENTITY_PAGE}
                  component={CreatePage}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.UPDATE_ENTITY_PAGE}
                  component={UpdatePage}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.DISPLAY_ENTITY_PAGE}
                  component={DisplayPage}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.CREATE_MODULE_PAGE}
                  component={CreateModulePage}
                  allowedRoles={["Administrator"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.EDIT_TEAM_PAGE}
                  component={EditTeamInfoPage}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <Route
                  exact
                  path={Routes.NOT_AUTHORIZED_PAGE}
                  component={NotAuthorized}
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
                  component={ViewHelpRequestPage}
                  allowedRoles={["Facilitator"]}
                />
                <Route exact path="*" component={NotFound} />
              </Switch>
            </Router>
          </SocketContext.Provider>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
  );
};

export default App;
