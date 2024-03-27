import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";
import Login from "./Login";
import PhenoTypeViewer from "./PhenoTypeViewer";
import DataLibrary from "./DataLibrary";
import Gene from "./Gene";
import Home from "./Home";
import Signup from "./Signup";
import Verify from "./Verify";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import TableView from "./TableView";
import {Logout} from "./Logout"
import useSetBataBase from "./hooks/useSetBataBase";
const Body = () => {
  useSetBataBase()
  const isAuthenticated = useIsAuthenticated();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const appRouter = createBrowserRouter([
    {
      path: "/verify",
      element: <Verify/>,
    },
    {
      path: "/",
      element: !(isAuthenticated || userInfo) ? <Login /> : <Home />,
    },
    {
      path: "/signup",
      element: !(isAuthenticated || userInfo) ? <Signup /> : <Home />,
    },
    {
      path: "/tbview",
      element: (isAuthenticated || userInfo) ? <TableView /> : <Login />,
    },
    {
      path: "/ptviewer",
      element: (isAuthenticated || userInfo) ? <PhenoTypeViewer /> : <Login />,
    },
    {
      path: "/datalibrary",
      element: (isAuthenticated || userInfo) ? <DataLibrary /> : <Login />,
    },
    {
      path: "/gene",
      element: (isAuthenticated || userInfo) ? <Gene /> : <Login />,
    },
    {
      path: "/home",
      element: (isAuthenticated || userInfo) ? <Home /> : <Login />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/confirm-password-reset",
      element: <ResetPassword />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
