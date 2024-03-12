import React, {useState} from 'react';
import MovieRow from "./MovieRow";
import {Table} from "react-bootstrap";
import Movie from "../models/Movie";
import Message from "./Message";
import Confirmation from "./Confirmation";
import {hideLoading, showLoading} from "../Base";
import RelationDeleteTask from "../tasks/RelationDeleteTask";
import {useNavigate} from "react-router-dom";

interface MoviesTableProps {
    characterId: number;
    movies: Movie[];
    loadCharacter: () => Promise<void>;
}

function MoviesTable({characterId, movies, loadCharacter}: MoviesTableProps) {
    const [showMsg, setShowMsg] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [message, setMessage] = useState("");
    const [idToDelete, setIdToDelete] = useState(0);

    const navigate = useNavigate();

    async function DeleteRelation() {
        await showLoading();

        try {
            const relationDeleteTask = new RelationDeleteTask(idToDelete, characterId);
            await relationDeleteTask.execute();

            loadCharacter().then();
        } catch (e) {
            const mensajeError = (e as Error).message;

            switch (mensajeError) {
                case 'ExpiredOrInvalidSession':
                    localStorage.removeItem('tokenSesion');
                    navigate('/login');
                    break;
                case "NotFound":
                    setMessage('Personaje o película no encontrados');
                    setTimeout(() => setShowMsg(true), 750);
                    break;
                default:
                    setMessage("Ocurrió un error desconocido");
                    setTimeout(() => setShowMsg(true), 750);
            }

            hideLoading();
            return;
        }
    }

    return (
        <>
            <Table bordered className={"tabla-peliculas mx-auto mt-4"}>
                <thead>
                <tr>
                    <th>Película</th>
                    <th>Minutos</th>
                    <th>Ultima Actualización</th>
                    <th>Eliminar</th>
                </tr>
                </thead>
                <tbody>
                {
                    !movies || movies.length === 0 ? <tr>
                            <td colSpan={4}>No hay peliculas</td>
                        </tr> :
                        movies.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map(movie => (
                            <MovieRow key={movie.id} movie={movie} setMessage={setMessage}
                                      setShowConfirmation={setShowConfirmation} setIdToDelete={setIdToDelete}/>
                        ))
                }
                </tbody>
            </Table>

            <Message title={"ERROR"} body={message} show={showMsg} handleClose={() => setShowMsg(false)}/>
            <Confirmation title={"ADVERTENCIA"} body={message} show={showConfirmation}
                          handleClose={() => setShowConfirmation(false)} onAccept={DeleteRelation}/>
        </>
    );
}

export default MoviesTable;