import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../Components/Sidebar";
import MessageForm from "../Components/MessageForm";

function Chat() {
    return (
        <Container>
            <Row>
                <Col md={4}>
                    <Sidebar />
                </Col>
                <Col md={8}>
                    <MessageForm />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;