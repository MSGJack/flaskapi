import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import apiAxios from "../assets/axiosConfig";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Heading,
  Card,
  Content,
  Columns,
  Box,
  Column,
  Progress,
  Notification,
} from "react-bulma-components";

const Mech = () => {
  const [ms, setMs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [error, setError] = useState(null);

  async function getMS() {
    try {
      const response = await apiAxios.get(`/mechs/${id}`);
      setMs(response.data);
      setIsLoading(false);
      console.log(response);
      if (response.status === 404) {
        console.log("could not find");
        console.error("Error response:");
        console.error(err.response.data);
        console.error(err.response.status);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMS();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <Content className="loading1">
          <Progress color="info" size="large"></Progress>
          <p className="loadingFont">Loading...</p>
        </Content>
      </>
    );
  }

  if (error) {
    return (
      <Notification className="errorLayout" color="danger">
        {error}
      </Notification>
    );
  }

  if (!ms === 0) {
    return (
      <Container className="notfound">
        <Notification color="white">
          <Heading>Error: 404</Heading>
          No such mech exists. Make sure you are looking for the correct id.
          <hr />
          <Content>
            <span>
              <Link to="/mechs">Go Back To Mechs Page</Link>
            </span>
          </Content>
        </Notification>
      </Container>
    );
  }
  return (
    <>
      <Container className="mCon">
        <Card
          style={{
            outline: "solid lightpink",
          }}
        >
          <Columns>
            <Columns.Column size="half">
              <Card.Image src={ms.img_url} alt={ms.name} size="4by3" />
            </Columns.Column>
            <Columns.Column size="half">
              <Card.Content>
                <Heading size={3} weight="bold" spaced>
                  Name: {ms.name}
                </Heading>
                <hr className="yellowHR" />
                <Heading
                  subtitle
                  size={5}
                  weight="semibold"
                  spaced
                  style={{ color: "aliceblue" }}
                >
                  From the {ms.universe} Universe.
                </Heading>
                <hr className="redHR" />
                <Content style={{ color: "snow" }}>
                  Description: {ms.description}
                </Content>
              </Card.Content>
            </Columns.Column>
          </Columns>
        </Card>
      </Container>
    </>
  );
};

export default Mech;
