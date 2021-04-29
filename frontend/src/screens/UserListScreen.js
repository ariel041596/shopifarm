import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table } from "react-bootstrap";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import DeleteModal from "../components/DeleteModal";

import { getUserList, deleteUser } from "../actions/userActions";

const UserListScreen = ({ history }) => {
  const [show, setShow] = useState(false);
  const [userID, setUserID] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getUserList());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteUserHandler = () => {
    dispatch(deleteUser(userID));
    handleClose();
  };
  const handleShowModal = (userID) => {
    handleShow();
    setUserID(userID);
  };

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/users/${user._id}/edit`}>
                    <Button className="btn-sm" variant="primary">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    onClick={() => handleShowModal(user._id)}
                    className="btn-sm"
                    variant="danger"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>

                  <DeleteModal
                    show={show}
                    onHide={() => setShow(false)}
                    onConfirm={() => deleteUserHandler()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
