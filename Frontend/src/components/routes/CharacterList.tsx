import React, {ChangeEvent, useEffect, useState} from 'react';
import {Button, ButtonGroup, Container, Dropdown, Form, Row} from "react-bootstrap";
import OffcanvasRegisterCharacter from "../OffcanvasRegisterCharacter";
import Character from "../../models/Character";
import {useNavigate} from "react-router-dom";
import CharactersService from "../../services/CharactersService";
import CharacterCard from "../CharacterCard";
import {hideLoading, showLoading} from "../../Base";
import "../scss/Cards.scss";
import "./scss/Lists.scss";

function CharacterList() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [error, setError] = useState(false);

    const [search, setSearch] = useState("");
    const [charactersFilter, setCharactersFilter] = useState<Character[]>([]);

    const navigate = useNavigate();

    async function loadCharacters() {
        document.body.style.overflowY = "hidden";
        await showLoading();

        try {
            const tokenSesion = localStorage.getItem('tokenSesion');

            if (!tokenSesion) {
                navigate('/login');
                return;
            }

            const charactersService = new CharactersService(tokenSesion);
            const charactersList = (await charactersService.getList()).sort((a, b) => {
                if (a.name > b.name)
                    return 1;

                if (a.name < b.name)
                    return -1;

                return 0;
            });

            setCharacters(charactersList);
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
        const copy = Array.from(characters);
        copy.sort((a, b) => {
            if (a.name > b.name)
                return 1;

            if (a.name < b.name)
                return -1;

            return 0;
        });
        setCharacters(copy);
    }

    function sortZtoA() {
        const copy = Array.from(characters);
        copy.sort((a, b) => {
            if (a.name > b.name)
                return -1;

            if (a.name < b.name)
                return 1;

            return 0;
        });
        setCharacters(copy);
    }

    useEffect(() => {
        if (!isLoaded)
            loadCharacters().then();
        else {
            hideLoading();
            document.body.style.overflow = "auto";
        }
    });

    useEffect(() => {
        const copy = Array.from(characters).filter(character => character.name.toUpperCase().includes(search.trim().toUpperCase()));
        if(search.trim() === "")
            setCharactersFilter(characters);
        else
            setCharactersFilter(copy);
    }, [search, characters]);

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        setSearch(event.target.value);
    }

    return (
        <Container className="pt-4">
            <Row className={"mb-1 d-flex"}>
                <OffcanvasRegisterCharacter loadCharacters={loadCharacters}/>
                <Form.Control className={"search-bar ms-lg-auto me-2"} type="text" placeholder="Nombre del personaje" onChange={handleSearchChange} value={search}/>
                <Dropdown className={"dropdown-sort mx-2 p-0 ms-auto ms-lg-2"} as={ButtonGroup}>
                    <Button variant="danger">Ordenar por:</Button>

                    <Dropdown.Toggle split variant="danger" id="dropdown-split-basic"/>

                    <Dropdown.Menu variant={"dark"}>
                        <Dropdown.Item onClick={sortAtoZ}>Alfabético (Ascendente)</Dropdown.Item>
                        <Dropdown.Item onClick={sortZtoA}>Alfabético (Descendiente)</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <hr className={"mt-5"}/>
            <Row>
                {error ? <h1 className={"txt-error"}>Ocurrió un error desconocido :(</h1>:
                    !charactersFilter || charactersFilter.length === 0 ? <h1 className={"txt-error"}>No hay personajes aún</h1> :
                        charactersFilter.map((character: Character) =>
                    <CharacterCard character={character} key={character.id}/>)}
            </Row>
        </Container>
    );
}

export default CharacterList;