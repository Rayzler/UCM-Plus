import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import RegisterTask from "../tasks/RegisterTask";
import {hideLoading, showLoading} from "../Base";
import Message from "./Message";

function RegistrationForm() {
    const [fullname, setFullName] = useState('');
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [email, setEmail] = useState('');

    const [showMsg, setShowMsg] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function handleFormSubmit(event: FormEvent) {
        event.preventDefault();
        await showLoading();

        try {
            const registerTask = new RegisterTask({
                fullname,
                username,
                password,
                verifyPassword,
                email
            });

            await registerTask.execute();

            navigate('/home');
        } catch (e) {
            setTitle("ERROR");
            switch ((e as Error).message) {
                case 'IncompleteForm':
                    setMessage('Olvidaste completar todos los campos del formulario');
                    break;
                case 'PasswordsDoNotMatch':
                    setMessage('Las contraseñas no coinciden');
                    break;
                case 'DuplicateUsername':
                    setMessage('El nombre de usuario o el correo ya existen');
                    break;
                default:
                    setMessage('Ha ocurrido un error desconocido');
            }
            hideLoading();
            setTimeout(() => setShowMsg(true), 750);
        }
    }

    const handleEmailChange = (evt: ChangeEvent<HTMLInputElement>) => setEmail(evt.target.value);
    const handleUserChange = (evt: ChangeEvent<HTMLInputElement>) => setusername(evt.target.value);
    const handleNameChange = (evt: ChangeEvent<HTMLInputElement>) => setFullName(evt.target.value);
    const handlePasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);
    const handleVerifyChange = (evt: ChangeEvent<HTMLInputElement>) => setVerifyPassword(evt.target.value);

    return (
        <>
            <Form onSubmit={handleFormSubmit} className="form-registro w-100">
                <Form.Group>
                    <Form.Control required id="txtEmail" type="email" placeholder="Correo electrónico" value={email}
                                  onChange={handleEmailChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Control required id="txtFullname" type="text" placeholder="Nombre completo" value={fullname}
                                  onChange={handleNameChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Control required id="txtusername" type="text" placeholder="Nombre de usuario" value={username}
                                  onChange={handleUserChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Control required id="txtPassword" type="password" placeholder="Contraseña" value={password}
                                  onChange={handlePasswordChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Control required id="txtVerify" type="password" placeholder="Verificar contraseña"
                                  value={verifyPassword}
                                  onChange={handleVerifyChange}/>
                </Form.Group>

                <Button variant="danger" type="submit" className={"w-100"}>Registrar</Button>
            </Form>
            <Message title={title} body={message} show={showMsg} handleClose={() => setShowMsg(false)}/>
        </>
    );
}

export default RegistrationForm;