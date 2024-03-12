import React, {Dispatch, SetStateAction} from 'react';
import Movie from "../models/Movie";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {showLoading} from "../Base";

interface MovieRowProps {
    movie: Movie;
    setMessage: Dispatch<SetStateAction<string>>;
    setShowConfirmation: Dispatch<SetStateAction<boolean>>;
    setIdToDelete: Dispatch<SetStateAction<number>>;

}

function MovieRow({movie, setMessage, setShowConfirmation, setIdToDelete}: MovieRowProps) {
    const navigate = useNavigate();

    async function goToMovieDetail() {
        await showLoading();
        navigate(`/home/movies/${movie.id}`);
    }

    function handleDeleteClick() {
        setIdToDelete(movie.id);
        setMessage("¿Deseas desvincular esta película?");
        setShowConfirmation(true);
    }

    return (
        <>
            <tr className="movie-row">
                <td onClick={goToMovieDetail}>{movie.name}</td>
                <td onClick={goToMovieDetail}>{movie.minutes}</td>
                <td onClick={goToMovieDetail}>{movie.updatedAt.toString()}</td>
                <td onClick={handleDeleteClick} className={"delete-cell"}><FontAwesomeIcon icon={faTrash}/></td>
            </tr>
        </>
    );
}

export default MovieRow;