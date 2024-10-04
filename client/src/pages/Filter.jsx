import React, { useState, useEffect } from "react";
import apiAxios from "../assets/axiosConfig";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Content,
  Heading,
  Footer,
  Progress,
  Button,
  Block,
} from "react-bulma-components";

const FilterList = ({ Filter, mechsItems, uni }) => {
  return (
    <>
      <div>
        {mechsItems.map((val, index) => (
          <div key={index}>
            <Button onClick={() => Filter(val)}>{val}</Button>
          </div>
        ))}
      </div>
      <Button>All</Button>
    </>
  );
};

export default FilterList;
