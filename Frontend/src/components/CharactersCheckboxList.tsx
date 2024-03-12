import React, {ChangeEvent, Dispatch, SetStateAction, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Accordion, Form, Spinner} from "react-bootstrap";
import Character from "../models/Character";
import CharactersService from "../services/CharactersService";

interface CharactersCheckboxListProps {
    setIdList: Dispatch<SetStateAction<number[]>>
    excludeIdList?: number[];
}

function CharactersCheckboxList({setIdList, excludeIdList}: CharactersCheckboxListProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const navigate = useNavigate();

    async function loadCharacters() {
        try {
            const tokenSesion = localStorage.getItem('tokenSesion');

            if (!tokenSesion) {
                navigate('/login');
                return;
            }

            const charactersService = new CharactersService(tokenSesion);
            let charactersList = await charactersService.getList();

            if (excludeIdList && excludeIdList.length > 0) {
                charactersList = charactersList.filter((character) => !excludeIdList.includes(character.id));
            }

            charactersList = charactersList.sort((a, b) => {
                if (a.name > b.name)
                    return 1;
                if (b.name > a.name)
                    return -1;
                return 0;
            });

            setCharacters(charactersList);
            setTimeout(() => setIsLoaded(true), 500);
        } catch (e) {
            if (e instanceof Error && e.message === 'ExpiredOrInvalidSession') {
                navigate('/login');
            }
        }
    }

    function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
        const id: number = event.target.id as unknown as number;

        setIdList((prevState: number[]) => {
            if (event.target.checked)
                return [...prevState, id];
            else
                return [...prevState.filter(n => n !== id)];
        });
    }

    function handleClick() {
        if (!isLoaded)
            loadCharacters().then();
    }

    return (
        <Accordion className="my-3">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={handleClick}>Añadir personajes</Accordion.Header>
                <Accordion.Body className="accordion-list">
                    {!isLoaded ? <div className={"spinner-container"}><Spinner animation="border" variant="danger"/></div> :
                        !characters || characters.length === 0 ? <p className={"text-center mt-4"}>No hay personajes</p> :
                        characters.map((character: Character) =>
                            <Form.Check type="checkbox" label={character.name} key={character.id} id={`${character.id}`} onChange={handleCheckboxChange}/>)
                    }
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default CharactersCheckboxList;