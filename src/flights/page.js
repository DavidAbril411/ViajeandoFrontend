import React, { useState, useEffect } from 'react';
import MainHeader from '../components/Header';
import Footer from '../components/Footer';
import PriceTrendChart from '../components/PriceTrendChart';
import FlightCard from '../components/FlightCard';
import FlightDetailModal from '../components/FlightDetailModal';

const Flights = () => {
    const [flights, setFlights] = useState([]);
    const [carriers, setCarriers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [warning, setWarning] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);

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

                // Backend ahora retorna { data: [...], dictionaries: { carriers: {...} } }
                const flightResults = data.data || (Array.isArray(data) ? data : []);
                setFlights(flightResults);
                if (data.dictionaries?.carriers) {
                    setCarriers(data.dictionaries.carriers);
                }

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
                <h1 className="text-3xl font-semibold text-[#FA713B] mb-6">Resultados de Vuelos</h1>

                {loading && (
                    <div className="flex flex-col items-center gap-3 py-16">
                        <svg className="animate-spin h-8 w-8 text-[#2E9BC6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        <p className="text-gray-500">Buscando las mejores ofertas...</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 max-w-md text-center">
                        <p className="font-medium">Error al buscar vuelos</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}
                {warning && <div className="bg-yellow-100 p-4 rounded-lg mb-4 text-yellow-800 border-l-4 border-yellow-500 max-w-4xl w-full">{warning}</div>}

                <div className="w-full max-w-4xl space-y-4">
                    {!loading && flights.length > 0 && <PriceTrendChart currentPrice={flights[0].price?.grandTotal || flights[0].travelerPricings?.[0]?.price?.total} />}

                    {/* Empty state */}
                    {!loading && flights.length === 0 && !error && (
                        <div className="flex flex-col items-center py-16 text-gray-400">
                            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-500">No se encontraron vuelos</p>
                            <p className="text-sm mt-1">Intentá con otras fechas o destinos</p>
                        </div>
                    )}

                    {/* Flight cards */}
                    {flights.map((flight, index) => (
                        <FlightCard
                            key={flight.id || index}
                            flight={flight}
                            carriers={carriers}
                            index={index}
                            onSelect={setSelectedFlight}
                        />
                    ))}
                </div>
            </main>
            <Footer />

            {/* Flight detail modal */}
            {selectedFlight && (
                <FlightDetailModal
                    flight={selectedFlight}
                    carriers={carriers}
                    onClose={() => setSelectedFlight(null)}
                />
            )}
        </div>
    );
};

export default Flights;
