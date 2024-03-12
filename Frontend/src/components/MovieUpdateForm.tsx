import React, {ChangeEvent, Dispatch, FormEvent, SetStateAction, useState} from 'react';
import Movie from "../models/Movie";
import {useNavigate} from "react-router-dom";
import {hideLoading, showLoading} from "../Base";
import RelationRegisterTask from "../tasks/RelationRegisterTask";
import {Form} from "react-bootstrap";
import CharactersCheckboxList from "./CharactersCheckboxList";
import MyButton from "./MyButton";
import Message from "./Message";
import MovieUpdateTask from "../tasks/MovieUpdateTask";

interface MovieUpdateFormProps {
    movie: Movie;
    setShow: Dispatch<SetStateAction<boolean>>;
    loadMovie: () => Promise<void>;
    excludeIdList: number[];
}

function MovieUpdateForm({movie, setShow, loadMovie, excludeIdList}: MovieUpdateFormProps) {
    const [name, setName] = useState(movie.name);
    const [minutes, setMinutes] = useState(movie.minutes);
    const [synopsis, setSynopsis] = useState(movie.synopsis);
    const [image, setImage] = useState(movie.image);
    const [imageRequired, setImageRequired] = useState(!(movie.image === "" || !movie.image));
    const [characters, setCharacters] = useState<number[]>([]);

    const [showMsg, setShowMsg] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    function handleFormControlChange(event: ChangeEvent<HTMLInputElement>) {
        const value: any = event.target.value;

        switch (event.target.name) {
            case 'name':
                setName(value);
                break;
            case 'minutes':
                setMinutes(value);
                break;
            case 'synopsis':
                setSynopsis(value);
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
            const movieToUpdate = new Movie(
                movie.id,
                name,
                minutes as unknown as number,
                synopsis,
                imageRequired ? image : "",
                undefined,
                undefined,
                movie.characters
            );

            const movieUpdateTask = new MovieUpdateTask(movieToUpdate);

            const movieUpdated: Movie = await movieUpdateTask.execute();
            await registerRelation(movieUpdated);

            setShow(false);
            loadMovie().then();
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
                case 'DuplicateMovie':
                    setMessage('Ya existe esa película');
                    break;
                case "MovieNotFound":
                    setMessage('Película no encontrada');
                    break;
                default:
                    setMessage('Ha ocurrido un error desconocido');
            }
            hideLoading();
            setTimeout(() => setShowMsg(true), 750);
        }
    }

    async function registerRelation(movie: Movie) {
        try {
            if (characters.length === 0)
                return;

            const relationRegisterTask = new RelationRegisterTask(movie, characters);
            await relationRegisterTask.execute();
        } catch (e) {
            const mensajeError = (e as Error).message;

            switch (mensajeError) {
                case 'ExpiredOrInvalidSession':
                    localStorage.removeItem('tokenSesion');
                    navigate('/login');
                    break;
                default:
                    setMessage('Ha ocurrido un error desconocido');
            }
        }
    }


    return (
        <>
            <Form onSubmit={handleFormSubmit}>
                <Form.Group className="switch-box">
                    <Form.Check type="switch" label="Agregar imagen" name={"img-switch"} checked={imageRequired}
                                onChange={handleFormControlChange}/>
                </Form.Group>

                <Form.Group className="input-box">
                    <Form.Control required id="txtName" type="text" name="name"
                                  value={name}
                                  onChange={handleFormControlChange}/>
                    <span>Nombre</span>
                    <i></i>
                </Form.Group>

                <Form.Group className="input-box">
                    <Form.Control required id="txtMinutes" type="number" name="minutes"
                                  value={minutes} onChange={handleFormControlChange}/>
                    <span>Minutos</span>
                    <i></i>
                </Form.Group>

                <Form.Group className="input-box">
                    <Form.Control required id="txtSynopsis" as="textarea"
                                  name="synopsis"
                                  value={synopsis} onChange={handleFormControlChange}/>
                    <span>Sinopsis</span>
                    <i></i>
                </Form.Group>

                <Form.Group className={`input-box ${imageRequired ? "" : "visually-hidden"}`}>
                    <Form.Control required={imageRequired} id="txtImage" type={"text"} name="image" value={image}
                                  onChange={handleFormControlChange}/>
                    <span>Imagen</span>
                    <i></i>
                </Form.Group>

                <CharactersCheckboxList setIdList={setCharacters} excludeIdList={excludeIdList}/>

                <MyButton text={"Actualizar"} submit/>
            </Form>
            <Message title={title} body={message} show={showMsg} handleClose={() => setShowMsg(false)}/>
        </>
    );
}

export default MovieUpdateForm;