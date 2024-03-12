import React, {useEffect, useState} from 'react';
import Character from "../../models/Character";
import Movie from "../../models/Movie";
import {useNavigate, useParams} from "react-router-dom";
import {hideLoading, showLoading} from "../../Base";
import MoviesService from "../../services/MoviesService";
import {Button, ButtonGroup, Container} from "react-bootstrap";
import MyButton from "../MyButton";
import Confirmation from "../Confirmation";
import CharactersTable from "../CharactersTable";
import OffcanvasUpdateMovie from "../OffcanvasUpdateMovie";
import MovieDeleteTask from "../../tasks/MovieDeleteTask";
import Message from "../Message";
import RelationDeleteTask from "../../tasks/RelationDeleteTask";
import "./scss/Details.scss";

function MovieDetails() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [movie, setMovie] = useState<Movie | undefined>(undefined);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [excludeIdList, setExcludeIdList] = useState<number[]>([]);

    const [showMsg, setShowMsg] = useState(false);
    const [showError, setShowError] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const {idMovie} = useParams();

    const [showForm, setShowForm] = useState(false);

    const handleClose = () => setShowForm(false);
    const handleShow = () => setShowForm(true);

    async function loadMovie() {
        document.body.style.overflow = "hidden";
        await showLoading();

        try {
            const id = parseInt(idMovie as string);
            const tokenSesion = localStorage.getItem('tokenSesion');

            if (!tokenSesion) {
                navigate('/login');
                hideLoading();
                return;
            }

            if (isNaN(id)) {
                navigate('/movies');
                return;
            }

            const moviesService = new MoviesService(tokenSesion);
            const movieFinded = await moviesService.getById(id);
            setMovie(movieFinded);
            setCharacters(movieFinded.characters);

            let idListTemp: number[] = [];
            for (let character of movieFinded.characters) {
                idListTemp.push(character.id);
            }
            setExcludeIdList(idListTemp);

            hideLoading();
            document.body.style.overflowY = "auto";
        } catch (e) {
            if (e instanceof Error) {
                switch (e.message) {
                    case 'ExpiredOrInvalidSession':
                        navigate('/login');
                        hideLoading();
                        return;
                    case 'MovieNotFound':
                        hideLoading();
                        return;
                    default:
                        navigate('/home/movies');
                        return;
                }
            }
        }

        setIsLoaded(true);
    }

    useEffect(() => {
        if (!isLoaded)
            loadMovie().then();
        else {
            document.body.style.overflowY = "auto";
        }
    });

    if (!movie) {
        return <h3 className={"txt-error"}>Error 404: Personaje no encontrado.</h3>;
    }

    async function back() {
        await showLoading();
        navigate("/home/movies");
    }

    async function handleDeleteTask() {
        if (!movie)
            return;

        await showLoading();

        try {
            for (let character of characters) {
                const relationDeleteTask = new RelationDeleteTask(movie.id, character.id);
                await relationDeleteTask.execute();
            }

            const movieDeleteTask = new MovieDeleteTask(movie);
            await movieDeleteTask.execute();
            navigate('/home/movies');
        } catch (e) {
            const mensajeError = (e as Error).message;

            switch (mensajeError) {
                case 'ExpiredOrInvalidSession':
                    localStorage.removeItem('tokenSesion');
                    navigate('/login');
                    break;
                case "MovieNotFound":
                case "NotFound":
                    setMessage('Personaje o película no encontrados');
                    break;
                default:
                    setMessage("Ocurrió un error desconocido");
                    setTimeout(() => setShowError(true), 750);
            }

            hideLoading();
            return;
        }
    }

    function handleDeleteClick() {
        setTitle("ADVERTENCIA");
        setMessage("¿Deseas eliminar esta película?");
        setShowMsg(true);
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
                <div className={"detail-movie-container w-100"}>
                    <h2 className="title-detail">{movie.name.split("").map((char, i) => char === " " ?
                        <span key={i} className={"blank-space"}> </span> : <span key={i}>{char}</span>)}</h2>
                    <div className="content-detail text-white mb-5">
                        <div className="img-detail-container">
                            <img className={"img-detail"}
                                 src={movie.image === "" || !movie.image ? "https://artsmidnorthcoast.com/wp-content/uploads/2014/05/no-image-available-icon-6.png" : movie.image}
                                 alt=""/>
                        </div>
                        <div className={"content-text"}>
                            <h4 className={"text-white-50 ms-3"}>{movie.minutes} minutos</h4>
                            <br/>
                            <p className={"ms-3"}>{movie.synopsis}</p>
                        </div>
                    </div>
                    <CharactersTable characters={characters} loadMovie={loadMovie} movieId={movie.id}/>
                </div>
            </Container>
            <OffcanvasUpdateMovie show={showForm} setShow={setShowForm} onHide={handleClose}
                                  excludeIdList={excludeIdList} loadMovie={loadMovie} movie={movie}/>
            <Confirmation title={title} body={message} show={showMsg} handleClose={() => setShowMsg(false)}
                          onAccept={handleDeleteTask}/>
            <Message title={title} body={message} show={showError} handleClose={() => setShowError(false)}/>
        </>
    );
}

export default MovieDetails;