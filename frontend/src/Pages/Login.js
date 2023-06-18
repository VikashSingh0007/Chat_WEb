import React, { useContext, useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { AppContext } from "../context/appContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const socket = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

 
  function handleLogin(event) {
    event.preventDefault();
  
    loginUser({ email, password }).then(({ data }) => {
        if (data) {
            socket.emit("new-user");
            navigate("/chat");
        }
    });
}

  return (
    <Container>
    <Row>
    <Col md={5} className='login_bg'></Col>
    <Col md={7} className='d-flex  align-items-center justify-content-center'>
    <Form  onSubmit={handleLogin}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" onChange={(event)=>setEmail(event.target.value)} value={email} required/>
      <Form.Text className="text-muted">
        We'll never share your email with anyone else.
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" onChange={(event)=>setPassword(event.target.value)} value={password} required/>
    </Form.Group>
    <Button variant="primary" type="submit">
     {isLoading ? <Spinner animation="grow" /> : "Login"}
      </Button>
    <div className='py-4'>
    <p className='text-center'>
      Don't have an account? <Link to="/Signup">Signup</Link>
    </p>

    </div>
  </Form>
  </Col>
  </Row>
  </Container>
  );
}

export default Login;