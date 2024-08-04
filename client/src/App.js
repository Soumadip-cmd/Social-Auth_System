import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Home from "./components/Home";


function App() {
  

  

  const router = createBrowserRouter([

    {
      path: "/",
      element: <Login/>
    },
    {
      path: "/signup",
      element: <SignUp/>
    },
    {
      path: "/home",
      element: <Home/>
      
    },
  ]);

  return (
    <>
      
      
        <RouterProvider router={router} />
      
    </>
  );
}

export default App;
