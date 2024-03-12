import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";
import logo from "../img/Logo.png";
import {Link, useNavigate} from "react-router-dom";
import {showLoading} from "../Base";
import "./scss/Navbar.scss";

function AppNavbar() {
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('tokenSesion');
        navigate('/login');
    }

    async function handleCharactersClick() {
        document.body.style.overflow = "hidden";
        await showLoading();
        navigate("/home/characters");
    }

    async function handleMoviesClick() {
        document.body.style.overflow = "hidden";
        await showLoading();
        navigate("/home/movies");
    }

    return (
        <Navbar bg="transparent" variant="dark" className="my-navbar py-0">
            <Container fluid className={"pe-0"}>
                <Navbar.Brand as={Link} to="/home">
                    <img src={logo} alt="logo" height="75" className="d-inline-block align-top"/>
                </Navbar.Brand>
                <Nav className="me-auto" as={"ul"}>
                    <li><Nav.Link as={Link} to="/home">Inicio</Nav.Link></li>
                    <li><Nav.Link onClick={handleMoviesClick}>Peliculas</Nav.Link></li>
                    <li><Nav.Link onClick={handleCharactersClick}>Personajes</Nav.Link></li>
                    <li><Nav.Link onClick={logout} className={"me-0"}>Cerrar sesión</Nav.Link></li>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;

