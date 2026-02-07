import React from 'react';
import { getAirlineName } from '../utils/airlines';
import { getCityName } from '../utils/airports';

// Mapa de aerolíneas → sitio web oficial
const AIRLINE_WEBSITES = {
  AR: 'https://www.aerolineas.com.ar',
  LA: 'https://www.latamairlines.com',
  AA: 'https://www.aa.com',
  UA: 'https://www.united.com',
  DL: 'https://www.delta.com',
  AC: 'https://www.aircanada.com',
  BA: 'https://www.britishairways.com',
  AF: 'https://www.airfrance.com',
  LH: 'https://www.lufthansa.com',
  IB: 'https://www.iberia.com',
  AZ: 'https://www.ita-airways.com',
  EK: 'https://www.emirates.com',
  QR: 'https://www.qatarairways.com',
  TK: 'https://www.turkishairlines.com',
  JL: 'https://www.jal.co.jp',
  NH: 'https://www.ana.co.jp',
  KL: 'https://www.klm.com',
  VY: 'https://www.vueling.com',
  SQ: 'https://www.singaporeair.com',
  QF: 'https://www.qantas.com',
  AV: 'https://www.avianca.com',
  CM: 'https://www.copaair.com',
  AM: 'https://www.aeromexico.com',
  CX: 'https://www.cathaypacific.com',
  EY: 'https://www.etihad.com',
  TP: 'https://www.flytap.com',
  SK: 'https://www.flysas.com',
  LX: 'https://www.swiss.com',
  OS: 'https://www.austrian.com',
  AY: 'https://www.finnair.com',
  KE: 'https://www.koreanair.com',
};

function parseDuration(isoDuration) {
  if (!isoDuration) return '—';
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  const h = match[1] ? `${match[1]}h` : '';
  const m = match[2] ? ` ${match[2]}min` : '';
  return `${h}${m}`.trim() || '—';
}

function formatDateTime(isoString) {
  try {
    const d = new Date(isoString);
    return {
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
    };
  } catch {
    return { time: '—', date: '—' };
  }
}

function buildSkyscannerUrl(flight) {
  const seg = flight.itineraries?.[0]?.segments?.[0];
  const lastSeg = flight.itineraries?.[0]?.segments?.slice(-1)[0];
  if (!seg) return 'https://www.skyscanner.com.ar';

  const origin = seg.departure?.iataCode || '';
  const dest = lastSeg?.arrival?.iataCode || '';
  const rawDate = seg.departure?.at?.split('T')[0] || '';
  // Skyscanner usa formato YYMMDD en la URL
  const dateParts = rawDate.split('-');
  const skyDate = dateParts.length === 3
    ? dateParts[0].slice(2) + dateParts[1] + dateParts[2]
    : '';

  return `https://www.skyscanner.com.ar/transport/flights/${origin.toLowerCase()}/${dest.toLowerCase()}/${skyDate}/`;
}

function getAirlineWebsite(carrierCode) {
  return AIRLINE_WEBSITES[carrierCode] || null;
}

