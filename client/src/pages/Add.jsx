import React, { useState, useEffect } from "react";
import apiAxios from "../assets/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  Container,
  Content,
  Heading,
  Footer,
  Progress,
  Form,
  Box,
  Button,
} from "react-bulma-components";
import { useSnackbar } from "notistack";

const AddMS = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [universe, setUniverse] = useState("");
  const [img_url, setImg_url] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    let access_token = localStorage.getItem("access_token");
    apiAxios
      .post(
        "/mechs",
        {
          name: data.name,
          description: data.description,
          universe: data.universe,
          img_url: data.img_url,
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      )
      .then((response) => {
        console.log("succ", response);
        navigate("/mechs");
        enqueueSnackbar("Mech has successfully been created!", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        });
      })
      .catch((error) => {
        console.log("error", error);
        console.log(error.response.status);
        console.log(error.response.headers);
        console.log(error.request);
        if (error.response.data.error === "MS already exists") {
          alert("Mech already exists");
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log(error.request);
        }
      });
  };

  return (
    <>
      <Container style={{ padding: "1rem" }}>
        <Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading size={1} className="displayFC">
              Add New Mobile Suit
            </Heading>
            <Form.Field>
              <Form.Label size="medium">Name</Form.Label>
              <Form.Control>
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  {...register("name")}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label size="medium">Universe</Form.Label>
              <Form.Control>
                <input
                  type="text"
                  placeholder="Universe"
                  onChange={(e) => setUniverse(e.target.value)}
                  {...register("universe")}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label size="medium">Description</Form.Label>
              <Form.Control>
                <input
                  type="text"
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  {...register("description")}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label size="medium">Image</Form.Label>
              <Form.Control>
                <input
                  type="text"
                  placeholder="Image URL"
                  onChange={(e) => setImg_url(e.target.value)}
                  {...register("img_url")}
                />
              </Form.Control>
            </Form.Field>
            <hr />
            <div className="displayFC">
              <Button
                type="submit"
                color="link"
                rounded
                style={{ marginBottom: "3px" }}
              >
                Add Mecha
              </Button>
            </div>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default AddMS;
