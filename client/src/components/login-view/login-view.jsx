import React, { useState } from "react";
import propTypes from "prop-types";
import { Form, Button } from "react-bootstrap";
import "./login-view.scss";
import logo from "../../images/myFlix.png";
import axios from "axios";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

export function LoginView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    // props.onLoggedIn(username);
    axios
      .post("http://clemflixdb.herokuapp.com/login", {
        Username: username,
        Password: password,
      })
      .then((reponse) => {
        const data = reponse.data;
        props.onLoggedIn(data);
      })
      .catch((e) => {
        console.log("no such user");
      });
  };

  return (
    <Container className="login-container">
      <Form className="login-form">
        <img src={logo} alt="logo" style={{ width: "300px" }} />
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="btn-lg btn-dark btn-block"
          type="submit"
          onClick={handleSubmit}
        >
          Login
        </Button>
        <div className="registration">Not registered yet ?</div>
        <Link to={`/register`}>
          <Button variant="link" className="registerButton" type="submit">
            Sign Up
          </Button>
        </Link>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
  onLoggedIn: propTypes.func.isRequired,
};
