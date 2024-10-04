import React, { useEffect, useContext, useState } from "react";
import apiAxios from "../assets/axiosConfig";
import glogo from "../assets/sdg.png";
import { Link, useNavigate } from "react-router-dom";
import "bulma/css/bulma.css";
import {
  Button,
  Container,
  Navbar,
  Columns,
  Heading,
  Dropdown,
  Icon,
  Image,
} from "react-bulma-components";
import { AuthContext } from "./Auth";
import { useSnackbar } from "notistack";
import zaku from "../assets/gltest.jpg";

const Home = () => {
  const { token, loading, setToken } = useContext(AuthContext);
  const [name, setName] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [isActive, setIsActive] = useState(false);

  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

  const logout = (e) => {
    e.preventDefault();
    setToken(null);
    localStorage.removeItem("access_token");
    navigate("/");
    enqueueSnackbar("You have logged out successfully", {
      variant: "success",
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    });
  };

  if (token) {
    async function getName() {
      let access_token = localStorage.getItem("access_token");
      await apiAxios
        .get("/get_name", {
          headers: {
            Authorization: "Bearer " + access_token,
          },
        })
        .then((response) => {
          console.log(response.data);
          setName(response.data);
        })
        .catch((error) => {
          console.log(error);
          console.error(error.message);
          console.log("error", error);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log(error.request);
          console.error("Failed to fetch user name:", error);
        });
    }
  }
  /* useEffect(() => {
    getName();
  }, []);
*/
  return (
    <>
      {" "}
      <Navbar
        color="black"
        fixed="top"
        active={isActive}
        style={{ boxShadow: "0 0 0.8rem .1rem white" }}
      >
        <Navbar.Brand>
          <Navbar.Item href="/">
            <h2 className="brandM">G-Battle</h2>
            <Image src={zaku} size={32} />
          </Navbar.Item>
          <Navbar.Burger onClick={toggleNavbar} />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Container>
            <Navbar.Item href="/Mechs" className="navDisplay">
              Mechs
            </Navbar.Item>
            <Navbar.Item href="/Users" className="navDisplay">
              Users
            </Navbar.Item>
          </Navbar.Container>
          {token ? (
            <>
              {" "}
              <Navbar.Container align="center">
                <Navbar.Item>{name.name}</Navbar.Item>
              </Navbar.Container>
              <Navbar.Container style={{ display: "flex" }} align="end">
                <Navbar.Item>
                  <Button
                    rounded
                    inverted
                    outlined
                    color="link"
                    onClick={(e) => logout(e)}
                  >
                    Logout
                  </Button>
                </Navbar.Item>
                <Navbar.Item href="/usermechs">
                  <Button rounded inverted outlined color="info">
                    Your Mechs
                  </Button>
                </Navbar.Item>
              </Navbar.Container>{" "}
            </>
          ) : (
            <>
              <Navbar.Container style={{ display: "flex" }} align="end">
                <Navbar.Item href="/register">
                  <Button rounded inverted outlined color="link">
                    Sign Up
                  </Button>
                </Navbar.Item>
                <Navbar.Item href="/login">
                  <Button rounded inverted outlined color="danger">
                    Login
                  </Button>
                </Navbar.Item>
              </Navbar.Container>{" "}
            </>
          )}
        </Navbar.Menu>
      </Navbar>{" "}
    </>
  );
};

export default Home;
