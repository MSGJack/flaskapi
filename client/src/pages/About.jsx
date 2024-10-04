import React from "react";
import { Heading, Block, Content, Container } from "react-bulma-components";

const About = () => {
  return (
    <>
      <Container>
        <Content size="medium" className="mainCon">
          <Block color="info">
            <Heading
              heading
              weight="bold"
              style={{
                color: "black",
              }}
              size={1}
            >
              G-Battle
            </Heading>
          </Block>
          <Heading
            heading
            weight="bold"
            style={{
              color: "blue",
            }}
            size={2}
          >
            Purpose
          </Heading>
          <p>
            Worked on React and Flask together to get more expierence. First
            time using Flask to built a project. Also used different libaries
            like Axios and Bulma for the frontend.
          </p>
          <Heading
            heading
            weight="light"
            style={{
              color: "green",
            }}
            size="3"
          >
            Goal
          </Heading>
          <p>
            Built project where people can created their own Mobile Suit, Robot,
            Ships, Space Stations(ie... Gundam, Zords, Babylon 5). Only the
            creator of said Mobile Suit can edit or even delete them.{" "}
          </p>
          <p>Authentication is done with json web token.</p>
          <Heading size={2} subtitle weight="semibold">
            Technologies Used For Frontend
          </Heading>
          <ul>
            <li>React</li>
            <li>Axios</li>
            <li>Bulma</li>
            <li>Yup</li>
          </ul>
          <Heading size={2} subtitle weight="light">
            Technologies Used For Backend
          </Heading>
          <ul>
            <li>Flask</li>
            <li>Flask-JWT-extended</li>
            <li>SqlAlchemy</li>
          </ul>
          <Heading size={2}>Future Improvements</Heading>
          <p>
            Future plans include integrating the G-Battle script(previous
            project that's a pokemon clone but with Mobile Suits). I want people
            to create their own Mobile Suits and have them fight against other
            MS. Also more customization for both Mobile Suits(ie... health
            points, attack, self healing) and users(avatars).
          </p>
        </Content>
      </Container>
    </>
  );
};

export default About;
