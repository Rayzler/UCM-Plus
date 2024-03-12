import React from 'react';
import {Container} from "react-bootstrap";
import {Outlet} from "react-router-dom";
import "./scss/Verification.scss";

function Verification() {
    return (
        <>
            <Container fluid className="verification-container">
                <div className={"pt-1"}>
                    <div id="logo" className={"text-center"}>
                        <h1 className={"mb-2"}><i>UCM PLUS</i></h1>
                    </div>
                </div>
                <Outlet/>
                <div id="circle">
                    <div id="inner-circle"/>
                </div>
            </Container>
        </>
    );
}

export default Verification;