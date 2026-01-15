import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WeatherWidget = ({ cityName }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 1. Get coordinates for the city
                const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=es&format=json`);
                const geoData = await geoResponse.json();

                if (!geoData.results || geoData.results.length === 0) {
                    setLoading(false);
                    return;
                }

                const { latitude, longitude } = geoData.results[0];

                // 2. Get weather data
                const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                const weatherData = await weatherResponse.json();

                setWeather(weatherData.current_weather);
            } catch (error) {
                console.error("Error fetching weather:", error);
            } finally {
                setLoading(false);
            }
        };

        if (cityName) {
            fetchWeather();
        }
    }, [cityName]);

    if (loading) return null; // Or a small spinner
    if (!weather) return null;

    // Simple mapping of WMO codes to icons/text
    const getWeatherIcon = (code) => {
        // https://open-meteo.com/en/docs
        if (code === 0) return "☀️"; // Clear sky
        if (code >= 1 && code <= 3) return "aaS"; // Partly cloudy
        if (code >= 45 && code <= 48) return "🌫️"; // Fog
        if (code >= 51 && code <= 67) return "🌧️"; // Drizzle/Rain
        if (code >= 71 && code <= 77) return "❄️"; // Snow
        if (code >= 80 && code <= 82) return "🌦️"; // Showers
        if (code >= 95 && code <= 99) return "⛈️"; // Thunderstorm
        return "🌡️";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-3 border border-white/50 z-10"
        >
            <div className="text-4xl">{getWeatherIcon(weather.weathercode)}</div>
            <div>
                <div className="text-2xl font-bold text-gray-800">{Math.round(weather.temperature)}°C</div>
                <div className="text-xs text-gray-600 font-medium uppercase tracking-wider">Clima Actual</div>
            </div>
        </motion.div>
    );
};

export default WeatherWidget;
