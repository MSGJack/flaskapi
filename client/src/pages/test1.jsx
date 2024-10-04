import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Auth";
import {
  Button,
  Container,
  Form,
  Heading,
  Icon,
  Box,
  Content,
} from "react-bulma-components";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import apiAxios from "../assets/axiosConfig";
import { useForm } from "react-hook-form";

const validationSchema = yup.object({
  username: yup.string().required("Missing username"),
  email: yup.string().required("Missing email").email("Invalid email format"),
  password: yup.string().required("Missing password"),
});

function Dashboard() {
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
  /*
  const { token, loading } = useContext(AuthContext);
  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }
*/
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
        // setIsAuthenticated(true);
        console.log("succ", response);
        enqueueSnackbar(
          "Logged in successfully",
          { variant: "success" },
          { autoHideDuration: 400 }
        );
        navigate("/dashboard");
        enqueueSnackbar(
          "You have logged in successfully",
          { variant: "success" },
          { autoHideDuration: 1000 },
          {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
          }
        );
      })
      .catch((error) => {
        console.log("error", error.response.data);
        console.error("Authentication failed:", error.response.status);
        setToken(null);
        localStorage.removeItem("token");
        if (error.response.data.error === "Username does not exsit") {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log(error.request);
        } else if (error.response.data.error === "Email not in use") {
          console.log("email ERROR");
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log(error.request);
        }
      });
  };

  return (
    <>
      <Container widescreen>
        <Box
          style={{
            width: "30rem",
            margin: "auto",
            padding: "2.5rem",
          }}
        >
          <form className="nonvr">
            <Form.Field>
              <Heading
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textDecoration: "underline",
                }}
              >
                Login
              </Heading>
              <Form.Label>UserName</Form.Label>
              <Form.Control>
                <input
                  placeholder="Username"
                  name="username"
                  className="input3"
                  {...register("username")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Email</Form.Label>
              <Form.Control>
                <input placeholder="Email" name="email" type="email" />
              </Form.Control>
            </Form.Field>
            <Form.Field>
              <Form.Label>Password</Form.Label>
              <Form.Control>
                <input placeholder="Password" name="password" type="password" />
              </Form.Control>
            </Form.Field>
          </form>
          <div
            style={{
              padding: ".1rem",
              display: "flex",
              justifyContent: "center",
              textDecoration: "underline",
              margin: "1rem",
            }}
          >
            <Button color="primary">Login</Button>
          </div>
        </Box>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "3px",
            padding: ".4rem",
          }}
        >
          <Content>
            Don't have an account?{" "}
            <span>
              <Link to="/register">Sign up</Link>
            </span>
          </Content>
        </div>
      </Container>
    </>
  );
}

export default Dashboard;
