import React, {Dispatch, SetStateAction} from 'react';
import {Offcanvas} from "react-bootstrap";
import CharacterUpdateForm from "./CharacterUpdateForm";
import Character from "../models/Character";

interface OffCanvasUpdateCharacterProps {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
    onHide: () => void;
    loadCharacter: () => Promise<void>;
    character: Character;
}

function OffcanvasUpdateCharacter({show, setShow, onHide, loadCharacter, character}: OffCanvasUpdateCharacterProps) {
    return (
        <Offcanvas className={"offcanvas-character-registration"} show={show} onHide={onHide} backdrop="static">
            <Offcanvas.Header closeButton closeVariant={"white"}>
                <Offcanvas.Title>Actualización</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <CharacterUpdateForm setShow={setShow} loadCharacter={loadCharacter} character={character}/>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default OffcanvasUpdateCharacter;