import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container, Row, Col, Jumbotron } from "react-bootstrap";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/svg-arrow.css";
import "tippy.js/themes/light.css";
import UserContext from "../../context/UserContext";
import "./auth.css";
import Axios from "axios";

export default function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const loginUser = { username, password };
      const loginRes = await Axios.post(
        "http://localhost:5000/users/login",
        loginUser
      );
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      localStorage.setItem("username", loginRes.data.user.username);
      history.push("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const registerRoute = () => history.push("/register");

  return (
    <Jumbotron
      className="d-flex align-items-center min-vh-100"
      style={{ background: "transparent" }}
    >
      <Container fluid="sm">
        <Row className="justify-content-center">
          <Col xs="12" sm="10" md="8" lg="6">
            <Form onSubmit={submit}>
              <Form.Group
                controlId="formBasic"
                onChange={(e) => setUsername(e.target.value)}
              >
                <Form.Label className="label">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </Form.Group>
              <Form.Group
                controlId="formBasicPassword"
                onChange={(e) => setPassword(e.target.value)}
              >
                <Form.Label className="label">Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" />
              </Form.Group>
              <div className="btn-div">
                <Button
                  className="shadow-none"
                  size="lg"
                  variant="outline-light"
                  onClick={registerRoute}
                >
                  Don't have an account? Register Here!
                </Button>
              </div>
              <div className="btn-div">
                <Tippy
                  placement={"bottom"}
                  theme={"light"}
                  visible={error ? true : false}
                  content={error}
                >
                  <button
                    onClick={() => setError(undefined)}
                    id="form-btn"
                    variant="link"
                    type="submit"
                  >
                    Log in
                  </button>
                </Tippy>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
  );
}
