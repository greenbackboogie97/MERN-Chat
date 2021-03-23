import React, { useContext, useState } from "react";
import { Form, Button, Container, Row, Col, Jumbotron } from "react-bootstrap";
import "./auth.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/svg-arrow.css";
import "tippy.js/themes/light.css";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";

export default function Register() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const newUser = { username, password, passwordCheck, displayName };
      await Axios.post("http://localhost:5000/users/register", newUser);
      const loginRes = await Axios.post("http://localhost:5000/users/login", {
        username,
        password,
      });
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

  const loginRoute = () => history.push("/login");

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
                <Form.Label className="label">* Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group
                controlId="formBasicPassword"
                onChange={(e) => setPassword(e.target.value)}
              >
                <Form.Label className="label">* Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  autoCorrect="off"
                />
              </Form.Group>
              <Form.Group
                controlId="formBasicPasswordCheck"
                onChange={(e) => setPasswordCheck(e.target.value)}
              >
                <Form.Label className="label">* Confirm password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" />
              </Form.Group>
              <Form.Group
                controlId="formBasicDisplayName"
                onChange={(e) => setDisplayName(e.target.value)}
              >
                <Form.Label className="label">Display name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Set display name"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </Form.Group>
              <div className="btn-div">
                <Button
                  className="shadow-none"
                  size="lg"
                  variant="outline-light"
                  onClick={loginRoute}
                >
                  Already have an account? Log in Here!
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
                    type="submit"
                  >
                    Register
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
