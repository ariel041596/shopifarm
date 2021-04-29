import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Product from "../components/Product";
import Loading from "../components/Loading";
import Paginate from "../components/Paginate";
import ErrorMessage from "../components/ErrorMessage";
import Meta from "../components/Meta";
import ProductCarousel from "../components/ProductCarousel";
import { listProducts } from "../actions/productActions.js";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta></Meta>
      {!keyword ? (
        <ProductCarousel></ProductCarousel>
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Latest Product</h1>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : products.length === 0 ? (
        <ErrorMessage>No Products Found</ErrorMessage>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product}></Product>
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          ></Paginate>
        </>
      )}
    </>
  );
};

export default HomeScreen;
