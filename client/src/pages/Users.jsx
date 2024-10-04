import React, { useState, useEffect } from "react";
import apiAxios from "../assets/axiosConfig";
import { Link } from "react-router-dom";
import {
  Block,
  Box,
  Card,
  Notification,
  Table,
  Media,
  Heading,
  Content,
  Columns,
  Column,
  Progress,
  Image,
  Container,
} from "react-bulma-components";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState([]);
  const [mechs, setMechs] = useState([]);
  const [userMechs, setUserMechs] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      const response = await apiAxios.get("/users");
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMechs = async () => {
    setIsLoading(true);
    try {
      const response = await apiAxios.get("/mechs");
      setMechs(response.data);
    } catch (err) {
      console.log(err);
      setError(
        "Failed to fetch mechs. Please try again later or try logging in again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    getMechs();
  }, []);

  useEffect(() => {
    if (users.length > 0 && mechs.length > 0) {
      const mechMapping = {};
      users.forEach((user) => {
        mechMapping[user.id] = {
          ...user,
          mechs: mechs.filter((mech) => mech.creator_id === user.id),
        };
      });
      setUserMechs(mechMapping);
    }
  }, [users, mechs]);

  return (
    <>
      <Container>
        <div>
          {isLoading ? (
            <Content className="loading1">
              <Progress color="primary" size="medium">
                <p className="loadingFont">Loading...</p>
              </Progress>
            </Content>
          ) : null}
          {error ? <p className="errorLayout">{error}</p> : null}
          <Content>
            {Object.values(userMechs).map((user) => (
              <div key={user.id} className="footerFSE">
                <Card className="usersCard">
                  <Card.Content className="transparent">
                    <Media>
                      <Media.Item renderAs="figure" align="left">
                        <Image size={64} />
                      </Media.Item>
                      <Media.Item>
                        <Heading
                          className="headerCenter"
                          style={{ overflow: "hidden" }}
                          size={3}
                        >
                          {user.username}'s Mechs
                        </Heading>
                      </Media.Item>
                    </Media>
                    <div className="mech-list">
                      {user.mechs.length > 0 ? (
                        user.mechs.map((mech) => (
                          <>
                            <div key={mech.id} className="mechsUser">
                              <Content>
                                <Columns>
                                  <Columns.Column size="half">
                                    <Image
                                      src={mech.img_url}
                                      alt={mech.name}
                                      className="imgSize"
                                    />
                                  </Columns.Column>
                                  <Columns.Column size="half">
                                    <Card.Content>
                                      <Heading size={3} weight="bold" spaced>
                                        Name: {mech.name}
                                      </Heading>
                                      <hr className="yellowHR" />
                                      <Heading
                                        subtitle
                                        size={5}
                                        weight="semibold"
                                        spaced
                                        style={{ color: "aliceblue" }}
                                      >
                                        From the {mech.universe} Universe
                                      </Heading>
                                      <hr className="redHR" />
                                      <Content style={{ color: "pink" }}>
                                        Description: {mech.description}
                                      </Content>
                                    </Card.Content>
                                  </Columns.Column>
                                </Columns>
                              </Content>
                            </div>
                          </>
                        ))
                      ) : (
                        <div>No mechs found.</div>
                      )}
                    </div>
                  </Card.Content>
                </Card>
              </div>
            ))}
          </Content>
        </div>
      </Container>
    </>
  );
};

export default Users;
