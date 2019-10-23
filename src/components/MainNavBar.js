import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";

function MainNavBar(props) {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">TicTacToe</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#features"></Nav.Link>
          <Nav.Link href="#pricing"></Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link id="navbar-right" href="#deets">
            {props.children}
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

// return <Navbar>{props.children}</Navbar>;
export default MainNavBar;
