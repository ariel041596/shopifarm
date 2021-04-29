import React, { useState } from "react";
import { Form } from "react-bootstrap";
import {
  FormHelperText,
  FormControl,
  Input,
  InputLabel,
  TextField,
  InputBase,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <FormControl onChange={(e) => setKeyword(e.target.value)}>
        <TextField
          placeholder="Search Products"
          id="outlined-basic"
          variant="outlined"
          size="small"
          color="secondary"
        ></TextField>
      </FormControl>
      <Button
        className="ml-2"
        startIcon={<SearchIcon />}
        size="medium"
        variant="outlined"
        type="submit"
        color="primary"
      >
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
