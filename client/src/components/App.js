import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Axios from "axios";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import Chat from "./Chat/Chat";
import Loading from "../Loading/Loading";
import UserContext from "../context/UserContext";
import URLServerContext from "../context/URLServerContext";
import DisplayWidthContext from "../context/DisplayWidthContext";

export default function App() {
  const URL = "https://omer-mern-chat.herokuapp.com";
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener("resize", () => setWidth(window.innerWidth));

  // Check if Logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(`${URL}/users/tokenIsValid`, null, {
        headers: { "x-auth-token": token },
      });
      if (tokenRes.data) {
        const userRes = await Axios.get(`${URL}/users/`, {
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

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", setWidth(window.innerWidth));
  }, [width]);

  return (
    <>
      {!isLoading ? (
        <>
          <URLServerContext.Provider value={{ URL }}>
            <BrowserRouter>
              <UserContext.Provider value={{ userData, setUserData }}>
                <DisplayWidthContext.Provider value={{ width }}>
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
                </DisplayWidthContext.Provider>
              </UserContext.Provider>
            </BrowserRouter>
          </URLServerContext.Provider>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
