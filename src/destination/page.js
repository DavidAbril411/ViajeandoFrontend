import { useRoute, useLocation } from 'wouter';
import React, { useState, useEffect } from 'react';
import MainHeader from '../components/Header';
import { Button, TextField, MenuItem } from '@mui/material';
import Footer from '../components/Footer';
import DatesPicker from '../components/datesPicker/DatesPicker';

function DestinationPage() {
    const [origin, setOrigin] = React.useState('');
    const [passengers, setPassengers] = useState(1);
    const [match, params] = useRoute("/destinos/:id");
    const [destino, setDestino] = useState(null);
    const [loading, setLoading] = useState(true);
    const [origins, setOrigins] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [, setLocation] = useLocation();

    const { id } = params;

    useEffect(() => {
        async function fetchDestinoData() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/destinos/${id}`);
                const data = await response.json();
                setDestino(data);
            } catch (error) {
                console.error("Error al obtener los detalles del destino:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDestinoData();
    }, [id]);

    useEffect(() => {
        async function fetchOrigins() {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/origen`);
                const data = await response.json();
                setOrigins(data);
            } catch (error) {
                console.error('Error al obtener destinos:', error);
            }
        }
        fetchOrigins();
    }, []);

    if (!match) return <p>Destino no encontrado</p>;
    if (loading) return <p>Cargando...</p>;
    if (!destino) return <p>Error al cargar el destino</p>;

    const handleChangeOrigin = (event) => {
        setOrigin(event.target.value);
    };

    const handleChangePassengers = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setPassengers(value);
        }
    };

    const handleDestinationClick = () => {
        const params = new URLSearchParams({
            origin,
            passengers,
            startDate: startDate ? startDate.toISOString() : '',
            endDate: endDate ? endDate.toISOString() : ''
        }).toString();

        setLocation(`/destinos/${destino.ID}/vuelos?${params}`);
    };

    return (
        <>
            <MainHeader />
            <div className="w-full sm:h-[645px] overflow-hidden relative bg-transparent z-0">
                <img
                    src={`/images/${destino.NOMBRE}.jpg`}
                    alt={destino.NOMBRE}
                    className="w-full h-full object-cover object-center absolute z-[-1]"
                />
                <div className="h-full inset-0 flex justify-center items-center py-10">
                    <div className="bg-white bg-opacity-[85%] p-6 rounded-lg text-center shadow-lg flex flex-col gap-5 pt-12">
                        <h2 className="text-xl font-light w-full text-center text-[#2E9BC6]">{destino.NOMBRE}</h2>
                        <div className="flex flex-col sm:flex-row gap-7">
                            <div className="w-[250px] flex flex-col gap-7">
                                <TextField
                                    select
                                    label="Selecciona tu lugar de origen"
                                    value={origin}
                                    onChange={handleChangeOrigin}
                                    helperText="Por favor selecciona tu origen"
                                    fullWidth
                                >
                                    {origins.map((option) => (
                                        <MenuItem key={option.id} value={option.nombre}>
                                            {option.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    label="Cantidad de pasajeros"
                                    value={passengers}
                                    onChange={handleChangePassengers}
                                    type="number"
                                    helperText="Selecciona la cantidad de pasajeros"
                                    fullWidth
                                />
                            </div>
                            <DatesPicker
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                            />
                        </div>
                        <Button onClick={handleDestinationClick} sx={{ color: '#2E9BC6', textTransform: 'none' }}>Continuar</Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}


export default DestinationPage;
