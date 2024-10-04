import React, { useState, useEffect } from "react";
import apiAxios from "../assets/axiosConfig";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Card,
  Container,
  Content,
  Heading,
  Footer,
  Block,
  Message,
  Progress,
  Notification,
  MessageBody,
} from "react-bulma-components";
import EditMS from "./Edit";

const UpdateMs = () => {
  const [info, setInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [verify, setVerify] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [error, setError] = useState(null);
  const [found, setFound] = useState(null);

  async function getMS() {
    try {
      const response = await apiAxios.get(`/mechs/${id}`);
      console.log(response);
      setInfo(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response.data); // ***
      console.log(error.response.status);
      if (error.response.status === 404) {
        setFound("No such ms exists");
        console.log("hi");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function verifyUser() {
    const access_token = localStorage.getItem("access_token");
    try {
      const response = await apiAxios.get(`/match/${id}`, {
        headers: { Authorization: "Bearer " + access_token },
      });
      console.log(response);
      console.log("CHECK");
      if (response.status === 200 && response.data.message === "match") {
        setVerify(true);
      }
    } catch (error) {
      setError("Not allowed to view this page.");
      console.error("Verification error:", error);
      setVerify(false);
    }
  }

  useEffect(() => {
    getMS();
    verifyUser();
  }, []);

  if (isLoading) {
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
      <Block className="errorLayout">
        <Notification color="danger">{error}</Notification>
        <Notification>{found}</Notification>
      </Block>
    );
  }

  if (verify === false) {
    <p>not your ms</p>;
  }

  return (
    <>
      <Container style={{ padding: "1rem" }}>
        <Card className="updateCard">
          <Card.Image src={info.img_url} size="1by1" fallback="No image" />
          <hr />
          <Card.Content>
            <Heading>Name: {info.name}</Heading>
            <Heading subtitle>Universe: {info.universe}</Heading>
            <hr />
            <Content>Description: {info.description}</Content>
          </Card.Content>
        </Card>
        <Block>
          <EditMS id={id} information={info} />
        </Block>
      </Container>
    </>
  );
};

export default UpdateMs;
