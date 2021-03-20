import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Axios from "axios";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Chat from "./Chat/Chat";
import Loading from "../Loading/Loading";
import UserContext from "../context/UserContext";

export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check if Logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "http://localhost:5000/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        const userRes = await Axios.get("http://localhost:5000/users/", {
          headers: { "x-auth-token": token },
        });
        await setUserData({
          token,
          user: userRes.data,
        });
        setIsLoading(false);
      }

      if (!tokenRes.data) {
        setIsLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <>
      {!isLoading ? (
        <>
          <BrowserRouter>
            <UserContext.Provider value={{ userData, setUserData }}>
              <Switch>
                <Route exact path="/" component={Chat} />
                {!userData.user ? (
                  <>
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                  </>
                ) : (
                  <Redirect to="/" />
                )}
              </Switch>
            </UserContext.Provider>
          </BrowserRouter>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
