import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3  rounded">
      <Link to={`/products/${product._id}`}>
        <Card.Img
          style={{ height: "180px" }}
          variant="top"
          src={product.image}
        ></Card.Img>
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={` ${product.numReviews} reviews`}
          ></Rating>
        </Card.Text>
        <Card.Text as="h3">₱{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
