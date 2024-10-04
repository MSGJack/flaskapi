import React, { useEffect, useState, useContext } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
//pages
import Mech from "./pages/Mech";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MechsPage from "./pages/mechs";
import Home from "./pages/Home";
import Users from "./pages/Users";
import UpdateMs from "./pages/Update";
import AddMS from "./pages/Add";
import About from "./pages/About";
import Name from "./pages/User";
import UserMechs from "./pages/User";
import { AuthContext, AuthProvider } from "./pages/Auth";
import "./App.css";
import "bulma/css/bulma.css";
import { Container } from "react-bulma-components";

function App() {
  return (
    <>
      <AuthProvider>
        <div>
          <Home />
          <Container fullhd>
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/UserMechs" element={<UserMechs />} />
              <Route path="/UserMechs/:id/update" element={<UpdateMs />} />
              <Route path="/Name" element={<Name />} />
              <Route path="/Mechs" element={<MechsPage />} />
              <Route path="/Mechs/:id" element={<Mech />} />
              <Route path="/Mechs/add" element={<AddMS />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Container>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;

