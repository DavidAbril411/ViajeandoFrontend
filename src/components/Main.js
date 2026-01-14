import { useState, useEffect } from 'react';
import { Grid2, Container, Button, OutlinedInput, InputAdornment, IconButton, Typography } from '@mui/material';
import { Search, Favorite, FavoriteBorder } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'wouter';

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

function Main() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinos, setDestinos] = useState([]);
  const [modal, setModal] = useState({ visible: false, message: '' });
  const [, setLocation] = useLocation();
  const [favoriteStates, setFavoriteStates] = useState({});

  // Cargar destinos al inicializar
  useEffect(() => {
    async function fetchDestinos() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/destinos`);
        const data = await response.json();
        const shuffledData = data.sort(() => Math.random() - 0.5);

        setDestinos(shuffledData);
      } catch (error) {
        console.error('Error al obtener destinos:', error);
      }
    }
    fetchDestinos();
  }, []);

  // Obtener favoritos del usuario
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

  // Sincronizar favoritos con el backend cuando cambia el estado de un favorito individual
  const syncSingleFavorite = async (id_destino, is_favorited) => {
    const id_usuario = getIdFromToken();
    if (!id_usuario) return;

    try {
      // Sincronizar solo el favorito que cambió
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favoritos/sync`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: id_usuario,
          id_destino: id_destino,
          is_favorited: is_favorited, // El estado actual del favorito
        }),
      });

      console.log(`Favorito sincronizado: destino ${id_destino} ${is_favorited ? 'marcado' : 'desmarcado'}.`);
    } catch (error) {
      console.error('Error al sincronizar el favorito:', error);
    }
  };

  const toggleFavorite = (id_destino) => {
    setFavoriteStates((prevState) => {
      const newState = { ...prevState };
      const isFavorited = !newState[id_destino];
      newState[id_destino] = isFavorited;

      // Sincronizar el cambio con el backend
      syncSingleFavorite(id_destino, isFavorited);

      return newState;
    });
  };

  const filteredDestinos = destinos.filter((destino) =>
    destino.NOMBRE.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDestinationClick = (destino) => {
    const id = getIdFromToken();
    if (id) {
      setLocation(`/destinos/${destino.ID}`);
    } else {
      setModal({ visible: true, message: 'Para realizar esta acción debe iniciar sesión...' });
    }
  };

  const closeModal = () => {
    setModal({ visible: false, message: '' });
  };

  return (
    <>
      <Container maxWidth={false} sx={{ maxWidth: 1044, marginX: 'auto', paddingTop: '5rem' }}>
        <Typography variant="subtitle1" fontFamily={"Inter"} color="#3BC4FA" fontSize={{ xs: "25px", sm: "32px" }} fontWeight={400}>Visita tu destino favorito</Typography>
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
      </Container>
      <Container maxWidth={false} sx={{ maxWidth: 1244, marginX: 'auto', position: 'relative' }}>

        <div className='flex gap-[15px] items-center justify-between mb-[24px] text-[#3BC4FA] w-full'>
          <h2 className='text-[32px]'>Sugerencias</h2>
          <OutlinedInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Destino..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton>
                  <Search />
                </IconButton>
              </InputAdornment>
            }
            sx={{
              backgroundColor: '#e0e0e0',
              borderRadius: '30px',
              padding: '0px 15px',
              Width: '506px'
            }}
          />
        </div>
        <Grid2 container justifyContent="center" gap="24px" paddingBottom={7}>
          {filteredDestinos.map((destino) => (
            <Grid2 key={destino.ID}>
              <button
                className="w-full max-w-[382px] rounded-t-lg rounded-b-lg overflow-hidden bg-white relative"
                onClick={() => handleDestinationClick(destino)}
              >
                <div className="w-[382px] h-[250px] overflow-hidden">
                  <img
                    src={destino.IMAGE_URL || destino.image_url || `/images/${destino.NOMBRE}.jpg`}
                    alt={destino.NOMBRE}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <span className="block border-solid border-2 rounded-b-lg h-[45px]">
                  {destino.NOMBRE}
                </span>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation(); // Detiene la propagación del clic al contenedor padre
                    toggleFavorite(destino.ID); // Alterna el estado de favorito
                  }}
                  color={favoriteStates[destino.ID] ? "error" : "default"}
                  aria-label="favorito"
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: favoriteStates[destino.ID] ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.7)",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                    "&:hover": {
                      backgroundColor: "#FFF",
                    },
                  }}
                >
                  {favoriteStates[destino.ID] ? <Favorite sx={{ color: "#FA713B" }} /> : <FavoriteBorder />}
                </IconButton>
              </button>
            </Grid2>
          ))}
        </Grid2>
        {modal.visible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg text-center shadow-lg relative flex flex-col gap-5 pt-12">
              <button
                className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-xl"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                &times;
              </button>
              <h2 className="text-xl font-light w-[264px] text-start">{modal.message}</h2>
              <div>
                <Button href="/register" sx={{ color: '#2E9BC6', textTransform: 'none', marginLeft: '37px' }}>Registrarse</Button>
                <Button href="/login" sx={{ color: '#2E9BC6', textTransform: 'none' }}>Iniciar sesión</Button>
              </div>
            </div>
          </div>
        )}

      </Container>
    </>
  );
}

export default Main;
