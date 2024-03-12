import React from 'react';
import {Button, Card, Col} from "react-bootstrap";
import Character from "../models/Character";
import {useNavigate} from "react-router-dom";
import {showLoading} from "../Base";

interface CharacterCardProps {
    character: Character;
}

function CharacterCard({character}: CharacterCardProps) {
    const navigate = useNavigate();

    async function handleDetailClick() {
        document.body.style.overflowY = "hidden";
        await showLoading();
        navigate(`/home/characters/${character.id}`);
    }

    return (
        <Col xs="6" md="4" lg="3" className={"my-3 px-3"}>
            <Card className={"character-card text-center"}>
                <div className="img-container">
                    <img className={"img-character"} src={character.image === "" || !character.image ? "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256__340.png": character.image} alt={""}/>
                </div>
                <Card.Body>
                    <Card.Title>{character.name}</Card.Title>
                    <Card.Text>{character.actor}</Card.Text>
                    <Button variant="danger" onClick={handleDetailClick}>Detalles</Button>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default CharacterCard;