import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import { PayPalButton } from "react-paypal-button-v2";

import {
  payOrder,
  deliverOrder,
  getOrderDetails,
} from "../actions/orderAction";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
  const orderID = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  if (!loading) {
    //   calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    const addPayPalScript = async () => {
      const { data: clientID } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderID) {
      dispatch({
        type: ORDER_PAY_RESET,
      });
      dispatch({
        type: ORDER_DELIVER_RESET,
      });
      dispatch(getOrderDetails(orderID));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderID, successPay, successDeliver, history, userInfo]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderID, paymentResult));
  };

  const successDeliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <ErrorMessage variant="danger">Error</ErrorMessage>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                {" "}
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order.user.email}`}> {order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <ErrorMessage variant="success">
                  Delivered at {order.deliveredAt}
                </ErrorMessage>
              ) : (
                <ErrorMessage variant="danger">Not Delivered</ErrorMessage>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment</h2>
              <p>
                <strong>Payment Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <ErrorMessage variant="success">
                  Paid on {order.paidAt}
                </ErrorMessage>
              ) : (
                <ErrorMessage variant="danger">Not Paid</ErrorMessage>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <ErrorMessage>Order is empty</ErrorMessage>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₱{item.price} = ₱{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>₱{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>₱{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>₱{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>₱{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loading></Loading>}
                  {!sdkReady ? (
                    <Loading></Loading>
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loading></Loading>}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      onClick={successDeliverHandler}
                      variant="primary"
                      type="button"
                      className="btn-block"
                    >
                      Mark As Deliver
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
