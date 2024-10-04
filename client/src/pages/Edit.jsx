import React, { useState, useEffect } from "react";
import apiAxios from "../assets/axiosConfig";
import { useForm } from "react-hook-form";
import { replace, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Button,
  Form,
  Heading,
  Block,
  Container,
} from "react-bulma-components";

const EditMS = ({ information, id }) => {
  const [description, setDescription] = useState(information.description);
  const [name, setName] = useState(information.name);
  const [universe, setUniverse] = useState(information.universe);
  const [img_url, setImg_url] = useState(information.img_url);
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const updateDescription = async (data) => {
    const access_token = localStorage.getItem("access_token");
    console.log(data);
    try {
      const response = await apiAxios.patch(
        `/mechs/${id}`,
        {
          name: data.name,
          universe: data.universe,
          description: data.description,
          img_url: data.img_url,
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        }
      );
      console.log(response.status);
      if (response.status === 200) {
        navigate("/usermechs");
        enqueueSnackbar("MS has been updated!", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        });
      }
    } catch (error) {
      console.log(error);
      console.error(error.message);
      console.log(error.response.data.error);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.request);
    }
  };

  return (
    <>
      <Container>
        <form onSubmit={handleSubmit(updateDescription)}>
          <Heading className="headerCenter">Edit Mobile Suit</Heading>
          <Form.Field>
            <Form.Label>Name</Form.Label>
            <Form.Control>
              <input
                type="text"
                name="name"
                {...register("name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label>Universe</Form.Label>
            <Form.Control>
              <input
                type="text"
                name="universe"
                {...register("universe")}
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label>Description</Form.Label>
            <Form.Control>
              <input
                type="text"
                name="description"
                {...register("description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Label>Image</Form.Label>
            <Form.Control>
              <input
                type="text"
                name="img_url"
                {...register("img_url")}
                value={img_url}
                onChange={(e) => setImg_url(e.target.value)}
              />
            </Form.Control>
          </Form.Field>
          <div className="formButton">
            <Button type="submit" color="link" rounded>
              Update Mobile Suit
            </Button>
          </div>
        </form>
      </Container>
    </>
  );
};

export default EditMS;
