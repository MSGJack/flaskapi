import React, { useRef, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import apiAxios from "../assets/axiosConfig";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Container,
  Form,
  Heading,
  Box,
  Hero,
  Card,
  Image,
} from "react-bulma-components";
import { AuthContext } from "./Auth";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import logo from "../assets/sdg.png";

const validationSchema = yup
  .object({
    username: yup.string().required("Missing username"),
    email: yup.string().required("Missing email").email("Invalid email format"),
    password: yup.string().required("Missing password"),
  })
  .required();

const Register = () => {
  const { token, loading } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  console.log("errors", errors);

  const onSubmit = (data) => {
    console.log("data", data);
    apiAxios
      .post("/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log("succ", response);
        navigate("/login");
        enqueueSnackbar("You have successfully registered!", {
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
        console.log(error.response.data.error);
        console.log(error.response.status);
        console.log(error.request);
        if (error.response.data.error === "Username is already taken") {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.request);
          enqueueSnackbar("Username is already taken.", {
            variant: "error",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
          });
        } else if (error.response.data.error === "Email in use") {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.request);
          enqueueSnackbar("Email is already in use.", {
            variant: "error",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
          });
        }
      });
  };

  if (token) {
    return <Navigate to="/Mechs" replace />;
  }

  return (
    <>
      <Container className="mainConL">
        <Box className="loginBox">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading className="centerHead">Sign Up</Heading>
            <Hero size="small">
              <Hero.Body>
                <Image src={logo} size="5by3" />
              </Hero.Body>
            </Hero>
            <Form.Field>
              <Form.Label>Username</Form.Label>
              <Form.Control>
                <input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  {...register("username")}
                />
                {errors.username && <span>{errors.username.message}</span>}
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Email</Form.Label>
              <Form.Control>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  {...register("email")}
                />
                {errors.email && <span>{errors.email.message}</span>}
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Password</Form.Label>
              <Form.Control>
                <input
                  placeholder="Password"
                  name="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && <span>{errors.password.message}</span>}
              </Form.Control>
            </Form.Field>
            <div className="displayFC">
              <Button
                type="submit"
                color="link"
                rounded
                style={{ marginBottom: "3px" }}
              >
                Sign up
              </Button>
            </div>
          </form>
          <hr />
          <div className="displayFC">
            <Button rounded color="white">
              <Link to="/login">Already Have an Account?</Link>
            </Button>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default Register;
