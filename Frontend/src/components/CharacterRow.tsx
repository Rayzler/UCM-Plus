import React, {Dispatch, SetStateAction} from 'react';
import Character from "../models/Character";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {showLoading} from "../Base";

interface CharacterRowProps {
    character: Character;
    setMessage: Dispatch<SetStateAction<string>>;
    setShowConfirmation: Dispatch<SetStateAction<boolean>>;
    setIdToDelete: Dispatch<SetStateAction<number>>;
}

function CharacterRow({character, setShowConfirmation, setMessage, setIdToDelete}: CharacterRowProps) {
    const navigate = useNavigate();

    async function goToCharacterDetail() {
        await showLoading();
        navigate(`/home/characters/${character.id}`);
    }

    function handleDeleteClick() {
        setIdToDelete(character.id);
        setMessage("¿Deseas desvincular este personaje?");
        setShowConfirmation(true);
    }

    return (
        <>
            <tr className="movie-row">
                <td onClick={goToCharacterDetail}>{character.name}</td>
                <td onClick={goToCharacterDetail}>{character.actor}</td>
                <td onClick={goToCharacterDetail}>{character.updatedAt.toString()}</td>
                <td onClick={handleDeleteClick} className={"delete-cell"}><FontAwesomeIcon icon={faTrash}/></td>
            </tr>
        </>
    );
}

export default CharacterRow;