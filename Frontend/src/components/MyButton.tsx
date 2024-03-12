import React from 'react';
import {Button} from "react-bootstrap";

interface myButtonProps {
    text: string;
    onClick?: () => void;
    submit?: boolean;
    classname?: string;
}

function MyButton({text, onClick, submit, classname}: myButtonProps) {
    return (
        <Button className={"my-btn " + classname} variant="primary" onClick={onClick ? onClick : undefined} type={submit ? "submit" : "button"}>
            <span>{text}</span><i></i>
        </Button>
    );
}

export default MyButton;