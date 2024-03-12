import React from 'react';

function Loading() {
    return (
        <div className="fullpage-wrapper hide-loading d-none">
            <div id={"rect-top"}></div>
            <div id="rect-bottom"></div>
            <div className="reactor-container">
                <div className="reactor-container-inner circle abs-center"></div>
                <div className="tunnel circle abs-center"></div>
                <div className="core-wrapper circle abs-center"></div>
                <div className="core-outer circle abs-center"></div>
                <div className="core-inner circle abs-center"></div>
                <div className="coil-container">
                    <div className="coil coil-1"></div>
                    <div className="coil coil-2"></div>
                    <div className="coil coil-3"></div>
                    <div className="coil coil-4"></div>
                    <div className="coil coil-5"></div>
                    <div className="coil coil-6"></div>
                    <div className="coil coil-7"></div>
                    <div className="coil coil-8"></div>
                </div>
            </div>
        </div>
    );
}

export default Loading;