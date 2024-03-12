import React, {useEffect, useState} from 'react';
import AppNavbar from "../AppNavbar";
import {Outlet, useNavigate} from "react-router-dom";
import "./scss/Home.scss";
import Background from "../Background";
import "../scss/Background.scss";

function Home() {
    const [loaded, setLoaded] = useState(false);

    const tokenSesion = localStorage.getItem('tokenSesion');
    const navigate = useNavigate();

    useEffect(() => {
        if (!loaded)
            setLoaded(true);
        else {
            if (!tokenSesion) {
                navigate('/login');
            }
        }
    }, [loaded, tokenSesion, navigate]);

    return (
        <>
            <Background/>
            <AppNavbar/>
            <Outlet/>
        </>
    );
}

export default Home;