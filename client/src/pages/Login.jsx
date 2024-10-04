import React, { useState, useContext } from "react";
import apiAxios from "../assets/axiosConfig";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  Container,
  Form,
  Heading,
  Box,
  Content,
  Hero,
  Image,
} from "react-bulma-components";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import { useSnackbar } from "notistack";
import ship from "../assets/iardacil.jpg";

const validationSchema = yup
  .object({
    username: yup.string().required("Missing username"),
    email: yup.string().required("Missing email").email("Invalid email format"),
    password: yup.string().required("Missing password"),
  })
  .required();
const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    await apiAxios
      .post("/login", {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        setToken(response.data.access_token);
        localStorage.setItem("access_token", response.data.access_token);
        console.log(`Token is ${response.data.access_token}`);
        navigate("/");
        enqueueSnackbar("You have logged in successfully", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        });
      })
      .catch((error) => {
        console.log("error", error.response.data);
        setToken(null);
        localStorage.removeItem("token");
        if (error.response.data.error === "Username does not exsit") {
          enqueueSnackbar("Username is not in use.", {
            variant: "error",
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
          });
        } else if (
          error.response.data.error === "passwords do not match" ||
          "Email not in use"
        ) {
          console.log(error.response.data);
          console.log(error.response.status);
          enqueueSnackbar("Password or Email is incorrect", {
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

  return (
    <>
      <Container className="mainConL">
        <Box className="loginBox">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Heading className="centerHead">Login</Heading>
            <Hero color="dark" size="small">
              <Hero.Body>
                <Image src={ship} size="5by3" />
              </Hero.Body>
            </Hero>
            <Form.Field>
              <Form.Label>Username</Form.Label>
              <Form.Control>
                <input
                  placeholder="Username"
                  name="username"
                  {...register("username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                />
              </Form.Control>
              {errors.username && <span>{errors.username.message}</span>}
            </Form.Field>
            <Form.Field>
              {" "}
              <Form.Control>
                <Form.Label>Email</Form.Label>
                <input
                  placeholder="Email"
                  type="email"
                  name="email"
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
                  onChange={(e) => setPassword(e.target.value)}
                  {...register("password")}
                />
              </Form.Control>
              {errors.password && <span>{errors.password.message}</span>}
            </Form.Field>
            <div className="displayFC">
              <Button
                type="submit"
                color="link"
                rounded
                style={{ marginBottom: "3px" }}
              >
                Login
              </Button>
            </div>
          </form>
          <hr />
          <div className="displayLink">
            {" "}
            <Content>
              Don't have an account?{" "}
              <span>
                <Link to="/register">Sign Up Here</Link>
              </span>
            </Content>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default Login;
