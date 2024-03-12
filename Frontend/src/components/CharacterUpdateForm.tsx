import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from 'react';
import {Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import Character from "../models/Character";
import CharacterUpdateTask from "../tasks/CharacterUpdateTask";
import MyButton from "./MyButton";
import {hideLoading, showLoading} from "../Base";
import Message from "./Message";

interface CharacterUpdateFormProps {
    character: Character;
    setShow: Dispatch<SetStateAction<boolean>>;
    loadCharacter: () => Promise<void>;
}

function CharacterUpdateForm({character, setShow, loadCharacter}: CharacterUpdateFormProps) {
    const [name, setName] = useState(character.name);
    const [actor, setActor] = useState(character.actor);
    const [image, setImage] = useState(character.image);
    const [imageRequired, setImageRequired] = useState(!(character.image === "" || !character.image));

    const [showMsg, setShowMsg] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function handleFormControlChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        switch (event.target.name) {
            case 'name':
                setName(value);
                break;
            case 'actor':
                setActor(value);
                break;
            case "image":
                setImage(value);
                break;
            case "img-switch":
                setImageRequired(!imageRequired);
                break;
        }
    }

    async function handleFormSubmit(event: FormEvent) {
        event.preventDefault();
        await showLoading();

        try {
            const characterToUpdate = new Character(
                character.id,
                name,
                actor,
                imageRequired ? image : "",
                undefined,
                undefined,
                character.movies
            );

            const characterUpdateTask = new CharacterUpdateTask(characterToUpdate);
            await characterUpdateTask.execute();
            setShow(false);
            loadCharacter().then();
        } catch (e) {
            const mensajeError = (e as Error).message;
            setTitle("ERROR");
            switch (mensajeError) {
                case 'ExpiredOrInvalidSession':
                    localStorage.removeItem('tokenSesion');
                    navigate('/login');
                    break;
                case 'IncompleteForm':
                    setMessage('Olvidaste completar todos los campos del formulario');
                    break;
                case 'DuplicateCharacter':
                    setMessage('Ya existe ese personaje');
                    break;
                case "CharacterNotFound":
                    setMessage('Personaje no encontrado');
                    break;
                default:
                    setMessage('Ha ocurrido un error desconocido');
            }

            hideLoading();
            setTimeout(() => setShowMsg(true), 750);
        }
    }

    return (
        <><Form onSubmit={handleFormSubmit}>
            <Form.Group className="switch-box">
                <Form.Check type="switch" label="Agregar imagen" name={"img-switch"} checked={imageRequired}
                            onChange={handleFormControlChange}/>
            </Form.Group>

            <Form.Group className="input-box">
                <Form.Control required id="txtName" type="text" name="name" value={name}
                              onChange={handleFormControlChange}/>
                <span>Personaje</span>
                <i></i>
            </Form.Group>

            <Form.Group className="input-box">
                <Form.Control required id="txtActor" type="text" name="actor" value={actor}
                              onChange={handleFormControlChange}/>
                <span>Actor</span>
                <i></i>
            </Form.Group>

            <Form.Group className={`input-box ${imageRequired ? "" : "visually-hidden"}`}>
                <Form.Control required={imageRequired} id="txtImage" type="text" name="image" value={image}
                              onChange={handleFormControlChange}/>
                <span>Imagen</span>
                <i></i>
            </Form.Group>

            <MyButton text={"Actualizar"} classname={"mt-5"} submit/>
        </Form>
            <Message title={title} body={message} show={showMsg} handleClose={() => setShowMsg(false)}/>
        </>
    );
}

export default CharacterUpdateForm;