import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import Verification from "./components/routes/Verification";
import Register from "./components/routes/Register";
import Login from "./components/routes/Login";
import Home from "./components/routes/Home";
import MainPage from "./components/routes/MainPage";
import MovieList from "./components/routes/MovieList";
import MovieDetails from "./components/routes/MovieDetails";
import CharacterDetails from "./components/routes/CharacterDetails";
import CharacterList from "./components/routes/CharacterList";
import Loading from "./components/Loading";

const appRouter = createBrowserRouter([
    {
        path: "/",
        element: <Verification/>,
        children: [
            {
                path: '/',
                index: true,
                element: <Navigate to="/login"/>
            },
            {
                path: '/register',
                element: <Register/>
            },
            {
                path: '/login',
                element: <Login/>
            }
        ]
    },
    {
        path: '/home',
        element: <Home/>,
        children: [
            {
                path: '/home',
                index: true,
                element: <MainPage/>
            },
            {
                path: '/home/movies',
                element: <MovieList/>
            },
            {
                path: '/home/movies/:idMovie',
                element: <MovieDetails/>
            },
            {
                path: '/home/characters',
                element: <CharacterList/>
            },
            {
                path: '/home/characters/:idCharacter',
                element: <CharacterDetails/>
            }
        ]
    }
]);

export default function App() {
    return (
        <>
            <Loading/>
            <RouterProvider router={appRouter}/>
        </>
    );
}
