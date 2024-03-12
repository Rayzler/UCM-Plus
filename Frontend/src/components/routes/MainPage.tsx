import React, {useEffect, useState} from 'react';
import {Carousel, Container} from "react-bootstrap";
import firstBanner from "../../img/banner-1.jpg";
import secondBanner from "../../img/banner-2.jpg";
import threeBanner from "../../img/banner-3.jpg";
import {hideLoading} from "../../Base";
import {Link} from "react-router-dom";

function MainPage() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded)
            setLoaded(true);
        else {
            hideLoading();
        }
    }, [loaded]);

    return (
        <>
            <Carousel className="carousel-movies">
                <Carousel.Item as={Link} to={"movies/27"}>
                    <img
                        className="d-block w-100"
                        src={firstBanner}
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item as={Link} to={"movies/28"}>
                    <img
                        className="d-block w-100"
                        src={secondBanner}
                        alt="Second slide"
                    />
                </Carousel.Item>
                <Carousel.Item as={Link} to={"movies/26"}>
                    <img
                        className="d-block w-100"
                        src={threeBanner}
                        alt="Third slide"
                    />
                </Carousel.Item>
            </Carousel>
            <Container className={"home-container"}>
                <h1 className={"text-white"}>En UCM Plus encuentra todas las películas del universo cinematográfico de Marvel en un solo lugar y desde la comodidad de tu casa.</h1>
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Marvel_Cinematic_Universe_logo.png" alt=""/>
            </Container>
        </>
    );
}

export default MainPage;