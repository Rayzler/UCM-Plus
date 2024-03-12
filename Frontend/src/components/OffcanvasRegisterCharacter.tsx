import React, {useState} from 'react';
import {Offcanvas} from "react-bootstrap";
import CharacterRegistrationForm from "./CharacterRegistrationForm";
import "./scss/RegistrationForm.scss";
import MyButton from "./MyButton";

interface RegisterCharacterProps {
    loadCharacters: () => Promise<void>;
}

function OffcanvasRegisterCharacter({loadCharacters}: RegisterCharacterProps) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <MyButton text={"Registrar personaje"} onClick={handleShow} classname={"btn-registrar mx-2"}/>

            <Offcanvas className={"offcanvas-character-registration"} show={show} onHide={handleClose} backdrop="static">
                <Offcanvas.Header closeButton closeVariant={"white"}>
                    <Offcanvas.Title>Registro</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <CharacterRegistrationForm setShow={setShow} loadCharacters={loadCharacters}/>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default OffcanvasRegisterCharacter;