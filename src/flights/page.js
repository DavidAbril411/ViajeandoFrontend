import React, { useState, useEffect } from 'react';
import MainHeader from '../components/Header';
import Footer from '../components/Footer';

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);

    // Función para parsear los parámetros del query string
    const parseQueryString = (query) => {
        return Object.fromEntries(new URLSearchParams(query));
    };

    const queryParams = parseQueryString(window.location.search);
    const { origin, passengers, startDate } = queryParams;

    // We need a destination. If not in URL, we might need to handle that, 
    // but the user flow implies clicking a destination card first.
    // However, the user request showed a URL like: 
    // .../destinos/11/vuelos?origin=Córdoba...
    // The "11" is the destination ID in the path. We need to fetch the destination name or pass it in query.
    // To match the user's URL structure exactly: 
    // Route path="/destinos/:id/vuelos" component={Flights}
    // We can get :id from wouter hooks, but let's assume valid query params for now or that we need to fetch destination Name by ID.
    // IMPORTANT: The backend 'vuelos' endpoint expects a 'destination' CITY NAME or IATA code. 
    // If the URL only has ID, we technically should fetch the name first.
    // BUT the backend implementation I wrote uses 'destination' from query. 
    // I will check if the user's URL actually provides destination name. 
    // The user example: ".../destinos/11/vuelos?origin=Córdoba..." 
    // It DOES NOT have 'destination=Name'. It has the ID in the path.
    // So I must fetch the destination details using the ID first.

    // WAIT: I can't easily use wouter params in this component unless I wrap it or use useRoute.
    // Let's assume for this specific file rewrite that I will use 'useRoute' or just window.location to extract ID.

    useEffect(() => {
        const fetchFlights = async () => {
            // Extract ID from pathname: /destinos/11/vuelos
            const pathParts = window.location.pathname.split('/');
            const destIdIndex = pathParts.indexOf('destinos') + 1;
            const destId = pathParts[destIdIndex];

            if (!destId) {
                setError("No se especificó un destino.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // 1. Fetch Destination Name
                const destResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/destinos/${destId}`);
                if (!destResponse.ok) throw new Error("Error al obtener información del destino");
                const destData = await destResponse.json();
                const destinationName = destData.NOMBRE; // Assuming DB returns 'NOMBRE'

                // 2. Fetch Flights
                const searchParams = new URLSearchParams({
                    origin: origin || 'Buenos Aires', // Fallback
                    destination: destinationName,
                    date: startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
                    passengers: passengers || 1
                });

                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/vuelos?${searchParams.toString()}`);
                if (!response.ok) throw new Error('Error al buscar vuelos');

                const data = await response.json();

                if (data.warning) setWarning(data.warning);

                // Amadeus returns data in 'data' array. Mock returns { data: [...] }
                const flightResults = Array.isArray(data) ? data : (data.data || []);
                setFlights(flightResults);

            } catch (err) {
                console.error(err);
                setError(err.message || 'Error desconocido');
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [origin, passengers, startDate]);

    return (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
            <MainHeader />
            <main className="flex-grow flex flex-col items-center py-10 px-4">
                <h1 className="text-3xl font-semiBold text-[#FA713B] mb-6">Resultados de Vuelos</h1>

                {loading && <p>Buscando las mejores ofertas...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {warning && <div className="bg-yellow-100 p-4 rounded mb-4 text-yellow-800 border-l-4 border-yellow-500">{warning}</div>}

                <div className="w-full max-w-4xl space-y-4">
                    {!loading && flights.length === 0 && !error && <p>No se encontraron vuelos.</p>}

                    {flights.map((flight, index) => {
                        // Extracting basic info (simplified for display)
                        const itinerary = flight.itineraries[0];
                        const segment = itinerary.segments[0];
                        const price = flight.price?.grandTotal || flight.travelerPricings?.[0]?.price?.total || 'N/A';
                        const currency = flight.price?.currency || 'USD';

                        return (
                            <div key={index} className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row justify-between items-center transition hover:shadow-lg">
                                <div className="mb-4 md:mb-0">
                                    <div className="text-lg font-bold text-[#2E9BC6]">ID: {flight.id}</div>
                                    {/* In real Amadeus data, carrierCode needs to be mapped to Name dictionary provided in response. 
                                        For simplification we show the code or mock name. */}
                                    <div className="text-gray-600">Aerolínea: {segment.carrierCode} {segment.number}</div>
                                    <div className="text-sm text-gray-500">
                                        {segment.departure.iataCode} ({new Date(segment.departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                        &rarr;
                                        {segment.arrival.iataCode} ({new Date(segment.arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">Duración: {itinerary.duration.replace('PT', '').toLowerCase()}</div>
                                </div>
                                <div className="text-center md:text-right">
                                    <div className="text-2xl font-bold text-[#FA713B]">{currency} {price}</div>
                                    <button className="mt-2 bg-[#2E9BC6] text-white px-6 py-2 rounded-full hover:bg-[#2589b0] transition">
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Flights;
