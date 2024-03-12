import React from 'react';
import Movie from "../models/Movie";
import {Card, Col} from "react-bootstrap";
import {showLoading} from "../Base";
import {useNavigate} from "react-router-dom";

interface MovieCardProps {
    movie: Movie;
}

function MovieCard({movie}: MovieCardProps) {
    const navigate = useNavigate();

    async function handleClick() {
        document.body.style.overflowY = "hidden";
        await showLoading();
        navigate(`/home/movies/${movie.id}`);
    }

    return (
        <Col xs="4" className={"my-2 px-2"}>
            <Card className="bg-dark text-white movie-card" onClick={handleClick}>
                <Card.Img src={movie.image === "" || !movie.image ? "https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png" : movie.image} alt="Card image" />
                <Card.ImgOverlay>
                    <Card.Title className={"mb-3"}>{movie.name}</Card.Title>
                    <Card.Text>{movie.minutes + " minutos"}</Card.Text>
                </Card.ImgOverlay>
            </Card>
        </Col>
    );
}

export default MovieCard;