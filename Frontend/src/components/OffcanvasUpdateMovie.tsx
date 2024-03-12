import React, {Dispatch, SetStateAction} from 'react';
import Movie from "../models/Movie";
import {Offcanvas} from "react-bootstrap";
import MovieUpdateForm from "./MovieUpdateForm";

interface OffCanvasUpdateMovieProps {
    show: boolean;
    setShow: Dispatch<SetStateAction<boolean>>;
    onHide: () => void;
    loadMovie: () => Promise<void>;
    movie: Movie;
    excludeIdList: number[];
}

function OffcanvasUpdateMovie({show, setShow, onHide, loadMovie, movie, excludeIdList}: OffCanvasUpdateMovieProps) {
    return (
        <Offcanvas className={"offcanvas-movie-registration"} show={show} onHide={onHide} backdrop="static">
            <Offcanvas.Header closeButton closeVariant={"white"}>
                <Offcanvas.Title>Actualización</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <MovieUpdateForm setShow={setShow} loadMovie={loadMovie} movie={movie} excludeIdList={excludeIdList}/>
            </Offcanvas.Body>
        </Offcanvas>
    );
}

export default OffcanvasUpdateMovie;