import React from 'react';
import {Alert, Card, Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import LoginForm from "../LoginForm";

function Login() {
    return (
        <>
            <Container fluid className="verification-card-container container-login">
                <Card>
                    <Card.Header>
                        <h2 className="my-1">Iniciar sesión</h2>
                    </Card.Header>
                    <Card.Body className={"d-flex"}>
                        <LoginForm/>
                    </Card.Body>
                </Card>
            </Container>
            <Container fluid className={"alert-container"}>
                <Alert variant={"info"}>
                    ¿No tienes una cuenta?{' '}
                    <Alert.Link as={Link} to="/register" className="form-link">Haz Click aqui</Alert.Link>
                </Alert>
            </Container>
        </>
    );
}

export default Login;