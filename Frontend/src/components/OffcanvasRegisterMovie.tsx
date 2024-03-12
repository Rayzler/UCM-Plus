import React, {useState} from 'react';
import {Offcanvas} from "react-bootstrap";
import MovieRegistrationForm from "./MovieRegistrationForm";
import MyButton from "./MyButton";
import "./scss/RegistrationForm.scss";

interface RegisterMovieProps {
    loadMovies: () => Promise<void>;
}

function OffcanvasRegisterMovie({loadMovies}: RegisterMovieProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <MyButton text={"Registrar película"} onClick={handleShow} classname={"btn-registrar mx-2"}/>

            <Offcanvas show={show} onHide={handleClose} backdrop="static" className={"offcanvas-movie-registration"}>
                <Offcanvas.Header closeButton closeVariant={"white"}>
                    <Offcanvas.Title>Registro</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <MovieRegistrationForm setShow={setShow} loadMovies={loadMovies}/>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default OffcanvasRegisterMovie;