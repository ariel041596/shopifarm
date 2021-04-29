import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row, Button, Table, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import DeleteModal from "../components/DeleteModal";
import Paginate from '../components/Paginate'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions.js";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = ({ history, match }) => {
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState("");

  const pageNumber = match.params.pageNumber || 1;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    error: errorDelete,
    loading: loadingDelete,
    success: successDelete,
  } = productDelete;

  useEffect(() => {
    dispatch({
      type: PRODUCT_CREATE_RESET,
    });
    if (!userInfo && !userInfo.isAdmin) {
      history.push("/login");
    }
    if (successCreate) {
      history.push(`/admin/products/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber
  ]);

  const deleteProductHandler = () => {
    dispatch(deleteProduct(productID));
    handleClose();
  };

  const handleShowModal = (productID) => {
    handleShow();
    setProductID(productID);
  };
  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loading></Loading>}
      {errorCreate && (
        <ErrorMessage variant="danger">{errorCreate}</ErrorMessage>
      )}
      {loadingDelete && <Loading></Loading>}
      {errorDelete && (
        <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
      )}
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <ErrorMessage variant="danger">{error}</ErrorMessage>
      ) : products.length === 0 ? (
        <h1>No Products Available</h1>
      ) : (
        <>
        <Table striped bordered hover responsive="md" className="table-sm">
          <thead>
            <tr>
              <th>NAME</th>
              <th>IMAGE</th>
              <th>BRAND</th>
              <th>CATEGORY</th>
              <th>PRICE</th>
              <th>COUNT IN STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>
                  <Col md={3}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                </td>
                <td>{product.brand}</td>
                <td>{product.category}</td>
                <td>₱{product.price}</td>
                <td>{product.countInStock}</td>
                <td>
                  <LinkContainer to={`/admin/products/${product._id}/edit`}>
                    <Button className="btn-sm" variant="primary">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    onClick={() => handleShowModal(product._id)}
                    className="btn-sm"
                    variant="danger"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>

                  <DeleteModal
                    show={show}
                    onHide={() => setShow(false)}
                    onConfirm={deleteProductHandler}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate
            pages={pages}
            page={page}
            isAdmin={userInfo.isAdmin}
          ></Paginate>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
