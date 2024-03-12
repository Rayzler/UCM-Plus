import React from 'react';
import {Button, Modal} from "react-bootstrap";

interface ConfirmationProps {
    title: string;
    body: string;
    show: boolean;
    handleClose: () => void;
    onAccept: () => void;
}

function Confirmation({title, body, show, handleClose, onAccept}: ConfirmationProps) {
    return (
        <Modal show={show} onHide={handleClose} className={"modal-msg"} backdrop="static">
            <Modal.Header closeVariant={"white"} closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={() => {
                    onAccept();
                    handleClose();
                }
                }>Aceptar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Confirmation;