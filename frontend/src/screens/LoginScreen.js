import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Button, Form } from "react-bootstrap";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import { loginUser } from "../actions/userActions";

import FormContainer from "../components/FormContainer";

const LoginScreen = ({ location, history }) => {
  // serve as a variable
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading></Loading>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="dark">
          Sign In
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          New Customer? <span></span>
          <Link
            variant="primary"
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
