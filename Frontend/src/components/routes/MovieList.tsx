import React, {ChangeEvent, useEffect, useState} from 'react';
import OffcanvasRegisterMovie from "../OffcanvasRegisterMovie";
import {Button, ButtonGroup, Container, Dropdown, Form, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {hideLoading, showLoading} from "../../Base";
import Movie from "../../models/Movie";
import MoviesService from "../../services/MoviesService";
import MovieCard from "../MovieCard";
import "../scss/Cards.scss";
import "./scss/Lists.scss";

function MovieList() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState(false);

    const [search, setSearch] = useState("");
    const [moviesFilter, setMoviesFilter] = useState<Movie[]>([]);

    const navigate = useNavigate();

    async function loadMovies() {
        document.body.style.overflowY = "hidden";
        await showLoading();

        try {
            const tokenSesion = localStorage.getItem('tokenSesion');

            if (!tokenSesion) {
                navigate('/login');
                return;
            }

            const moviesService = new MoviesService(tokenSesion);
            const moviesList = (await moviesService.getList()).sort((a, b) => {
                if (a.name > b.name)
                    return 1;

                if (a.name < b.name)
                    return -1;

                return 0;
            });

            setMovies(moviesList);
            setIsLoaded(true);
            setError(false);
        } catch (e) {
            if (e instanceof Error && e.message === 'ExpiredOrInvalidSession') {
                navigate('/login');
            } else {
                setError(true);
            }
        } finally {
            hideLoading();
            document.body.style.overflowY = "auto";
        }
    }

    function sortAtoZ() {
        const copy = Array.from(movies);
        copy.sort((a, b) => {
            if (a.name > b.name)
                return 1;

            if (a.name < b.name)
                return -1;

            return 0;
        });
        setMovies(copy);
    }

    function sortZtoA() {
        const copy = Array.from(movies);
        copy.sort((a, b) => {
            if (a.name > b.name)
                return -1;

            if (a.name < b.name)
                return 1;

            return 0;
        });
        setMovies(copy);
    }

    function sort0to1() {
        const copy = Array.from(movies);
        copy.sort((a, b) => {
            if (a.minutes > b.minutes)
                return 1;

            if (a.minutes < b.minutes)
                return -1;

            if (a.name > b.name)
                return 1;

            if (a.name < b.name)
                return -1;

            return 0;
        });
        setMovies(copy);
    }

    function sort1to0() {
        const copy = Array.from(movies);
        copy.sort((a, b) => {
            if (a.minutes > b.minutes)
                return -1;

            if (a.minutes < b.minutes)
                return 1;

            if (a.name > b.name)
                return -1;

            if (a.name < b.name)
                return 1;

            return 0;
        });
        setMovies(copy);
    }

    useEffect(() => {
        if (!isLoaded)
            loadMovies().then();
        else {
            hideLoading();
            document.body.style.overflow = "auto";
        }
    });

    useEffect(() => {
        const copy = Array.from(movies).filter(movie => movie.name.toUpperCase().includes(search.trim().toUpperCase()));
        if(search.trim() === "")
            setMoviesFilter(movies);
        else
            setMoviesFilter(copy);
    }, [search, movies]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    return (
        <Container className="pt-4">
            <Row className={"mb-1"}>
                <OffcanvasRegisterMovie loadMovies={loadMovies}/>
                <Form.Control className={"search-bar ms-auto me-2"} type="text" placeholder="Nombre de la película" onChange={handleSearchChange} value={search}/>
                <Dropdown className={"dropdown-sort mx-2 p-0"} as={ButtonGroup}>
                    <Button variant="success">Ordenar por:</Button>

                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic"/>

                    <Dropdown.Menu variant={"dark"}>
                        <Dropdown.Item onClick={sortAtoZ}>Alfabético (Ascendente)</Dropdown.Item>
                        <Dropdown.Item onClick={sortZtoA}>Alfabético (Descendiente)</Dropdown.Item>
                        <Dropdown.Item onClick={sort0to1}>Duración (Ascendente)</Dropdown.Item>
                        <Dropdown.Item onClick={sort1to0}>Duración (Descendiente)</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <hr className={"mt-5"}/>
            <Row>
                {error ? <h1 className={"txt-error"}>Ocurrió un error desconocido :(</h1>:
                    !moviesFilter || moviesFilter.length === 0 ? <h1 className={"txt-error"}>No hay películas aún</h1> :
                        moviesFilter.map((movie: Movie) =>
                    <MovieCard movie={movie} key={movie.id}/>)}
            </Row>
        </Container>
    );
}

export default MovieList;