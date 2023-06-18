import React from 'react';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import {Row,Col,Button} from "react-bootstrap";
import "./Home.css"
function Home() {
  return (
    <Row>
     <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
      <div>
        <h1>Where the World comes Together!!</h1>
        <p>Chat App that lets you connect with the world</p>
        <LinkContainer to="/chat">
        <Button variant="success">
          Get Started <i className='fas fa-comments home-message-icon'></i>
        </Button>
        </LinkContainer>
      </div>
      </Col>
     <Col md={6} className="home_bg"></Col>
    </Row>
  );
}

export default Home;