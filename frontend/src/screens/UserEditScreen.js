import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import { USER_UPDATE_RESET } from "../constants/userConstants";

import { getUserDetails, updateUser } from "../actions/userActions";

import FormContainer from "../components/FormContainer";

const UserEditScreen = ({ match, history }) => {
  // serve as a variable
  const userID = match.params.id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: userUpdateLoading,
    error: userUpdateError,
    success: userUpdateSuccess,
  } = userUpdate;

  useEffect(() => {
    if (userUpdateSuccess) {
      dispatch({
        type: USER_UPDATE_RESET,
      });
      history.push("/admin/userlist");
    } else {
      if (!user || !user.name || user._id !== userID) {
        dispatch(getUserDetails(userID));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [userID, dispatch, user, userUpdateSuccess, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: userID,
        name,
        email,
        isAdmin,
      })
    );
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {userUpdateLoading && <Loading></Loading>}
        {userUpdateError && (
          <ErrorMessage variant="danger">{userUpdateError}</ErrorMessage>
        )}
        {loading ? (
          <Loading></Loading>
        ) : error ? (
          <ErrorMessage variant="danger">{error}</ErrorMessage>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="isAdmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Button type="submit" variant="dark">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
