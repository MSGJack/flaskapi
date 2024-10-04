import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./Auth";
import { Link } from "react-router-dom";
import apiAxios from "../assets/axiosConfig";
import {
  Card,
  Content,
  Heading,
  Progress,
  Notification,
  Button,
  Container,
  Footer,
} from "react-bulma-components";
import { useSnackbar } from "notistack";

const UserMechs = () => {
  const [usermechs, setUsermechs] = useState([]);
  //const { token, loading } = useContext(AuthContext);
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getMechs = async () => {
    setIsLoading(true);
    try {
      let access_token = localStorage.getItem("access_token");
      const response = await apiAxios.get("/usermechs", {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });
      setUsermechs(response.data);
    } catch (error) {
      console.log(error);
      console.log("error", error);
      console.log(error.response.data.error);
      console.log(error.response.status);
      console.log(error.response.headers);
      console.log(error.request);
      setError(
        "Failed to load mechs. Please try again later or sign in again."
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteMS(id) {
    let access_token = localStorage.getItem("access_token");
    apiAxios
      .delete(`/mechs/${id}`, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUsermechs(usermechs.filter((mech) => mech.id !== id));
        console.log("Removed");
        enqueueSnackbar("MS has been deleted!", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        });
        // return <Navigate to="/mechs" replace />;
      })
      .catch((error) => {
        console.log(error);
        console.error(error.message);
        console.log("error", error);
        console.log(error.response.status);
        if (error.response.status === 401) {
          enqueueSnackbar(
            "Failed to delete MS..",
            { variant: "error" },
            { autoHideDuration: 1000 },
            {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
            }
          );
        }
        console.log(error.response.headers);
        console.log(error.request);
      });
  }

  useEffect(() => {
    getMechs();
  }, []);

  if (isloading) {
    return (
      <>
        <div className="loading1">
          <Progress color="link" size="medium">
            50%
          </Progress>
          <p className="loadingFont">Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <Notification color="danger" className="errorLayout">
        {error}
      </Notification>
    );
  }

  if (usermechs.length === 0) {
    return (
      <Notification style={{ padding: "4rem" }} color="info">
        No mechs found.
      </Notification>
    );
  }

  return (
    <>
      <Container>
        <Heading className="headerCenter">Your Mechs</Heading>
        <Content className="userCon">
          {usermechs.map((mech) => (
            <div key={mech.id}>
              <Card className="usercardt">
                <Card.Header>
                  <Card.Header.Title>Name: {mech.name}</Card.Header.Title>
                </Card.Header>
                <Card.Content className="test2">
                  <Card.Image
                    src={mech.img_url}
                    alt={mech.name}
                    className="userimg"
                  />
                </Card.Content>
                <Content>
                  <Heading size={5} subtitle>
                    Universe: {mech.universe}
                  </Heading>
                  <Heading size={5} subtitle>
                    Description: {mech.description}
                  </Heading>
                </Content>
                <Card.Footer>
                  <Card.Footer.Item className="footerFSE">
                    <Button color="link" inverted>
                      <Link to={`/usermechs/${mech.id}/update`}>Edit</Link>
                    </Button>
                    <Button color="danger" onClick={() => deleteMS(mech.id)}>
                      Delete
                    </Button>
                  </Card.Footer.Item>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </Content>
      </Container>
    </>
  );
};

export default UserMechs;
