import { CssBaseline } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useReducer, useState } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import authAPIClient from "./APIClients/AuthAPIClient";
import PrivateRoute from "./components/auth/PrivateRoute";
import SignupApproved from "./components/auth/SignupApprovedPage";
import Signup from "./components/auth/SignupPage";
import SignupPending from "./components/auth/SignupPendingPage";
import Welcome from "./components/auth/WelcomePage";
import Bookmarks from "./components/pages/Bookmarks";
import CreateModulePage from "./components/pages/CreateModulePage";
import FinishedModules from "./components/pages/FinishedModules";
import Home from "./components/pages/Home";
import NotAuthorized from "./components/pages/NotAuthorized";
import NotFound from "./components/pages/NotFound";
import MyAccount from "./components/profile/MyAccountPage";
import AUTHENTICATED_USER_KEY from "./constants/AuthConstants";
import * as Routes from "./constants/Routes";
import AuthContext from "./contexts/AuthContext";
import SampleContext, {
  DEFAULT_SAMPLE_CONTEXT,
} from "./contexts/SampleContext";
import SampleContextDispatcherContext from "./contexts/SampleContextDispatcherContext";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationsProvider } from "./contexts/NotificationsContext";
import { FeedbacksProvider } from "./contexts/FeedbacksContext";
import sampleContextReducer from "./reducers/SampleContextReducer";
import { AuthenticatedUser } from "./types/AuthTypes";
import { getLocalStorageObj } from "./utils/LocalStorageUtils";

import CreatePasswordPage from "./components/auth/CreatePasswordPage";
import ForgotPasswordPage from "./components/auth/forgot_password/ForgotPasswordPage";
import CourseViewingPage from "./components/course_viewing/CourseViewingPage";
import FeedbackAdminView from "./components/feedback/feedback-admin-view/FeedbackAdminView";
import FeedbackFacilitatorView from "./components/feedback/FeedbackFacilitatorView";
import HelpRequestPage from "./components/pages/HelpRequestPage";
import LessonUpload from "./components/pages/LessonUpload";
import MakeHelpRequestPage from "./components/pages/MakeHelpRequestPage";
import ViewHelpRequestsPage from "./components/pages/ViewHelpRequestsPage";
import ViewModulePage from "./components/pages/ViewModulePage";
import ManageUserPage from "./components/user_management/ManageUserPage";

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
            <NotificationsProvider>
              <FeedbacksProvider>
                <Router>
                  <Switch>
                    <Route
                      exact
                      path={Routes.WELCOME_PAGE}
                      component={Welcome}
                    />
                    <Route exact path={Routes.SIGNUP_PAGE} component={Signup} />
                    <Route
                      exact
                      path={Routes.SIGNUP_APPROVED_PAGE}
                      component={SignupApproved}
                    />
                    <Route
                      exact
                      path={Routes.SIGNUP_PENDING_PAGE}
                      component={SignupPending}
                    />
                    <Route
                      exact
                      path={Routes.FORGOT_PASSWORD_PAGE}
                      component={ForgotPasswordPage}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.LANDING_PAGE}
                      component={() => (
                        <Redirect
                          to={
                            currentUser?.role === "Facilitator" ||
                            currentUser?.role === "Administrator"
                              ? Routes.COURSE_PAGE
                              : Routes.HOME_PAGE
                          }
                        />
                      )}
                      allowedRoles={["Administrator", "Facilitator", "Learner"]}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.HOME_PAGE}
                      component={Home}
                      allowedRoles={["Learner"]}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.BOOKMARKS_PAGE}
                      component={Bookmarks}
                      allowedRoles={["Administrator", "Facilitator", "Learner"]}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.FINISHED_MODULES_PAGE}
                      component={FinishedModules}
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
                    <PrivateRoute
                      exact
                      path={Routes.MANAGE_USERS_PAGE}
                      component={ManageUserPage}
                      allowedRoles={["Administrator", "Facilitator"]}
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
                      path={Routes.VIEW_PAGE}
                      component={ViewModulePage}
                      allowedRoles={["Administrator", "Facilitator", "Learner"]}
                    />
                    <PrivateRoute
                      exact
                      path={Routes.FEEDBACK_PAGE}
                      component={
                        currentUser?.role === "Administrator"
                          ? FeedbackAdminView
                          : FeedbackFacilitatorView
                      }
                      allowedRoles={["Administrator", "Facilitator"]}
                    />
                    <Route exact path="*" component={NotFound} />
                  </Switch>
                </Router>
              </FeedbacksProvider>
            </NotificationsProvider>
          </SocketProvider>
        </AuthContext.Provider>
      </SampleContextDispatcherContext.Provider>
    </SampleContext.Provider>
  );
};

export default App;
