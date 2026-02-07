import React from 'react';
import { motion } from 'framer-motion';
import { getAirlineName } from '../utils/airlines';
import { getCityName } from '../utils/airports';

/**
 * Parsea una duración ISO 8601 (ej: "PT18H35M") a formato legible (ej: "18h 35min")
 */
function parseDuration(isoDuration) {
  if (!isoDuration) return '—';
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  const hours = match[1] ? `${match[1]}h` : '';
  const minutes = match[2] ? ` ${match[2]}min` : '';
  return `${hours}${minutes}`.trim() || '—';
}

/**
 * Formatea hora de un datetime ISO string
 */
function formatTime(isoString) {
  try {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

const FlightCard = ({ flight, carriers, index, onSelect }) => {
  const itinerary = flight.itineraries?.[0];
  const segments = itinerary?.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  const price = flight.price?.grandTotal || flight.travelerPricings?.[0]?.price?.total || 'N/A';
  const currency = flight.price?.currency || 'USD';

  const airlineName = getAirlineName(firstSegment?.carrierCode, carriers);
  const flightNumber = `${firstSegment?.carrierCode} ${firstSegment?.number}`;

  const originCity = getCityName(firstSegment?.departure?.iataCode);
  const destCity = getCityName(lastSegment?.arrival?.iataCode);
  const originCode = firstSegment?.departure?.iataCode;
  const destCode = lastSegment?.arrival?.iataCode;

  const departureTime = formatTime(firstSegment?.departure?.at);
  const arrivalTime = formatTime(lastSegment?.arrival?.at);
  const duration = parseDuration(itinerary?.duration);

  const stops = segments.length - 1;

  // Cabin class from traveler pricing
  const cabin = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin;
  const cabinLabel = cabin
    ? { ECONOMY: 'Económica', PREMIUM_ECONOMY: 'Premium Economy', BUSINESS: 'Business', FIRST: 'Primera Clase' }[cabin] || cabin
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="bg-white shadow-md rounded-xl overflow-hidden transition-all hover:shadow-xl hover:scale-[1.01] cursor-pointer border border-gray-100"
      onClick={() => onSelect(flight)}
    >
      <div className="p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Izquierda: Info del vuelo */}
        <div className="flex-1 min-w-0">
          {/* Aerolínea */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-semibold text-gray-800">{airlineName}</span>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{flightNumber}</span>
          </div>

          {/* Ruta y horarios */}
          <div className="flex items-center gap-2 mt-3 text-sm">
            {/* Origen */}
            <div className="text-center min-w-[70px]">
              <div className="text-lg font-bold text-gray-800">{departureTime}</div>
              <div className="text-xs text-gray-500">{originCode}</div>
              {originCity !== originCode && <div className="text-[11px] text-gray-400 truncate max-w-[90px]">{originCity}</div>}
            </div>

            {/* Línea de conexión */}
            <div className="flex-1 flex flex-col items-center px-2">
              <span className="text-[11px] text-gray-400 mb-1">{duration}</span>
              <div className="w-full flex items-center">
                <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                {stops === 0 ? (
                  <svg className="w-4 h-4 text-[#2E9BC6] mx-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                ) : (
                  <div className="mx-1 flex items-center gap-0.5">
                    {Array.from({ length: stops }).map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-orange-400"></div>
                    ))}
                  </div>
                )}
                <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
              </div>
              <span className={`text-[11px] mt-1 font-medium ${stops === 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
                {stops === 0 ? 'Directo' : `${stops} escala${stops > 1 ? 's' : ''}`}
              </span>
            </div>

            {/* Destino */}
            <div className="text-center min-w-[70px]">
              <div className="text-lg font-bold text-gray-800">{arrivalTime}</div>
              <div className="text-xs text-gray-500">{destCode}</div>
              {destCity !== destCode && <div className="text-[11px] text-gray-400 truncate max-w-[90px]">{destCity}</div>}
            </div>
          </div>

          {/* Badge de clase */}
          {cabinLabel && (
            <div className="mt-2">
              <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{cabinLabel}</span>
            </div>
          )}
        </div>

        {/* Derecha: Precio y botón */}
        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FA713B]">
              {currency} {parseFloat(price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-gray-400">por persona</div>
          </div>
          <button
            className="mt-1 bg-[#2E9BC6] text-white px-5 py-2 rounded-full hover:bg-[#2589b0] transition-colors text-sm font-medium whitespace-nowrap"
            onClick={(e) => { e.stopPropagation(); onSelect(flight); }}
          >
            Ver detalles
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlightCard;
