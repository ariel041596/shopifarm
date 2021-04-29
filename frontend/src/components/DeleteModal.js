import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = (props) => {
  useEffect(() => {}, [props]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">DELETE</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Confirm!</h4>
        <p>Are you sure want to delete?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={props.onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
