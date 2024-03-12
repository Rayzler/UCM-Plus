import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import LoginTask from "../tasks/LoginTask";
import {hideLoading, showLoading} from "../Base";
import Message from "./Message";

function LoginForm() {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');

    const [showMsg, setShowMsg] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function handleFormSubmit(evt: FormEvent) {
        evt.preventDefault();
        await showLoading();

        try {
            const loginTask = new LoginTask({
                username,
                password
            });

            await loginTask.execute();

            navigate('/home');
        } catch (e) {
            setTitle("ERROR");
            switch ((e as Error).message) {
                case 'IncompleteForm':
                    setMessage('Olvidaste completar todos los campos del formulario');
                    break;
                case 'UsernameOrPasswordIncorrect':
                    setMessage('Contraseña incorrecta');
                    break;
                case 'UserNotFound':
                    setMessage('El usuario no existe');
                    break;
                default:
                    setMessage('Ha ocurrido un error desconocido');
            }
            hideLoading();
            setTimeout(() => setShowMsg(true), 750);
        }
    }

    const handleUserChange = (evt: ChangeEvent<HTMLInputElement>) => setusername(evt.target.value);
    const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);

    return (
        <>
            <Form onSubmit={handleFormSubmit} className="form-login w-100">
                <Form.Group>
                    <Form.Control required id="txtusername" type="text" placeholder="Nombre de usuario" value={username}
                                  onChange={handleUserChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Control required id="txtPassword" type="password" placeholder="Contraseña" value={password}
                                  onChange={handlePasswordChange}/>
                </Form.Group>

                <Button variant="danger" type="submit">Iniciar sesión</Button>
            </Form>
            <Message title={title} body={message} show={showMsg} handleClose={() => setShowMsg(false)}/>
        </>
    );
}

export default LoginForm;