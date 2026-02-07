// Mapa de códigos IATA de aerolíneas a nombres legibles
const AIRLINE_NAMES = {
  // Latinoamérica
  AR: 'Aerolíneas Argentinas',
  LA: 'LATAM Airlines',
  CM: 'Copa Airlines',
  AV: 'Avianca',
  AM: 'Aeroméxico',
  G3: 'GOL Linhas Aéreas',
  JA: 'JetSMART',
  H2: 'Sky Airline',
  FO: 'Flybondi',

  // Norteamérica
  AA: 'American Airlines',
  UA: 'United Airlines',
  DL: 'Delta Air Lines',
  WN: 'Southwest Airlines',
  B6: 'JetBlue Airways',
  AC: 'Air Canada',
  WS: 'WestJet',
  NK: 'Spirit Airlines',
  F9: 'Frontier Airlines',
  AS: 'Alaska Airlines',

  // Europa
  BA: 'British Airways',
  AF: 'Air France',
  LH: 'Lufthansa',
  IB: 'Iberia',
  KL: 'KLM Royal Dutch',
  AZ: 'ITA Airways',
  VY: 'Vueling',
  FR: 'Ryanair',
  U2: 'easyJet',
  LX: 'Swiss International',
  OS: 'Austrian Airlines',
  SK: 'SAS Scandinavian',
  TP: 'TAP Air Portugal',
  TK: 'Turkish Airlines',
  SN: 'Brussels Airlines',
  LO: 'LOT Polish Airlines',
  AY: 'Finnair',

  // Medio Oriente
  EK: 'Emirates',
  QR: 'Qatar Airways',
  EY: 'Etihad Airways',
  SV: 'Saudia',
  GF: 'Gulf Air',
  RJ: 'Royal Jordanian',
  WY: 'Oman Air',

  // Asia-Pacífico
  JL: 'Japan Airlines',
  NH: 'ANA (All Nippon)',
  SQ: 'Singapore Airlines',
  CX: 'Cathay Pacific',
  TG: 'Thai Airways',
  MH: 'Malaysia Airlines',
  GA: 'Garuda Indonesia',
  QF: 'Qantas',
  NZ: 'Air New Zealand',
  KE: 'Korean Air',
  OZ: 'Asiana Airlines',
  CI: 'China Airlines',
  BR: 'EVA Air',
  AI: 'Air India',
  CZ: 'China Southern',
  CA: 'Air China',
  MU: 'China Eastern',

  // África
  ET: 'Ethiopian Airlines',
  SA: 'South African Airways',
  MS: 'EgyptAir',
  AT: 'Royal Air Maroc',

  // Mock
  MK: 'MockAir (Demo)',
};

/**
 * Obtiene el nombre legible de una aerolínea dado su código IATA.
 * Busca primero en el diccionario de Amadeus (si disponible), 
 * luego en el mapa estático local.
 * @param {string} code - Código IATA de la aerolínea (ej: "AC")
 * @param {Object} [dictionaries] - Diccionario de carriers de Amadeus (code → name)
 * @returns {string} Nombre de la aerolínea o el código si no se encuentra
 */
export function getAirlineName(code, dictionaries) {
  if (dictionaries && dictionaries[code]) {
    // Amadeus devuelve en MAYÚSCULAS, formateamos a Title Case
    const raw = dictionaries[code];
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  }
  return AIRLINE_NAMES[code] || code;
}

export default AIRLINE_NAMES;
