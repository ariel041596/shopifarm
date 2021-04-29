import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import { listTopProducts } from "../actions/productActions";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
}));

const ProductCarousel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.productTopRated);
  const { loading, error, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return loading ? (
    <Loading />
  ) : error ? (
    <ErrorMessage variant="danger">{error}</ErrorMessage>
  ) : (
    <Carousel className={classes.root} pause="hover" className="bg-dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link
            style={{
              marginTop: "50px",
              marginBottom: "30px",
              paddingTop: "10px",
              paddingBottom: "10px",
              objectFit: "cover",
            }}
            to={`/products/${product._id}`}
          >
            <Avatar
              alt={product.name}
              src={product.image}
              className={classes.large}
            />

            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (₱{product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
