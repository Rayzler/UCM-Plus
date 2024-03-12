import React, {useState} from 'react';
import Character from "../models/Character";
import {Table} from "react-bootstrap";
import CharacterRow from "./CharacterRow";
import Message from "./Message";
import Confirmation from "./Confirmation";
import {hideLoading, showLoading} from "../Base";
import RelationDeleteTask from "../tasks/RelationDeleteTask";
import {useNavigate} from "react-router-dom";

interface CharactersTableProps {
    movieId: number;
    characters: Character[];
    loadMovie: () => Promise<void>;
}

function CharactersTable({characters, movieId, loadMovie}: CharactersTableProps) {
    const [showMsg, setShowMsg] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [message, setMessage] = useState("");
    const [idToDelete, setIdToDelete] = useState(0);

    const navigate = useNavigate();

    async function DeleteRelation() {
        await showLoading();

        try {
            const relationDeleteTask = new RelationDeleteTask(movieId, idToDelete);
            await relationDeleteTask.execute();

            loadMovie().then();
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
            <Table bordered className={"tabla-personajes mx-auto mt-4"}>
                <thead>
                <tr>
                    <th>Personaje</th>
                    <th>Actor</th>
                    <th>Ultima Actualización</th>
                    <th>Eliminar</th>
                </tr>
                </thead>
                <tbody>
                {
                    !characters || characters.length === 0 ? <tr>
                            <td colSpan={4}>No hay personajes</td>
                        </tr> :
                        characters.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0).map(character => (
                            <CharacterRow key={character.id} character={character} setIdToDelete={setIdToDelete}
                                          setMessage={setMessage} setShowConfirmation={setShowConfirmation}/>
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

export default CharactersTable;