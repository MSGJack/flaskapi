import React, { useState, useEffect, useContext } from "react";
import apiAxios from "../assets/axiosConfig";
import { Link } from "react-router-dom";
import {
  Card,
  Container,
  Content,
  Heading,
  Progress,
  Button,
} from "react-bulma-components";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import colorStyles from "./style";
import { AuthContext } from "./Auth";
import { useSnackbar } from "notistack";

const animatedComponents = makeAnimated();

const MechsPage = () => {
  const [mechs, setMechs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectUniverse, selectSetUniverse] = useState(null);
  const { token, loading, setToken } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getMechs = async () => {
    setIsLoading(true);
    try {
      const response = await apiAxios.get("/mechs");
      setMechs(response.data);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch mechs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMechs();
  }, []);

  const mechsItems = [...new Set(mechs.map((val) => val.universe))];
  const categories = Array.from(new Set(mechs.map((res) => res.universe)));
  const categoryUniverse = categories.map((category) => ({
    value: category,
    label: category,
  }));
  const filterUni = selectUniverse
    ? mechs.filter((m) => m.universe === selectUniverse.value)
    : mechs;

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
      <Container className="errorLayout">
        <Content color="danger">{error}</Content>
      </Container>
    );
  }

  return (
    <>
      <Container style={{ padding: "1rem" }}>
        {token && (
          <div className="displayFC">
            <Button color="info" rounded inverted outlined>
              <Link to={"/mechs/add"}>Add New MS</Link>
            </Button>
          </div>
        )}
        <div>
          <h2>Universes</h2>
          <Select
            options={categoryUniverse}
            isClearable
            placeholder="Select A Universe"
            onChange={(selectOption) => selectSetUniverse(selectOption)}
            value={selectUniverse}
            components={animatedComponents}
            styles={colorStyles}
          />
        </div>
        <div className="mechsLayout">
          {filterUni.map((mecha) => (
            <div key={mecha.id}>
              <div>
                <div
                  style={{
                    boxShadow: "blueviolet 1.1rem",
                  }}
                >
                  <Card className="mechsCard">
                    <Link to={`/mechs/${mecha.id}`}>
                      <Card.Image
                        src={mecha.img_url}
                        alt={mecha.description}
                        size="square"
                      />
                    </Link>

                    <Card.Content>
                      <Heading size={4} spaced>
                        Name: {mecha.name}
                      </Heading>
                      <hr className="redHR" />
                      <Heading subtitle size={6} weight="bold" spaced>
                        From: {mecha.universe} Universe
                      </Heading>
                      <hr className="yellowHR" />
                      <p>{mecha.description}</p>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};

export default MechsPage;
