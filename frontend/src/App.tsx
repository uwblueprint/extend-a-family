import { CssBaseline } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useReducer, useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import authAPIClient from "./APIClients/AuthAPIClient";
import PrivateRoute from "./components/auth/PrivateRoute";
import Signup from "./components/auth/SignupPage";
import Welcome from "./components/auth/WelcomePage";
import CreateModulePage from "./components/pages/CreateModulePage";
import Default from "./components/pages/Default";
import MyAccount from "./components/pages/MyAccountPage";
import NotAuthorized from "./components/pages/NotAuthorized";
import NotFound from "./components/pages/NotFound";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import * as Routes from "./constants/Routes";
import AuthContext from "./contexts/AuthContext";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import { SocketProvider } from "./contexts/SocketContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import { AuthenticatedUser } from "./types/AuthTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

import CreatePasswordPage from "./components/auth/CreatePasswordPage";
import ForgotPasswordPage from "./components/auth/forgot_password/ForgotPasswordPage";
import CourseViewingPage from "./components/course_viewing/CourseViewingPage";
import UploadThumbnailPage from "./components/courses/UploadThumbnailPage";
import HelpRequestPage from "./components/pages/HelpRequestPage";
import LessonUpload from "./components/pages/LessonUpload";
import MakeHelpRequestPage from "./components/pages/MakeHelpRequestPage";
import ManageUserPage from "./components/user_management/ManageUserPage";
import ViewHelpRequestsPage from "./components/pages/ViewHelpRequestsPage";
import ViewModulePage from "./components/pages/ViewModulePage";

const App = (): React.ReactElement => {
  const currentUser: AuthenticatedUser | null =
    getLocalStorageObj<AuthenticatedUser | null>(AUTHENTICATED_USER_KEY);

  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser | null>(currentUser);

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

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <SampleContext.Provider value={sampleContext}>
      <CssBaseline />
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
                <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                <Route
                  exact
                  path={Routes.FORGOT_PASSWORD_PAGE}
                  component={ForgotPasswordPage}
                />
                <PrivateRoute
                  exact
                  path={Routes.UPLOAD_THUMBNAIL}
                  component={UploadThumbnailPage}
                  allowedRoles={["Administrator"]}
                />
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
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <Route
                  exact
                  path={Routes.MANAGE_USERS_PAGE}
                  component={ManageUserPage}
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
                <PrivateRoute
                  exact
                  path={Routes.COURSE_PAGE}
                  component={CourseViewingPage}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
                />
                <PrivateRoute
                  exact
                  path={Routes.LESSON_UPLOAD}
                  component={LessonUpload}
                  allowedRoles={["Administrator"]}
                />
                <PrivateRoute
                  exact
                  path={`${Routes.VIEW_PAGE}`}
                  component={ViewModulePage}
                  allowedRoles={["Administrator", "Facilitator", "Learner"]}
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