const FlightDetailModal = ({ flight, carriers, onClose }) => {
  if (!flight) return null;

  const itinerary = flight.itineraries?.[0];
  const segments = itinerary?.segments || [];
  const price = flight.price?.grandTotal || flight.travelerPricings?.[0]?.price?.total || 'N/A';
  const currency = flight.price?.currency || 'USD';

  const traveler = flight.travelerPricings?.[0];
  const fareDetails = traveler?.fareDetailsBySegment || [];

  // Cabin
  const cabin = fareDetails[0]?.cabin;
  const cabinLabels = {
    ECONOMY: 'Económica', PREMIUM_ECONOMY: 'Premium Economy',
    BUSINESS: 'Business', FIRST: 'Primera Clase',
  };

  // Baggage
  const bags = fareDetails[0]?.includedCheckedBags;
  const baggageText = bags
    ? bags.weight ? `${bags.weight} ${bags.weightUnit || 'KG'} incluidos` : bags.quantity ? `${bags.quantity} valija${bags.quantity > 1 ? 's' : ''} incluida${bags.quantity > 1 ? 's' : ''}` : null
    : null;

  const skyscannerUrl = buildSkyscannerUrl(flight);
  const airlineUrl = getAirlineWebsite(segments[0]?.carrierCode);
  const airlineName = getAirlineName(segments[0]?.carrierCode, carriers);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2E9BC6] to-[#3BC4FA] p-5 rounded-t-2xl text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{getAirlineName(segments[0]?.carrierCode, carriers)}</h2>
              <p className="text-white/80 text-sm mt-0.5">Vuelo {segments[0]?.carrierCode} {segments[0]?.number}</p>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Badges */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {cabin && (
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {cabinLabels[cabin] || cabin}
              </span>
            )}
            {segments.length === 1 && (
              <span className="bg-emerald-400/30 text-white text-xs px-3 py-1 rounded-full">
                ✈ Directo
              </span>
            )}
            {segments.length > 1 && (
              <span className="bg-orange-400/30 text-white text-xs px-3 py-1 rounded-full">
                {segments.length - 1} escala{segments.length - 1 > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Itinerary timeline */}
        <div className="p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Itinerario</h3>
          <div className="space-y-0">
            {segments.map((seg, idx) => {
              const dep = formatDateTime(seg.departure?.at);
              const arr = formatDateTime(seg.arrival?.at);
              const segDuration = parseDuration(seg.duration);
              const segAirline = getAirlineName(seg.carrierCode, carriers);
              const depCity = getCityName(seg.departure?.iataCode);
              const arrCity = getCityName(seg.arrival?.iataCode);

              return (
                <React.Fragment key={idx}>
                  {/* Segment */}
                  <div className="flex gap-4">
                    {/* Timeline dots */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-[#2E9BC6] border-2 border-[#2E9BC6] z-10"></div>
                      <div className="w-0.5 flex-1 bg-[#2E9BC6]/30"></div>
                      <div className="w-3 h-3 rounded-full bg-[#2E9BC6] border-2 border-[#2E9BC6] z-10"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      {/* Departure */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-gray-800">{dep.time}</span>
                        <span className="text-xs text-gray-400">{dep.date}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {depCity} <span className="text-gray-400">({seg.departure?.iataCode})</span>
                      </div>

                      {/* Duration bar */}
                      <div className="my-3 ml-2 pl-3 border-l-2 border-dashed border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{segDuration}</span>
                          {segments.length > 1 && <span>· {segAirline} {seg.carrierCode} {seg.number}</span>}
                        </div>
                      </div>

                      {/* Arrival */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold text-gray-800">{arr.time}</span>
                        <span className="text-xs text-gray-400">{arr.date}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {arrCity} <span className="text-gray-400">({seg.arrival?.iataCode})</span>
                      </div>
                    </div>
                  </div>

                  {/* Stopover */}
                  {idx < segments.length - 1 && (
                    <div className="flex gap-4 my-2">
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 flex-1 bg-orange-300/50"></div>
                      </div>
                      <div className="flex-1 bg-orange-50 rounded-lg p-2 text-xs text-orange-600 border border-orange-200">
                        <span className="font-medium">Escala en {arrCity}</span>
                        {(() => {
                          const nextDep = new Date(segments[idx + 1]?.departure?.at);
                          const thisArr = new Date(seg.arrival?.at);
                          const diffMs = nextDep - thisArr;
                          const diffH = Math.floor(diffMs / 3600000);
                          const diffM = Math.floor((diffMs % 3600000) / 60000);
                          return diffMs > 0 ? ` · ${diffH}h ${diffM}min de espera` : '';
                        })()}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Duration total */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Duración total: <span className="font-medium text-gray-700">{parseDuration(itinerary?.duration)}</span>
          </div>

          {/* Extra info */}
          {baggageText && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Equipaje: <span className="font-medium text-gray-700">{baggageText}</span>
            </div>
          )}
        </div>

        {/* Footer: Price + CTAs */}
        <div className="px-5 pb-5">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-sm text-gray-500">Precio total</div>
                <div className="text-3xl font-bold text-[#FA713B]">
                  {currency} {parseFloat(price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-400">por persona · impuestos incluidos</div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <a
                  href={skyscannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2E9BC6] hover:bg-[#2589b0] text-white px-6 py-3 rounded-full transition-colors text-sm font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Buscar en Skyscanner
                </a>
                {airlineUrl && (
                  <a
                    href={airlineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#2E9BC6] text-[#2E9BC6] hover:bg-[#2E9BC6]/5 px-6 py-2.5 rounded-full transition-colors text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Ir a {airlineName}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetailModal;
