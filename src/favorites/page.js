import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Grid2, Container } from '@mui/material';
import { useLocation } from 'wouter';
import Footer from '../components/Footer';
import MainHeader from '../components/Header';

function getIdFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('authToken'); // Eliminar token caducado
            return null;
        }
        return decodedToken.id;
    } catch (error) {
        console.error("Error decoding token", error);
        return null;
    }
}

function Favorites() {
    const [destinos, setDestinos] = useState([]);
    const [favoriteStates, setFavoriteStates] = useState({});
    const [, setLocation] = useLocation();

    useEffect(() => {
        async function fetchDestinos() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/destinos`);
                const data = await response.json();
                setDestinos(data);
            } catch (error) {
                console.error('Error al obtener destinos:', error);
            }
        }
        fetchDestinos();
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            const id = getIdFromToken();
            if (!id) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favoritos/${id}`);
                const backendFavorites = await response.json();
                console.log("Datos del backend:", backendFavorites);

                const initialFavoriteStates = backendFavorites.reduce((acc, { ID }) => {
                    acc[ID] = true;
                    return acc;
                }, {});
                console.log("Estados iniciales de favoritos:", initialFavoriteStates);

                setFavoriteStates(initialFavoriteStates);
            } catch (error) {
                console.error('Error al obtener favoritos:', error);
            }
        };

        fetchFavorites();
    }, []);



    const handleDestinationClick = (destino) => {
        setLocation(`/destinos/${destino.ID}`);
    };

    // Filtrar solo los destinos que están marcados como favoritos
    const filteredDestinos = destinos.filter((destino) => favoriteStates[destino.ID]);

    return (
        <>
            <MainHeader />
            <Container maxWidth={false} sx={{ maxWidth: 1044, marginX: 'auto', paddingTop: '2rem', position: 'relative' }}>
                <div className='flex gap-[15px] items-center justify-center mb-[48px] text-[#3BC4FA]'>
                    <h2 className='text-[32px]'>Favoritos </h2>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                        <path fill="none" stroke="#3BC4FA" stroke-width="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
                <div className="separator-container my-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="20px"
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0 C50,10 50,10 100,0"
                            stroke="#2E9BC6"
                            fill="transparent"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
                <Grid2 container justifyContent="center" gap="48px" paddingBottom={7}>
                    {filteredDestinos.map((destino) => (
                        <Grid2 key={destino.ID}>
                            <button
                                className="w-[300px] rounded-t-lg rounded-b-lg overflow-hidden bg-white relative"
                                onClick={() => handleDestinationClick(destino)}
                            >
                                <div className="w-[300px] h-[200px] overflow-hidden">
                                    <img
                                        src={destino.IMAGE_URL || destino.image_url || `/images/${destino.NOMBRE}.jpg`}
                                        alt={destino.NOMBRE}
                                        className="w-full h-full object-cover object-center"
                                    />
                                </div>
                                <span className="block border-solid border-2 rounded-b-lg h-[45px]">
                                    {destino.NOMBRE}
                                </span>
                            </button>
                        </Grid2>
                    ))}
                </Grid2>
            </Container>
            <Footer></Footer>
        </>
    );
}


export default Favorites;