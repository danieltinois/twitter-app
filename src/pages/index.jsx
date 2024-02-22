//teste

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";

export const Pages = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "sign-up",
      element: <SignUp />,
    },
    {
      path: "sign-in",
      element: <SignIn />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};
