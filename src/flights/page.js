import React from 'react';
import MainHeader from '../components/Header';
import Footer from '../components/Footer';

const Flights = () => {
    // Función para parsear los parámetros del query string
    const parseQueryString = (query) => {
        return Object.fromEntries(new URLSearchParams(query));
    };

    // Recuperar parámetros del query string usando `window.location.search`
    const queryParams = parseQueryString(window.location.search);

    const { origin, passengers, startDate, endDate } = queryParams;

    return (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
            <MainHeader />
            <main className="flex-grow flex flex-col items-center justify-center py-10 px-4">

                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    <h1 className="text-3xl font-semiBold text-[#FA713B] mb-6">Vuelos</h1>
                    <p className="text-lg mb-4">
                        <span className="font-semibold text-[#3BC4FA]">Origen:</span>{' '}
                        {origin || 'No especificado'}
                    </p>
                    <p className="text-lg mb-4">
                        <span className="font-semibold text-[#3BC4FA]">Pasajeros:</span>{' '}
                        {passengers || 'No especificado'}
                    </p>
                    <p className="text-lg mb-4">
                        <span className="font-semibold text-[#3BC4FA]">Fecha de inicio:</span>{' '}
                        {startDate ? new Date(startDate).toLocaleDateString() : 'No especificada'}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold text-[#3BC4FA]">Fecha de fin:</span>{' '}
                        {endDate ? new Date(endDate).toLocaleDateString() : 'No especificada'}
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Flights;
