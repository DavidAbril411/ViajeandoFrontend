// Mapa de códigos IATA de aeropuertos a nombres de ciudad
const AIRPORT_CITIES = {
  // Argentina
  EZE: 'Buenos Aires',
  AEP: 'Buenos Aires',
  COR: 'Córdoba',
  ROS: 'Rosario',
  MDZ: 'Mendoza',
  BRC: 'Bariloche',
  IGR: 'Iguazú',
  USH: 'Ushuaia',
  SLA: 'Salta',
  TUC: 'Tucumán',

  // Latinoamérica
  GRU: 'São Paulo',
  GIG: 'Río de Janeiro',
  SCL: 'Santiago',
  LIM: 'Lima',
  BOG: 'Bogotá',
  MEX: 'Ciudad de México',
  CUN: 'Cancún',
  PTY: 'Panamá',
  MVD: 'Montevideo',
  UIO: 'Quito',
  CCS: 'Caracas',
  HAV: 'La Habana',
  SJO: 'San José',

  // Norteamérica
  JFK: 'Nueva York',
  EWR: 'Nueva York',
  LGA: 'Nueva York',
  MIA: 'Miami',
  LAX: 'Los Ángeles',
  SFO: 'San Francisco',
  ORD: 'Chicago',
  ATL: 'Atlanta',
  DFW: 'Dallas',
  IAH: 'Houston',
  YYZ: 'Toronto',
  YVR: 'Vancouver',
  YUL: 'Montreal',

  // Europa
  CDG: 'París',
  ORY: 'París',
  LHR: 'Londres',
  LGW: 'Londres',
  STN: 'Londres',
  FCO: 'Roma',
  BCN: 'Barcelona',
  MAD: 'Madrid',
  AMS: 'Ámsterdam',
  FRA: 'Fráncfort',
  MUC: 'Múnich',
  ZRH: 'Zúrich',
  VIE: 'Viena',
  IST: 'Estambul',
  ATH: 'Atenas',
  LIS: 'Lisboa',
  CPH: 'Copenhague',
  OSL: 'Oslo',
  ARN: 'Estocolmo',
  HEL: 'Helsinki',
  BRU: 'Bruselas',
  DUB: 'Dublín',

  // Medio Oriente
  DXB: 'Dubái',
  DOH: 'Doha',
  AUH: 'Abu Dabi',
  TLV: 'Tel Aviv',
  AMM: 'Amán',
  RUH: 'Riad',
  JED: 'Yeda',

  // Asia-Pacífico
  NRT: 'Tokio',
  HND: 'Tokio',
  PEK: 'Pekín',
  PVG: 'Shanghái',
  HKG: 'Hong Kong',
  SIN: 'Singapur',
  BKK: 'Bangkok',
  ICN: 'Seúl',
  KUL: 'Kuala Lumpur',
  DEL: 'Nueva Delhi',
  BOM: 'Bombay',
  SYD: 'Sídney',
  MEL: 'Melbourne',
  AKL: 'Auckland',

  // África
  JNB: 'Johannesburgo',
  CPT: 'Ciudad del Cabo',
  CAI: 'El Cairo',
  CMN: 'Casablanca',
  ADD: 'Addis Abeba',
  NBO: 'Nairobi',

  // Códigos de ciudad Amadeus (multi-aeropuerto)
  PAR: 'París',
  LON: 'Londres',
  NYC: 'Nueva York',
  ROM: 'Roma',
  TYO: 'Tokio',
  BUE: 'Buenos Aires',

  // Mock
  MOCK_ORG: 'Origen (Demo)',
  MOCK_DST: 'Destino (Demo)',
};

/**
 * Obtiene el nombre de ciudad para un código IATA de aeropuerto.
 * @param {string} iataCode - Código IATA (ej: "EZE")
 * @returns {string} Nombre de ciudad o el código original si no se encuentra
 */
export function getCityName(iataCode) {
  return AIRPORT_CITIES[iataCode] || iataCode;
}

export default AIRPORT_CITIES;
