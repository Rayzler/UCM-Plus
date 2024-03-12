import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Character from "../../models/Character";
import CharactersService from "../../services/CharactersService";
import {Button, ButtonGroup, Container} from "react-bootstrap";
import Movie from "../../models/Movie";
import {hideLoading, showLoading} from "../../Base";
import OffcanvasUpdateCharacter from "../OffcanvasUpdateCharacter";
import MyButton from "../MyButton";
import MoviesTable from "../MoviesTable";
import Confirmation from "../Confirmation";
import CharacterDeleteTask from "../../tasks/CharacterDeleteTask";
import "./scss/Details.scss";

function CharacterDetails() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [character, setCharacter] = useState<Character | undefined>(undefined);
    const [movies, setMovies] = useState<Movie[]>([]);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const {idCharacter} = useParams();

    const [showForm, setShowForm] = useState(false);

    const handleClose = () => setShowForm(false);
    const handleShow = () => setShowForm(true);

    async function loadCharacter() {
        document.body.style.overflow = "hidden";
        await showLoading();

        try {
            const id = parseInt(idCharacter as string);
            const tokenSesion = localStorage.getItem('tokenSesion');

            if (!tokenSesion) {
                navigate('/login');
                hideLoading();
                return;
            }

            if (isNaN(id)) {
                navigate('/characters');
                return;
            }

            const charactersService = new CharactersService(tokenSesion);
            const characterFinded = await charactersService.getById(id);
            setCharacter(characterFinded);
            setMovies(characterFinded.movies);
            hideLoading();
            document.body.style.overflowY = "auto";
        } catch (e) {
            if (e instanceof Error) {
                switch (e.message) {
                    case 'ExpiredOrInvalidSession':
                        navigate('/login');
                        hideLoading();
                        return;
                    case 'CharacterNotFound':
                        hideLoading();
                        return;
                    default:
                        navigate('/home/characters');
                        return;
                }
            }
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        if (!isLoaded)
            loadCharacter().then();
        else {
            document.body.style.overflowY = "auto";
        }
    });

    if (!character) {
        return <h3 className={"txt-error"}>Error 404: Personaje no encontrado.</h3>;
    }

    async function back() {
        await showLoading();
        navigate("/home/characters");
    }

    async function handleDeleteTask() {
        if (!character)
            return;

        await showLoading();

        try {
            const characterDeleteTask = new CharacterDeleteTask(character);
            await characterDeleteTask.execute();
            navigate('/home/characters');
        } catch (e) {
            const mensajeError = (e as Error).message;

            switch (mensajeError) {
                case 'ExpiredOrInvalidSession':
                    localStorage.removeItem('tokenSesion');
                    navigate('/login');
                    break;
                case "CharacterNotFound":
                    setMessage('Personaje no encontrado');
                    setTimeout(() => setShowConfirmation(true), 750);
                    break;
                default:
                    setMessage("Ocurrió un error desconocido");
                    setTimeout(() => setShowConfirmation(true), 750);
            }
        }
    }

    function handleDeleteClick() {
        setTitle("ADVERTENCIA");
        setMessage("¿Deseas eliminar este personaje?");
        setShowConfirmation(true);
    }

    return (
        <>
            <div className={"buttongroup-container"}>
                <ButtonGroup aria-label="Modificar" className={"grupo-botones"}>
                    <Button onClick={handleShow}>Actualizar</Button>
                    <Button onClick={handleDeleteClick}>Eliminar</Button>
                </ButtonGroup>
                <MyButton text={"Volver"} classname={"btn-volver"} onClick={back}/>
            </div>
            <Container className={"mt-4"}>
                <div className={"detail-character-container d-flex w-100"}>
                    <div className="img-detail-container rounded-circle">
                        <img className={"img-detail rounded-circle"} src={character.image === "" || !character.image ? "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256__340.png": character.image} alt=""/>
                    </div>
                    <div className="img-area rounded-circle"></div>
                    <div className="content-detail text-white ms-5 flex-grow-1">
                        <div className={"content-text"}>
                            <h2>{character.name.split("").map((char, i) => char === " " ?
                                <span key={i} className={"blank-space"}> </span> : <span key={i}>{char}</span>)}</h2>
                            <br/>
                            <h4 className={"text-white-50 ms-3"}>{character.actor}</h4>
                        </div>
                        <MoviesTable loadCharacter={loadCharacter} characterId={character.id} movies={movies}/>
                    </div>
                </div>
            </Container>
            <OffcanvasUpdateCharacter show={showForm} setShow={setShowForm} onHide={handleClose}
                                      loadCharacter={loadCharacter} character={character}/>
            <Confirmation title={title} body={message} show={showConfirmation} handleClose={() => setShowConfirmation(false)} onAccept={handleDeleteTask}/>
        </>
    );
}

export default CharacterDetails;