import React from 'react';
import {Button, Modal} from "react-bootstrap";

interface MessageProps {
    title: string;
    body: string;
    show: boolean;
    handleClose: () => void;
}

function Message({title, body, show, handleClose}: MessageProps) {
    return (
        <Modal show={show} onHide={handleClose} className={"modal-msg"}>
            <Modal.Header closeVariant={"white"} closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Aceptar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Message;