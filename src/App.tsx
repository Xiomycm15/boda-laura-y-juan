import { useEffect, useRef, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import siNoTeTengoTrack from './assets/audio/si-no-te-tengo.mp3'
import theVowTrack from './assets/audio/the-vow.mp3'
import volviANacerTrack from './assets/audio/volvi-a-nacer.mp3'
import dressCodeEllas from './assets/decor/dress-code-ellas.jpeg'
import dressCodeEllos from './assets/decor/dress-code-ellos.jpeg'
import marinoArenaEstrella from './assets/decor/marino-arena-estrella.png'
import marinoCaracolaEstrella from './assets/decor/marino-caracola-estrella.png'
import marinoConchasPlaya from './assets/decor/marino-conchas-playa.png'
import marinoPerlasEstrellas from './assets/decor/marino-perlas-estrellas.png'
import sicomoroAcuarela from './assets/decor/sicomoro-acuarela.jpg'
import portadaLauraJuan from './assets/images/portada-marco-final.png'
import tarifasHotelActualizadas from './assets/info/tarifas-hotel-actualizadas.jpeg'
import retratos01 from './assets/gallery/retratos-01.jpeg'
import retratos02 from './assets/gallery/retratos-02.jpeg'
import retratos03 from './assets/gallery/retratos-03.jpeg'
import retratos04 from './assets/gallery/retratos-04.jpeg'
import retratos05 from './assets/gallery/retratos-05.jpeg'
import retratos06 from './assets/gallery/retratos-06.jpeg'
import retratos07 from './assets/gallery/retratos-07.jpeg'
import retratos08 from './assets/gallery/retratos-08.jpeg'
import retratos09 from './assets/gallery/retratos-09.jpeg'
import retratos10 from './assets/gallery/retratos-10.jpeg'
import retratos11 from './assets/gallery/retratos-11.jpeg'
import retratos12 from './assets/gallery/retratos-12.jpeg'
import retratos13 from './assets/gallery/retratos-13.jpeg'
import retratos14 from './assets/gallery/retratos-14.jpeg'
import retratos15 from './assets/gallery/retratos-15.jpeg'
import retratos16 from './assets/gallery/retratos-16.jpeg'
import retratos17 from './assets/gallery/retratos-17.jpeg'
import retratos18 from './assets/gallery/retratos-18.jpeg'

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

type TravelGroupMode = 'individual' | 'create' | 'join'

type InvitationType = 'individual' | 'family'

type InvitationPreset = {
  code: string
  slug: string
  label: string
  members: string[]
  isOptional?: boolean
}

type InvitationMember = {
  id: string
  name: string
  attending: boolean
  fullName: string
  identityDocument: string
  phone: string
  email: string
  hasAllergies: boolean
  allergies: string
  isPrimaryContact: boolean
}

type NightCount = '1' | '2' | '3' | '4' | '5' | '6' | '7'

type LodgingOption = {
  id: string
  label: string
  totalRooms: number
  capacity: number
  pricesByNight: Partial<Record<NightCount, number>> & Record<'1', number>
}

type ExistingGroupOption = {
  id: string
  label: string
  leaderName: string
  capacity: number
  reservedPeople: number
  room: string
  numberOfNights: number
  checkInDate: string
  checkOutDate: string
  arrivalTime: string
  departureTime: string
  boardingPoint: string
}

type SavedRsvpRecord = {
  full_name: string | null
  identity_document: string | null
  phone: string | null
  invitation_code: string | null
  invitation_label: string | null
  description: string | null
  travel_group_mode: TravelGroupMode | null
  group_id: string | null
  group_label: string | null
  group_leader_name: string | null
  group_capacity: number | null
  room: string | null
  number_of_people: number | null
  number_of_nights: number | null
  check_in_date: string | null
  check_out_date: string | null
  arrival_time: string | null
  departure_time: string | null
  boarding_point: string | null
  allergies: string | null
  notes: string | null
  attendees_json: InvitationMember[] | null
}

type AdminReservationRecord = {
  id: string
  full_name: string | null
  identity_document: string | null
  phone: string | null
  invitation_code: string | null
  invitation_label: string | null
  travel_group_mode: TravelGroupMode | null
  group_id: string | null
  group_label: string | null
  group_leader_name: string | null
  group_capacity: number | null
  room: string | null
  number_of_people: number | null
  number_of_nights: number | null
  check_in_date: string | null
  check_out_date: string | null
  arrival_time: string | null
  departure_time: string | null
  boarding_point: string | null
  attendees_json: InvitationMember[] | null
  allergies: string | null
  notes: string | null
  created_at: string | null
}

type AdminReservationSummary = {
  id: string
  reservation: AdminReservationRecord
  attendees: InvitationMember[]
  confirmedPeople: number
  linkedInvitations: number
  invitationCodes: string[]
  primaryContactAttendeeId: string | null
}

type SavedReservationSnapshot = {
  invitationCode: string | null
  room: string | null
  travelGroupMode: TravelGroupMode | null
}

type AvailabilityEntry = {
  invitationCode: string | null
  room: string
  checkInDate: string
  checkOutDate: string
  travelGroupMode: TravelGroupMode | null
}

const LOCAL_GROUPS_STORAGE_KEY = 'laura-juan-created-groups'
const ADMIN_SESSION_STORAGE_KEY = 'laura-juan-admin-access'
const adminAccessKey = import.meta.env.VITE_NOVIOS_PANEL_KEY ?? 'laura-juan-2027'
const BABY_NOT_APPLICABLE_VALUE = 'No Aplica (bebe)'
const babyGuestsByInvitationCode: Record<string, string[]> = {
  'INV-013': ['Sarita'],
  'INV-016': ['Simón'],
  'INV-039': ['Emi'],
}

type RsvpFormData = {
  fullName: string
  identityDocument: string
  phone: string
  travelGroupMode: TravelGroupMode
  groupName: string
  groupLeaderName: string
  sharedInvitationsEstimate: string
  description: string
  room: string
  numberOfNights: string
  checkInDate: string
  checkOutDate: string
  arrivalTime: string
  departureTime: string
  boardingPoint: string
  allergies: string
  notes: string
}

type SongSuggestionFormData = {
  guestName: string
  songName: string
  artistName: string
  songLink: string
}

type SongSuggestionRecord = {
  id: string
  guest_name: string | null
  song_name: string | null
  artist_name: string | null
  song_link: string | null
  created_at?: string | null
}

type SoundtrackTrack = {
  title: string
  artist: string
  src: string
}

const weddingDate = new Date('2027-05-27T16:30:00')
const weddingSoundtrack: SoundtrackTrack[] = [
  {
    title: 'Si no te tengo',
    artist: 'Green Valley',
    src: siNoTeTengoTrack,
  },
  {
    title: 'Volví a Nacer',
    artist: 'Carlos Vives',
    src: volviANacerTrack,
  },
  {
    title: 'The Vow',
    artist: 'Ed Sheeran',
    src: theVowTrack,
  },
]

function formatTrackTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '0:00'
  }

  const safeSeconds = Math.floor(totalSeconds)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

const invitationPresets: InvitationPreset[] = [
  { code: 'INV-001', slug: 'papitos-jeanet-salo', label: 'Papitos: Jeanet & Salo', members: ['Jeanet', 'Salo'] },
  { code: 'INV-002', slug: 'papitos-margareth-juanc', label: 'Papitos: Margareth & JuanC', members: ['Margareth', 'JuanC'] },
  { code: 'INV-003', slug: 'checho', label: 'Checho', members: ['Checho'] },
  { code: 'INV-004', slug: 'tia-blanquita', label: 'Tía Blanquita', members: ['Tía Blanquita'] },
  { code: 'INV-005', slug: 'anis-juanca', label: 'Anis & JuanCa', members: ['Anis', 'JuanCa'] },
  { code: 'INV-006', slug: 'tia-consuelo-santi', label: 'Tía Consuelo & Santi', members: ['Tía Consuelo', 'Santi'] },
  { code: 'INV-007', slug: 'tia-martha-dani-xiomi', label: 'Tía Martha, Dani & Xiomi', members: ['Tía Martha', 'Dani', 'Xiomi'] },
  { code: 'INV-008', slug: 'tia-martha-tio-hector', label: 'Tía Martha & Tío Hector', members: ['Tía Martha', 'Tío Hector'] },
  { code: 'INV-009', slug: 'andres-diana-marti-gabi', label: 'Andrés, Diana, Marti & Gabi', members: ['Andrés', 'Diana', 'Marti', 'Gabi'] },
  { code: 'INV-010', slug: 'natis-cesar', label: 'Natis & Cesar', members: ['Natis', 'Cesar'] },
  { code: 'INV-011', slug: 'moni-alejo-joaco', label: 'Moni, Alejo & Joaco', members: ['Moni', 'Alejo', 'Joaco'] },
  { code: 'INV-012', slug: 'tio-gustavo-diana-dani', label: 'Tío Gustavo, Diana & Dani', members: ['Tío Gustavo', 'Diana', 'Dani'] },
  { code: 'INV-013', slug: 'jess-ronald-sarita', label: 'Jess, Ronald & Sarita', members: ['Jess', 'Ronald', 'Sarita'] },
  { code: 'INV-014', slug: 'tio-luis-maria-t', label: 'Tío Luis & María T.', members: ['Tío Luis', 'María T.'] },
  { code: 'INV-015', slug: 'cami-1', label: 'Cami', members: ['Cami'] },
  { code: 'INV-016', slug: 'pipe-nata-simon', label: 'Pipe, Nata & Simón', members: ['Pipe', 'Nata', 'Simón'] },
  { code: 'INV-017', slug: 'abuelito-rafa', label: 'Abuelito Rafa', members: ['Abuelito Rafa'] },
  { code: 'INV-018', slug: 'tio-carlos', label: 'Tío Carlos', members: ['Tío Carlos'] },
  { code: 'INV-019', slug: 'rafa', label: 'Rafa', members: ['Rafa'] },
  { code: 'INV-020', slug: 'mafe', label: 'Mafe', members: ['Mafe'] },
  { code: 'INV-022', slug: 'tia-adri-dieguis', label: 'Tía Adri & Dieguis', members: ['Tía Adri', 'Dieguis'] },
  { code: 'INV-023', slug: 'tia-rosita', label: 'Tía Rosita', members: ['Tía Rosita'] },
  { code: 'INV-024', slug: 'tia-albita', label: 'Tía Albita', members: ['Tía Albita'] },
  { code: 'INV-025', slug: 'tia-arturo-marthica', label: 'Tía Arturo & Marthica', members: ['Tía Arturo', 'Marthica'] },
  { code: 'INV-026', slug: 'tio-guillo-rosalbita', label: 'Tío Guillo & Rosalbita', members: ['Tío Guillo', 'Rosalbita'] },
  { code: 'INV-029', slug: 'tio-fabio-maria-cami', label: 'Tío Fabio, María & Cami', members: ['Tío Fabio', 'María', 'Cami'] },
  { code: 'INV-030', slug: 'fabio-andres-eliana', label: 'Fabio Andrés & Eliana', members: ['Fabio Andrés', 'Eliana'] },
  { code: 'INV-031', slug: 'tia-bertha', label: 'Tía Bertha', members: ['Tía Bertha'] },
  { code: 'INV-032', slug: 'tio-bernardo', label: 'Tío Bernardo', members: ['Tío Bernardo'] },
  { code: 'INV-033', slug: 'pau-bris', label: 'Pau & Bris', members: ['Pau', 'Bris'] },
  { code: 'INV-034', slug: 'juli', label: 'Juli', members: ['Juli'] },
  { code: 'INV-035', slug: 'kim', label: 'Kim', members: ['Kim'] },
  { code: 'INV-036', slug: 'anita-vladi', label: 'Anita & Vladi', members: ['Anita', 'Vladi'] },
  { code: 'INV-037', slug: 'pine', label: 'Piñe', members: ['Piñe'] },
  { code: 'INV-038', slug: 'cata-ness', label: 'Cata & Ness', members: ['Cata', 'Ness'] },
  { code: 'INV-039', slug: 'moni-la-flor-emi', label: 'Moni, La Flor & Emi', members: ['Moni', 'La Flor', 'Emi'] },
  { code: 'INV-040', slug: 'jamin', label: 'Jamin', members: ['Jamin'] },
  { code: 'INV-041', slug: 'cami-2', label: 'Cami', members: ['Cami'] },
  { code: 'INV-042', slug: 'sebas-stefania', label: 'Sebas & Stefania', members: ['Sebas', 'Stefania'] },
  { code: 'INV-043', slug: 'fabi-mari', label: 'Fabi & Mari', members: ['Fabi', 'Mari'] },
  { code: 'INV-044', slug: 'nico', label: 'Nico', members: ['Nico'] },
  { code: 'INV-045', slug: 'juanca-alejandra', label: 'JuanCa & Alejandra', members: ['JuanCa', 'Alejandra'] },
  { code: 'INV-046', slug: 'santi-sofia', label: 'Santi & Sofía', members: ['Santi', 'Sofía'] },
  { code: 'INV-047', slug: 'rafa-alejandra', label: 'Rafa & Alejandra', members: ['Rafa', 'Alejandra'] },
  { code: 'INV-048', slug: 'juanfe', label: 'JuanFe', members: ['JuanFe'] },
  {
    code: 'INV-049',
    slug: 'manuelish-novio',
    label: 'Manuelish & Novio',
    members: ['Manuelish', 'Novio'],
    isOptional: true,
  },
  { code: 'INV-050', slug: 'angelilla', label: 'Angelilla', members: ['Angelilla'], isOptional: true },
  { code: 'INV-051', slug: 'lini', label: 'Lini', members: ['Lini'], isOptional: true },
  {
    code: 'INV-052',
    slug: 'cami-juan-diego',
    label: 'Cami & Juan Diego',
    members: ['Cami', 'Juan Diego'],
    isOptional: true,
  },
  { code: 'INV-053', slug: 'tania', label: 'Tania', members: ['Tania'], isOptional: true },
  {
    code: 'INV-054',
    slug: 'camila-brayan',
    label: 'Camila & Brayan',
    members: ['Camila', 'Brayan'],
    isOptional: true,
  },
  {
    code: 'INV-055',
    slug: 'maria-paula-santiago',
    label: 'Maria Paula & Santiago',
    members: ['Maria Paula', 'Santiago'],
    isOptional: true,
  },
  { code: 'INV-056', slug: 'yeira', label: 'Yeira', members: ['Yeira'], isOptional: true },
  {
    code: 'INV-057',
    slug: 'brayan-esposa',
    label: 'Brayan & esposa',
    members: ['Brayan', 'Esposa'],
    isOptional: true,
  },
]

const initialFormData: RsvpFormData = {
  fullName: '',
  identityDocument: '',
  phone: '',
  travelGroupMode: 'individual',
  groupName: '',
  groupLeaderName: '',
  sharedInvitationsEstimate: '',
  description: '',
  room: '',
  numberOfNights: '',
  checkInDate: '',
  checkOutDate: '',
  arrivalTime: '',
  departureTime: '',
  boardingPoint: '',
  allergies: '',
  notes: '',
}

const initialSongSuggestionFormData: SongSuggestionFormData = {
  guestName: '',
  songName: '',
  artistName: '',
  songLink: '',
}

function buildInitialFormData(): RsvpFormData {
  return {
    ...initialFormData,
    fullName: '',
  }
}

function isAdminRoute() {
  const searchParams = new URLSearchParams(window.location.search)
  const panelFlag = searchParams.get('panel')
  const normalizedPathname = window.location.pathname.replace(/\/+$/, '')

  return (
    panelFlag === '1' ||
    panelFlag === 'true' ||
    normalizedPathname === '/novios' ||
    normalizedPathname.endsWith('/novios')
  )
}

function formatAdminDate(value: string | null) {
  if (!value) {
    return 'Sin definir'
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

function formatAdminDateTime(value: string | null) {
  if (!value) {
    return 'Sin registro'
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function sanitizeStoredAttendees(value: unknown): InvitationMember[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const candidate = item as Partial<InvitationMember>

      return {
        id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `saved-${index}`,
        name: typeof candidate.name === 'string' ? candidate.name : '',
        attending: typeof candidate.attending === 'boolean' ? candidate.attending : true,
        fullName: typeof candidate.fullName === 'string' ? candidate.fullName : typeof candidate.name === 'string' ? candidate.name : '',
        identityDocument: typeof candidate.identityDocument === 'string' ? candidate.identityDocument : '',
        phone: typeof candidate.phone === 'string' ? candidate.phone : '',
        email: typeof candidate.email === 'string' ? candidate.email : '',
        hasAllergies: Boolean(candidate.hasAllergies) || Boolean(typeof candidate.allergies === 'string' && candidate.allergies.trim()),
        allergies: typeof candidate.allergies === 'string' ? candidate.allergies : '',
        isPrimaryContact: Boolean(candidate.isPrimaryContact),
      }
    })
    .filter((member): member is InvitationMember => member !== null)
}

function resolveStoredAttendees(
  value: unknown,
  fallback: {
    reservationId?: string | null
    fullName?: string | null
    identityDocument?: string | null
    phone?: string | null
    allergies?: string | null
  },
): InvitationMember[] {
  const sanitizedAttendees = sanitizeStoredAttendees(value)

  if (sanitizedAttendees.length > 0) {
    return sanitizedAttendees
  }

  const fallbackName = fallback.fullName?.trim() ?? ''
  const fallbackDocument = fallback.identityDocument?.trim() ?? ''
  const fallbackPhone = fallback.phone?.trim() ?? ''
  const fallbackAllergies = fallback.allergies?.trim() ?? ''

  if (!fallbackName && !fallbackDocument && !fallbackPhone && !fallbackAllergies) {
    return []
  }

  return [
    {
      id: fallback.reservationId?.trim() || 'fallback-contact',
      name: fallbackName,
      attending: true,
      fullName: fallbackName,
      identityDocument: fallbackDocument,
      phone: fallbackPhone,
      email: '',
      hasAllergies: Boolean(fallbackAllergies),
      allergies: fallbackAllergies,
      isPrimaryContact: true,
    },
  ]
}

const lovePortraits = [
  { src: retratos01, alt: 'Laura y Juan sonriéndose frente al mar al atardecer' },
  { src: retratos02, alt: 'Laura y Juan abrazados junto al mar en Isla Múcura' },
  { src: retratos15, alt: 'Laura y Juan besándose frente a unos jardines y un lago bajo el sol' },
  { src: retratos03, alt: 'Laura y Juan abrazados frente al mar con el sol cayendo' },
  { src: retratos04, alt: 'Laura y Juan tomados de la mano con vista panorámica urbana' },
  { src: retratos17, alt: 'Laura y Juan abrazados de espaldas frente a un lago rodeado de naturaleza' },
  { src: retratos05, alt: 'Laura y Juan riendo juntos en una noche especial' },
  { src: retratos06, alt: 'Laura y Juan caminando de la mano por la playa' },
  { src: retratos07, alt: 'Laura y Juan besándose frente a la Torre Eiffel' },
  { src: retratos18, alt: 'Laura y Juan abrazados en una exhibición con un dragón blanco gigante' },
  { src: retratos08, alt: 'Laura y Juan compartiendo una tarde juntos en una banca' },
  { src: retratos09, alt: 'Laura y Juan abrazados en el mar cristalino' },
  { src: retratos16, alt: 'Laura y Juan sonriendo juntos en un taller de cerámica' },
  { src: retratos10, alt: 'Laura y Juan abrazados en un muelle frente al mar' },
  { src: retratos11, alt: 'Laura y Juan buceando tomados de la mano' },
  { src: retratos12, alt: 'Laura y Juan abrazados con vista al mar desde una montaña' },
  { src: retratos13, alt: 'Laura y Juan sonriendo durante un viaje mágico' },
  { src: retratos14, alt: 'Laura y Juan compartiendo un beso en Cartagena' },
]

const travelGroupOptions = [
  {
    value: 'individual',
    title: 'Esta invitación se hospeda sola',
    description: 'La familia o invitado confirma sin compartir alojamiento con otros invitados.',
  },
  {
    value: 'create',
    title: 'Esta invitación crea un grupo',
    description: 'Esta familia creará un grupo de hospedaje para compartirlo con otros invitados.',
  },
  {
    value: 'join',
    title: 'Esta invitación se une a otro grupo',
    description: 'La familia confirma por separado, pero compartirá habitación o logística con otra invitación.',
  },
] as const

const lodgingOptions: LodgingOption[] = [
  {
    id: 'bungalow-suite-doble-mar',
    label: 'Bungalow Suite - doble vista al mar',
    totalRooms: 5,
    capacity: 2,
    pricesByNight: { 1: 953399, 2: 1586798, 3: 2220197 },
  },
  {
    id: 'bungalow-deluxe-triple-frente-mar',
    label: 'Bungalow Deluxe - triple dos camas, vista frente al mar',
    totalRooms: 5,
    capacity: 3,
    pricesByNight: { 1: 941718, 2: 1563436, 3: 2185154 },
  },
  {
    id: 'bungalow-deluxe-doble-frente-mar',
    label: 'Bungalow Deluxe - doble, vista frente al mar',
    totalRooms: 10,
    capacity: 2,
    pricesByNight: { 1: 1032877, 2: 1745754, 3: 2458631 },
  },
  {
    id: 'bungalow-deluxe-pool-doble-frente-mar',
    label: 'Bungalow Deluxe Pool Privada - doble frente al mar',
    totalRooms: 3,
    capacity: 2,
    pricesByNight: { 1: 1134339, 2: 1948677, 3: 2763016 },
  },
  {
    id: 'bungalow-familiar-cuadruple-frente-mar',
    label: 'Bungalow Familiar - cuadruple, vista frente al mar',
    totalRooms: 3,
    capacity: 4,
    pricesByNight: { 1: 861071, 2: 1402141, 3: 1943212 },
  },
  {
    id: 'cabana-familiar-quintuple',
    label: 'Cabaña Familiar - quintuple con aire',
    totalRooms: 2,
    capacity: 5,
    pricesByNight: { 1: 830146, 2: 1340291, 3: 1850437 },
  },
  {
    id: 'kiosko-jardin-deluxe-cuadruple',
    label: 'Kiosko Jardín Deluxe - cuadruple, vista al jardín',
    totalRooms: 6,
    capacity: 4,
    pricesByNight: { 1: 827416, 2: 1334832, 3: 1842248 },
  },
  {
    id: 'kiosko-jardin-doble',
    label: 'Kiosko Jardín - doble, vista al jardín con aire',
    totalRooms: 2,
    capacity: 2,
    pricesByNight: { 1: 840454, 2: 1360908, 3: 1881362 },
  },
  {
    id: 'villa-pool-familiar-sextuple',
    label: 'Villa Pool Familiar - sextuple con piscina privada',
    totalRooms: 2,
    capacity: 6,
    pricesByNight: { 1: 809529, 2: 1299058, 3: 1788586 },
  },
  {
    id: 'villa-piscina-oasis-cuadruple',
    label: 'Villa Piscina Oasis - cuadruple, vista al jardín',
    totalRooms: 7,
    capacity: 4,
    pricesByNight: { 1: 826189, 2: 1332378, 3: 1838566 },
  },
  {
    id: 'villa-piscina-triple-con-piscina',
    label: 'Villa Piscina - triple con piscina privada, vista al jardín',
    totalRooms: 3,
    capacity: 3,
    pricesByNight: { 1: 878147, 2: 1436293, 3: 1994440 },
  },
  {
    id: 'mangle-doble',
    label: 'Mangle - doble',
    totalRooms: 9,
    capacity: 2,
    pricesByNight: { 1: 823273, 2: 1326547, 3: 1829820 },
  },
  {
    id: 'kiosko-deluxe-elevado-presidencial',
    label: 'Kiosko Deluxe Elevado Presidencial - cuadruple vista panorámica frente al mar (No se admiten niños)',
    totalRooms: 1,
    capacity: 4,
    pricesByNight: { 1: 866500, 2: 1413000, 3: 1959500 },
  },
  {
    id: 'kiosko-deluxe-elevado-doble',
    label: 'Kiosko Deluxe Elevado - doble vista panorámica frente al mar (No se admiten niños)',
    totalRooms: 4,
    capacity: 2,
    pricesByNight: { 1: 956595, 2: 1593190, 3: 2229785 },
  },
]

const supportedNightCounts: NightCount[] = ['1', '2', '3', '4', '5', '6', '7']

function isNightCount(value: string | number | null | undefined): value is NightCount {
  if (value == null) {
    return false
  }

  return supportedNightCounts.includes(String(value) as NightCount)
}

function getPriceForNightCount(option: LodgingOption | null, nightCount: NightCount | null) {
  if (!option || !nightCount) {
    return null
  }

  const configuredPrice = option.pricesByNight[nightCount]

  if (typeof configuredPrice === 'number') {
    return configuredPrice
  }

  const baseOneNightPrice = option.pricesByNight['1']

  return typeof baseOneNightPrice === 'number' ? baseOneNightPrice * Number(nightCount) : null
}

function getInvitationType(invitation: InvitationPreset): InvitationType {
  return invitation.members.length > 1 ? 'family' : 'individual'
}

function getCountdown(targetDate: Date): Countdown {
  const difference = targetDate.getTime() - Date.now()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function normalizeComparableText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function isBabyGuest(invitationCode: string, memberName: string) {
  const babyGuests = babyGuestsByInvitationCode[invitationCode] ?? []
  const normalizedMemberName = normalizeComparableText(memberName)

  return babyGuests.some((babyName) => normalizeComparableText(babyName) === normalizedMemberName)
}

function getBabySafeFieldValue(invitationCode: string, memberName: string, value: string) {
  if (isBabyGuest(invitationCode, memberName)) {
    return BABY_NOT_APPLICABLE_VALUE
  }

  return value.trim()
}

function createMembers(invitation: InvitationPreset): InvitationMember[] {
  return invitation.members.map((memberName, index) => ({
    id: `${invitation.code}-${index}`,
    name: memberName,
    attending: false,
    fullName: '',
    identityDocument: isBabyGuest(invitation.code, memberName) ? BABY_NOT_APPLICABLE_VALUE : '',
    phone: isBabyGuest(invitation.code, memberName) ? BABY_NOT_APPLICABLE_VALUE : '',
    email: isBabyGuest(invitation.code, memberName) ? BABY_NOT_APPLICABLE_VALUE : '',
    hasAllergies: false,
    allergies: '',
    isPrimaryContact: index === 0,
  }))
}

function getInvitationFromSearch(): InvitationPreset {
  const searchParams = new URLSearchParams(window.location.search)
  const inviteSlug = searchParams.get('invite')

  if (!inviteSlug) {
    return {
      code: 'INV-DEFAULT',
      slug: 'invitacion-no-encontrada',
      label: 'Invitación no encontrada',
      members: ['Invitado principal'],
    }
  }

  return (
    invitationPresets.find((invitation) => invitation.slug === inviteSlug) ?? {
      code: 'INV-DEFAULT',
      slug: 'invitacion-no-encontrada',
      label: 'Invitación no encontrada',
      members: ['Invitado principal'],
    }
  )
}

function generateGroupCode(invitationCode: string, groupName: string) {
  const normalizedGroupName = groupName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 12)

  return `${invitationCode}-${normalizedGroupName || 'GRUPO'}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

function getNightDifference(checkInDate: string, checkOutDate: string) {
  if (!checkInDate || !checkOutDate) {
    return null
  }

  const [checkInYear, checkInMonth, checkInDay] = checkInDate.split('-').map(Number)
  const [checkOutYear, checkOutMonth, checkOutDay] = checkOutDate.split('-').map(Number)

  if (
    !checkInYear ||
    !checkInMonth ||
    !checkInDay ||
    !checkOutYear ||
    !checkOutMonth ||
    !checkOutDay
  ) {
    return null
  }

  const checkInUtc = Date.UTC(checkInYear, checkInMonth - 1, checkInDay)
  const checkOutUtc = Date.UTC(checkOutYear, checkOutMonth - 1, checkOutDay)

  return Math.round((checkOutUtc - checkInUtc) / (1000 * 60 * 60 * 24))
}

function readStoredGroups(): ExistingGroupOption[] {
  if (typeof window === 'undefined') {
    return []
  }

  const rawValue = window.localStorage.getItem(LOCAL_GROUPS_STORAGE_KEY)

  if (!rawValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(rawValue) as ExistingGroupOption[]

    return Array.isArray(parsedValue)
      ? parsedValue.map((group) => ({
          ...group,
          capacity: typeof group.capacity === 'number' ? group.capacity : 0,
          reservedPeople: typeof group.reservedPeople === 'number' ? group.reservedPeople : 0,
        }))
      : []
  } catch {
    return []
  }
}

function writeStoredGroups(groups: ExistingGroupOption[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LOCAL_GROUPS_STORAGE_KEY, JSON.stringify(groups))
}

function buildGroupSummary(
  formData: RsvpFormData,
  invitationCode: string,
  principalContactName: string,
  selectedExistingGroup?: ExistingGroupOption | null,
) {
  if (formData.travelGroupMode === 'individual') {
    return 'La invitación se hospeda sola y mantiene su reserva independiente.'
  }

  if (formData.travelGroupMode === 'create') {
    return `Crea grupo compartido: ${formData.groupName || 'Sin nombre aún'} | ID del grupo: ${generateGroupCode(invitationCode, formData.groupName)} | Responsable: ${formData.groupLeaderName || principalContactName || 'Pendiente'} | Personas dentro del grupo: ${formData.sharedInvitationsEstimate || 'Pendiente'}`
  }

  return `Se une a grupo existente: ${selectedExistingGroup?.label || 'Sin nombre aún'} | ID del grupo: ${formData.groupName || 'Pendiente'} | Líder del grupo: ${formData.groupLeaderName || 'Pendiente'}`
}

function countsAsRoomReservation(
  travelGroupMode: TravelGroupMode | null | undefined,
  room: string | null | undefined,
) {
  return Boolean(room?.trim()) && travelGroupMode !== 'join'
}

function getAdjustedReservedRoomCount(
  roomLabel: string,
  availabilityEntries: AvailabilityEntry[],
  selectedCheckInDate: string,
  selectedCheckOutDate: string,
  currentInvitationCode: string | null,
) {
  const normalizedRoomLabel = roomLabel.trim()
  const hasSelectedDates = Boolean(selectedCheckInDate && selectedCheckOutDate)

  return availabilityEntries.reduce((total, entry) => {
    if (entry.room !== normalizedRoomLabel) {
      return total
    }

    if (currentInvitationCode && entry.invitationCode === currentInvitationCode) {
      return total
    }

    if (!hasSelectedDates) {
      return total + 1
    }

    const selectedStart = Date.parse(`${selectedCheckInDate}T00:00:00`)
    const selectedEnd = Date.parse(`${selectedCheckOutDate}T00:00:00`)
    const reservedStart = Date.parse(`${entry.checkInDate}T00:00:00`)
    const reservedEnd = Date.parse(`${entry.checkOutDate}T00:00:00`)

    if (
      Number.isNaN(selectedStart) ||
      Number.isNaN(selectedEnd) ||
      Number.isNaN(reservedStart) ||
      Number.isNaN(reservedEnd)
    ) {
      return total + 1
    }

    const overlaps = selectedStart < reservedEnd && reservedStart < selectedEnd

    return overlaps ? total + 1 : total
  }, 0)
}

function getAdminReservationKey(reservation: AdminReservationRecord) {
  if (reservation.travel_group_mode === 'create' && reservation.group_id?.trim()) {
    return `group:${reservation.group_id.trim()}`
  }

  if (reservation.travel_group_mode === 'join' && reservation.group_id?.trim()) {
    return `group:${reservation.group_id.trim()}`
  }

  if (reservation.invitation_code?.trim()) {
    return `invitation:${reservation.invitation_code.trim()}`
  }

  return `reservation:${reservation.id}`
}

function formatExportDateValue(value: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(`${value}T12:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function escapeSpreadsheetXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function createSpreadsheetCell(value: string | number, isHeader = false) {
  const styleAttribute = isHeader ? ' ss:StyleID="Header"' : ''

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<Cell${styleAttribute}><Data ss:Type="Number">${value}</Data></Cell>`
  }

  return `<Cell${styleAttribute}><Data ss:Type="String">${escapeSpreadsheetXml(String(value))}</Data></Cell>`
}

function createSpreadsheetRow(values: Array<string | number>, isHeader = false) {
  return `<Row>${values.map((value) => createSpreadsheetCell(value, isHeader)).join('')}</Row>`
}

function createMergedSpreadsheetCell(
  value: string | number,
  mergeDown = 0,
  isHeader = false,
  columnIndex?: number,
) {
  const styleAttribute = isHeader ? ' ss:StyleID="Header"' : ''
  const mergeAttribute = mergeDown > 0 ? ` ss:MergeDown="${mergeDown}"` : ''
  const indexAttribute = columnIndex ? ` ss:Index="${columnIndex}"` : ''

  if (typeof value === 'number' && Number.isFinite(value)) {
    return `<Cell${styleAttribute}${mergeAttribute}${indexAttribute}><Data ss:Type="Number">${value}</Data></Cell>`
  }

  return `<Cell${styleAttribute}${mergeAttribute}${indexAttribute}><Data ss:Type="String">${escapeSpreadsheetXml(String(value))}</Data></Cell>`
}

function downloadAdminReservationsWorkbook(reservations: AdminReservationRecord[]) {
  if (typeof window === 'undefined') {
    return
  }

  const hotelHeader = [
    'Reserva ID',
    'Habitacion',
    'Numero de noches',
    'Fecha ingreso',
    'Fecha salida',
    'Numero de asistentes',
    'Nombre asistente',
    'ID asistente',
    'Telefono asistente',
    'Correo asistente',
    'Alergias asistente',
    'Contacto principal',
  ]
  const hotelTableRowsXml: string[] = [createSpreadsheetRow(hotelHeader, true)]
  const reservationGroups = new Map<
    string,
    {
      reservationId: string
      room: string
      numberOfNights: string | number
      checkInDate: string
      checkOutDate: string
      attendees: Array<{
        fullName: string
        identityDocument: string
        phone: string
        email: string
        allergies: string
        isPrimaryContact: boolean
        sourceMode: TravelGroupMode | null
      }>
    }
  >()

  reservations.forEach((reservation) => {
    const reservationId =
      reservation.group_id?.trim() ||
      reservation.invitation_code?.trim() ||
      reservation.id
    const attendingGuests = resolveStoredAttendees(reservation.attendees_json, {
      reservationId: reservation.id,
      fullName: reservation.full_name,
      identityDocument: reservation.identity_document,
      phone: reservation.phone,
      allergies: reservation.allergies,
    }).filter((attendee) => attendee.attending)
    const groupKey = [
      reservationId,
      reservation.room ?? '',
      reservation.number_of_nights ?? '',
      reservation.check_in_date ?? '',
      reservation.check_out_date ?? '',
    ].join('||')

    const currentGroup = reservationGroups.get(groupKey)
    const nextAttendees = attendingGuests.map((attendee) => ({
      fullName: attendee.fullName || attendee.name,
      identityDocument: attendee.identityDocument || '',
      phone: attendee.phone || '',
      email: attendee.email || '',
      allergies: attendee.hasAllergies ? attendee.allergies || 'Si, sin detalle' : 'No reporta',
      isPrimaryContact: attendee.isPrimaryContact,
      sourceMode: reservation.travel_group_mode,
    }))

    if (currentGroup) {
      currentGroup.attendees.push(...nextAttendees)
      return
    }

    reservationGroups.set(groupKey, {
      reservationId,
      room: reservation.room ?? '',
      numberOfNights: reservation.number_of_nights ?? '',
      checkInDate: formatExportDateValue(reservation.check_in_date),
      checkOutDate: formatExportDateValue(reservation.check_out_date),
      attendees: nextAttendees,
    })
  })

  reservationGroups.forEach((group) => {
    const hasCreatedGroupAttendees = group.attendees.some((attendee) => attendee.sourceMode === 'create')
    const normalizedAttendees = group.attendees.map((attendee, index) => {
      if (!hasCreatedGroupAttendees) {
        return attendee
      }

      const createdPrimaryIndex = group.attendees.findIndex(
        (candidate) => candidate.sourceMode === 'create' && candidate.isPrimaryContact,
      )
      const fallbackCreatedIndex = group.attendees.findIndex((candidate) => candidate.sourceMode === 'create')
      const allowedPrimaryIndex = createdPrimaryIndex >= 0 ? createdPrimaryIndex : fallbackCreatedIndex

      return {
        ...attendee,
        isPrimaryContact: index === allowedPrimaryIndex,
      }
    }).sort((left, right) => {
      if (left.isPrimaryContact === right.isPrimaryContact) {
        return 0
      }

      return left.isPrimaryContact ? -1 : 1
    })

    if (!normalizedAttendees.length) {
      hotelTableRowsXml.push(
        `<Row>${[
          createMergedSpreadsheetCell(group.reservationId),
          createMergedSpreadsheetCell(group.room),
          createMergedSpreadsheetCell(group.numberOfNights),
          createMergedSpreadsheetCell(group.checkInDate),
          createMergedSpreadsheetCell(group.checkOutDate),
          createMergedSpreadsheetCell(0),
          createMergedSpreadsheetCell(''),
          createMergedSpreadsheetCell(''),
          createMergedSpreadsheetCell(''),
          createMergedSpreadsheetCell(''),
          createMergedSpreadsheetCell(''),
          createMergedSpreadsheetCell(''),
        ].join('')}</Row>`,
      )
      return
    }

    normalizedAttendees.forEach((attendee, index) => {
      const mergeDown = normalizedAttendees.length - 1
      const isFirstAttendeeRow = index === 0
      const rowCells = isFirstAttendeeRow
        ? [
            createMergedSpreadsheetCell(group.reservationId, mergeDown),
            createMergedSpreadsheetCell(group.room, mergeDown),
            createMergedSpreadsheetCell(group.numberOfNights, mergeDown),
            createMergedSpreadsheetCell(group.checkInDate, mergeDown),
            createMergedSpreadsheetCell(group.checkOutDate, mergeDown),
            createMergedSpreadsheetCell(normalizedAttendees.length, mergeDown),
            createMergedSpreadsheetCell(attendee.fullName),
            createMergedSpreadsheetCell(attendee.identityDocument),
            createMergedSpreadsheetCell(attendee.phone),
            createMergedSpreadsheetCell(attendee.email),
            createMergedSpreadsheetCell(attendee.allergies),
            createMergedSpreadsheetCell(attendee.isPrimaryContact ? 'Si' : 'No'),
          ]
        : [
            createMergedSpreadsheetCell(attendee.fullName, 0, false, 7),
            createMergedSpreadsheetCell(attendee.identityDocument),
            createMergedSpreadsheetCell(attendee.phone),
            createMergedSpreadsheetCell(attendee.email),
            createMergedSpreadsheetCell(attendee.allergies),
            createMergedSpreadsheetCell(attendee.isPrimaryContact ? 'Si' : 'No'),
          ]

      hotelTableRowsXml.push(`<Row>${rowCells.join('')}</Row>`)
    })
  })

  const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40"
>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Borders/>
      <Font ss:FontName="Calibri" ss:Size="11"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
      <Interior ss:Color="#EAF6F1" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Reservas hotel">
    <Table>
      ${hotelTableRowsXml.join('')}
    </Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([workbookXml], { type: 'application/vnd.ms-excel' })
  const url = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  const dateStamp = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `reservas-laura-juan-${dateStamp}.xls`
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function downloadCoupleInvitationsWorkbook(reservations: AdminReservationRecord[]) {
  if (typeof window === 'undefined') {
    return
  }

  const invitationHeader = [
    'Invitacion ID',
    'Link de invitacion',
    'Numero de asistentes',
    'Nombre de asistente',
    'Telefono de contacto',
    'Contacto principal',
    'Confirmacion',
    'Opcional',
  ]
  const invitationRowsXml: string[] = [createSpreadsheetRow(invitationHeader, true)]
  const reservationsByInvitationCode = new Map<string, AdminReservationRecord>()
  const invitationBaseUrl = `${window.location.origin}/?invite=`
  let confirmedAttendeesCount = 0
  let declinedAttendeesCount = 0
  let unconfirmedAttendeesCount = 0

  reservations.forEach((reservation) => {
    const invitationCode = reservation.invitation_code?.trim()

    if (!invitationCode) {
      return
    }

    const currentReservation = reservationsByInvitationCode.get(invitationCode)
    const currentCreatedAt = currentReservation?.created_at ? new Date(currentReservation.created_at).getTime() : 0
    const nextCreatedAt = reservation.created_at ? new Date(reservation.created_at).getTime() : 0

    if (!currentReservation || nextCreatedAt >= currentCreatedAt) {
      reservationsByInvitationCode.set(invitationCode, reservation)
    }
  })

  invitationPresets.forEach((invitation) => {
    const savedReservation = reservationsByInvitationCode.get(invitation.code)
    const storedAttendees = savedReservation
      ? resolveStoredAttendees(savedReservation.attendees_json, {
          reservationId: savedReservation.id,
          fullName: savedReservation.full_name,
          identityDocument: savedReservation.identity_document,
          phone: savedReservation.phone,
          allergies: savedReservation.allergies,
        })
      : []
    const attendeeCount = invitation.members.length
    const inviteLink = `${invitationBaseUrl}${invitation.slug}`

    invitation.members.forEach((memberName, index) => {
      const storedAttendee =
        storedAttendees.find((attendee) => attendee.id === `${invitation.code}-${index}`) ??
        storedAttendees.find(
          (attendee) => normalizeComparableText(attendee.name) === normalizeComparableText(memberName),
        ) ??
        null
      const contactPhone = storedAttendee?.phone || ''
      const isPrimaryContact = storedAttendee?.isPrimaryContact ? 'Si' : 'No'
      const confirmation = storedAttendee ? (storedAttendee.attending ? 'Asistire' : 'No asistire') : 'SIN CONFIRMAR'
      const optionalValue = invitation.isOptional ? 'Si' : 'No'

      if (storedAttendee?.attending) {
        confirmedAttendeesCount += 1
      } else if (storedAttendee) {
        declinedAttendeesCount += 1
      } else {
        unconfirmedAttendeesCount += 1
      }

      const isFirstRow = index === 0
      const mergeDown = attendeeCount - 1
      const rowCells = isFirstRow
        ? [
            createMergedSpreadsheetCell(invitation.code, mergeDown),
            createMergedSpreadsheetCell(inviteLink, mergeDown),
            createMergedSpreadsheetCell(attendeeCount, mergeDown),
            createMergedSpreadsheetCell(storedAttendee?.fullName || memberName),
            createMergedSpreadsheetCell(contactPhone),
            createMergedSpreadsheetCell(isPrimaryContact),
            createMergedSpreadsheetCell(confirmation),
            createMergedSpreadsheetCell(optionalValue, mergeDown),
          ]
        : [
            createMergedSpreadsheetCell(storedAttendee?.fullName || memberName, 0, false, 4),
            createMergedSpreadsheetCell(contactPhone),
            createMergedSpreadsheetCell(isPrimaryContact),
            createMergedSpreadsheetCell(confirmation),
            createMergedSpreadsheetCell(optionalValue),
          ]

      invitationRowsXml.push(`<Row>${rowCells.join('')}</Row>`)
    })
  })

  invitationRowsXml.push(createSpreadsheetRow(['', '', '', '', '', '', '', '']))
  invitationRowsXml.push(
    createSpreadsheetRow([
      'Resumen',
      '',
      '',
      '',
      '',
      '',
      'Total confirmados',
      confirmedAttendeesCount,
    ]),
  )
  invitationRowsXml.push(
    createSpreadsheetRow([
      'Resumen',
      '',
      '',
      '',
      '',
      '',
      'Total no asistiran',
      declinedAttendeesCount,
    ]),
  )
  invitationRowsXml.push(
    createSpreadsheetRow([
      'Resumen',
      '',
      '',
      '',
      '',
      '',
      'Total sin confirmar',
      unconfirmedAttendeesCount,
    ]),
  )

  const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40"
>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Borders/>
      <Font ss:FontName="Calibri" ss:Size="11"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
      <Interior ss:Color="#EAF6F1" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Invitaciones novios">
    <Table>
      ${invitationRowsXml.join('')}
    </Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([workbookXml], { type: 'application/vnd.ms-excel' })
  const url = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  const dateStamp = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `invitaciones-novios-laura-juan-${dateStamp}.xls`
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function downloadSongSuggestionsWorkbook(songSuggestions: SongSuggestionRecord[]) {
  if (typeof window === 'undefined') {
    return
  }

  const songHeader = ['Nombre Asistente', 'Nombre de cancion', 'Autor', 'Link']
  const songRowsXml: string[] = [createSpreadsheetRow(songHeader, true)]

  songSuggestions.forEach((songSuggestion) => {
    songRowsXml.push(
      createSpreadsheetRow([
        songSuggestion.guest_name ?? '',
        songSuggestion.song_name ?? '',
        songSuggestion.artist_name ?? '',
        songSuggestion.song_link ?? '',
      ]),
    )
  })

  const workbookXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook
  xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40"
>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom" ss:WrapText="1"/>
      <Borders/>
      <Font ss:FontName="Calibri" ss:Size="11"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1"/>
      <Interior ss:Color="#EAF6F1" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Canciones sugeridas">
    <Table>
      ${songRowsXml.join('')}
    </Table>
  </Worksheet>
</Workbook>`

  const blob = new Blob([workbookXml], { type: 'application/vnd.ms-excel' })
  const url = window.URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  const dateStamp = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `canciones-sugeridas-laura-juan-${dateStamp}.xls`
  window.document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

function AdminPanel() {
  const [accessCode, setAccessCode] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'granted'
  })
  const [reservations, setReservations] = useState<AdminReservationRecord[]>([])
  const [songSuggestions, setSongSuggestions] = useState<SongSuggestionRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthorized || !supabase) {
      return
    }

    let isCancelled = false
    const supabaseClient = supabase

    async function loadReservations() {
      setIsLoading(true)
      setErrorMessage('')

      const [{ data, error }, { data: songsData, error: songsError }] = await Promise.all([
        supabaseClient.rpc('get_wedding_admin_reservations'),
        supabaseClient
          .from('song_suggestions')
          .select('id, guest_name, song_name, artist_name, song_link, created_at')
          .order('created_at', { ascending: false }),
      ])

      if (isCancelled) {
        return
      }

      if (error || songsError) {
        setErrorMessage('No pudimos cargar las reservas en este momento.')
        setIsLoading(false)
        return
      }

      const nextReservations = ((data ?? []) as AdminReservationRecord[]).map((reservation) => ({
        ...reservation,
        attendees_json: resolveStoredAttendees(reservation.attendees_json, {
          reservationId: reservation.id,
          fullName: reservation.full_name,
          identityDocument: reservation.identity_document,
          phone: reservation.phone,
          allergies: reservation.allergies,
        }),
      }))

      setReservations(nextReservations)
      setSongSuggestions(((songsData ?? []) as SongSuggestionRecord[]))
      setSelectedReservationId((current) => current ?? nextReservations[0]?.id ?? null)
      setLastUpdated(new Date().toISOString())
      setIsLoading(false)
    }

    void loadReservations()
    const intervalId = window.setInterval(() => {
      void loadReservations()
    }, 10000)

    return () => {
      isCancelled = true
      window.clearInterval(intervalId)
    }
  }, [isAuthorized])

  const reservationSummaries = Array.from(
    reservations.reduce((map, reservation) => {
      if (
        !countsAsRoomReservation(reservation.travel_group_mode, reservation.room) &&
        !(reservation.travel_group_mode === 'join' && (reservation.number_of_people ?? 0) > 0)
      ) {
        return map
      }

      const key = getAdminReservationKey(reservation)
      const current = map.get(key)
      const nextAttendees = resolveStoredAttendees(reservation.attendees_json, {
        reservationId: reservation.id,
        fullName: reservation.full_name,
        identityDocument: reservation.identity_document,
        phone: reservation.phone,
        allergies: reservation.allergies,
      })

      if (!current) {
        const primaryContactAttendeeId = nextAttendees.find((attendee) => attendee.isPrimaryContact)?.id ?? null

        map.set(key, {
          id: key,
          reservation,
          attendees: nextAttendees,
          confirmedPeople: reservation.number_of_people ?? nextAttendees.length,
          linkedInvitations: 1,
          invitationCodes: reservation.invitation_code ? [reservation.invitation_code] : [],
          primaryContactAttendeeId,
        })
        return map
      }

      const attendeeMap = new Map<string, InvitationMember>()

      for (const attendee of current.attendees) {
        attendeeMap.set(attendee.id, attendee)
      }

      for (const attendee of nextAttendees) {
        attendeeMap.set(attendee.id, attendee)
      }

      const currentCreatedAt = current.reservation.created_at ? new Date(current.reservation.created_at).getTime() : 0
      const nextCreatedAt = reservation.created_at ? new Date(reservation.created_at).getTime() : 0
      const baseReservation =
        countsAsRoomReservation(reservation.travel_group_mode, reservation.room) ||
        nextCreatedAt > currentCreatedAt
          ? reservation
          : current.reservation
      const nextPrimaryContactAttendeeId = nextAttendees.find((attendee) => attendee.isPrimaryContact)?.id ?? null
      const primaryContactAttendeeId =
        reservation.travel_group_mode === 'create'
          ? nextPrimaryContactAttendeeId
          : current.primaryContactAttendeeId ?? nextPrimaryContactAttendeeId
      const mergedAttendees = Array.from(attendeeMap.values()).map((attendee) => ({
        ...attendee,
        isPrimaryContact: primaryContactAttendeeId !== null && attendee.id === primaryContactAttendeeId,
      }))

      map.set(key, {
        id: key,
        reservation: baseReservation,
        attendees: mergedAttendees,
        confirmedPeople: current.confirmedPeople + (reservation.number_of_people ?? nextAttendees.length),
        linkedInvitations: current.linkedInvitations + 1,
        invitationCodes: Array.from(
          new Set([
            ...current.invitationCodes,
            ...(reservation.invitation_code ? [reservation.invitation_code] : []),
          ]),
        ),
        primaryContactAttendeeId,
      })

      return map
    }, new Map<string, AdminReservationSummary>()).values(),
  )

  const filteredReservations = reservationSummaries.filter((summary) => {
    const { reservation } = summary
    const searchableText = [
      reservation.invitation_code,
      reservation.invitation_label,
      reservation.full_name,
      reservation.group_label,
      reservation.room,
      summary.invitationCodes.join(' '),
      summary.attendees.map((guest) => guest.fullName || guest.name).join(' '),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchableText.includes(searchTerm.trim().toLowerCase())
  })

  const selectedReservation =
    filteredReservations.find((reservation) => reservation.id === selectedReservationId) ??
    filteredReservations[0] ??
    null
  const selectedAttendingGuests = selectedReservation?.attendees.filter((guest) => guest.attending) ?? []
  const declinedInvitations = reservations
    .map((reservation) => {
      const declinedGuests = (reservation.attendees_json ?? []).filter((guest) => !guest.attending)

      return {
        id: reservation.id,
        invitationCode: reservation.invitation_code ?? 'Sin codigo',
        invitationLabel: reservation.invitation_label ?? reservation.full_name ?? 'Invitacion sin nombre',
        guests: declinedGuests,
        createdAt: reservation.created_at,
      }
    })
    .filter((reservation) => reservation.guests.length > 0)

  const actualReservations = reservationSummaries.length
  const confirmedPeople = reservations.reduce((total, reservation) => total + (reservation.number_of_people ?? 0), 0)
  const createdGroups = reservations.filter((reservation) => reservation.travel_group_mode === 'create').length
  const joiningGroups = reservations.filter((reservation) => reservation.travel_group_mode === 'join').length

  function handleAccessSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (accessCode.trim() !== adminAccessKey) {
      setErrorMessage('La clave no es correcta. Intenta de nuevo.')
      return
    }

    window.sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'granted')
    setErrorMessage('')
    setIsAuthorized(true)
  }

  function handleLogout() {
    window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY)
    setIsAuthorized(false)
    setAccessCode('')
    setReservations([])
    setSongSuggestions([])
    setSelectedReservationId(null)
  }

  function handleExportWorkbook() {
    if (!reservations.length) {
      setErrorMessage('Aún no hay reservas para exportar.')
      return
    }

    setErrorMessage('')
    downloadAdminReservationsWorkbook(reservations)
  }

  function handleExportCoupleWorkbook() {
    setErrorMessage('')
    downloadCoupleInvitationsWorkbook(reservations)
  }

  function handleExportSongsWorkbook() {
    if (!songSuggestions.length) {
      setErrorMessage('Aún no hay canciones sugeridas para exportar.')
      return
    }

    setErrorMessage('')
    downloadSongSuggestionsWorkbook(songSuggestions)
  }

  if (!isAuthorized) {
    return (
      <main className="admin-shell">
        <section className="admin-login-card">
          <p className="eyebrow">Panel privado</p>
          <h1>Reservas de Laura y Juan</h1>
          <p className="admin-login-copy">
            Esta vista es solo para ustedes. Ingresen la clave privada para ver las confirmaciones y el avance de las reservas.
          </p>
          <form className="admin-login-form" onSubmit={handleAccessSubmit}>
            <label>
              Clave privada
              <input
                onChange={(event) => setAccessCode(event.target.value)}
                placeholder="Ingresa la clave"
                type="password"
                value={accessCode}
              />
            </label>
            {errorMessage ? <p className="form-feedback is-error">{errorMessage}</p> : null}
            <button className="primary-button" type="submit">
              Entrar al panel
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <div>
          <p className="eyebrow">Panel privado</p>
          <h1>Reservas en tiempo real</h1>
          <p className="admin-subcopy">
            Aquí pueden ver las reservas reales, quiénes están dentro de cada una y los cambios más recientes.
          </p>
        </div>
        <div className="admin-hero-actions">
          <span className="admin-updated-at">Última actualización: {formatAdminDateTime(lastUpdated)}</span>
          <button className="secondary-button" onClick={handleExportWorkbook} type="button">
            Excel hotel
          </button>
          <button className="secondary-button" onClick={handleExportCoupleWorkbook} type="button">
            Excel novios
          </button>
          <button className="secondary-button" onClick={handleExportSongsWorkbook} type="button">
            Excel canciones
          </button>
          <button className="secondary-button" onClick={handleLogout} type="button">
            Cerrar panel
          </button>
        </div>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card">
          <span className="meta-label">Reservas</span>
          <strong>{actualReservations}</strong>
          <p>habitaciones apartadas por invitaciones anfitrionas o individuales</p>
        </article>
        <article className="admin-stat-card">
          <span className="meta-label">Personas confirmadas</span>
          <strong>{confirmedPeople}</strong>
          <p>asistentes registrados hasta ahora</p>
        </article>
        <article className="admin-stat-card">
          <span className="meta-label">Grupos creados</span>
          <strong>{createdGroups}</strong>
          <p>invitaciones anfitrionas de hospedaje</p>
        </article>
        <article className="admin-stat-card">
          <span className="meta-label">Invitaciones unidas</span>
          <strong>{joiningGroups}</strong>
          <p>familias que comparten grupo con otros invitados</p>
        </article>
        <article className="admin-stat-card">
          <span className="meta-label">No asistiran</span>
          <strong>{declinedInvitations.reduce((total, reservation) => total + reservation.guests.length, 0)}</strong>
          <p>personas que marcaron que no iran</p>
        </article>
      </section>

      <section className="admin-panel-grid">
        <aside className="admin-sidebar-card">
          <div className="admin-sidebar-head">
            <strong>Reservas</strong>
            <input
              className="admin-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, código o grupo"
              value={searchTerm}
            />
          </div>
          {isLoading ? <p className="availability-note">Actualizando reservas...</p> : null}
          {errorMessage && isAuthorized ? <p className="availability-note is-error">{errorMessage}</p> : null}
          <div className="admin-reservations-list">
            {filteredReservations.map((reservation) => (
              <button
                className={`admin-reservation-item ${selectedReservation?.id === reservation.id ? 'is-active' : ''}`}
                key={reservation.id}
                onClick={() => setSelectedReservationId(reservation.id)}
                type="button"
              >
                <span className="meta-label">
                  {reservation.reservation.group_id ?? reservation.reservation.invitation_code ?? 'Sin código'}
                </span>
                <strong>
                  {reservation.reservation.group_label ??
                    reservation.reservation.invitation_label ??
                    reservation.reservation.full_name ??
                    'Reserva sin nombre'}
                </strong>
                <span>
                  {reservation.confirmedPeople} persona(s) · {reservation.reservation.room ?? 'Sin habitación'}
                </span>
              </button>
            ))}
            {!filteredReservations.length && !isLoading ? (
              <p className="availability-note">Aún no hay reservas que coincidan con la búsqueda.</p>
            ) : null}
          </div>
        </aside>

        <section className="admin-detail-card">
          {selectedReservation ? (
            <>
              <div className="admin-detail-head">
                <div>
                  <p className="eyebrow">Detalle</p>
                  <h2>
                    {selectedReservation.reservation.group_label ??
                      selectedReservation.reservation.invitation_label ??
                      'Reserva sin etiqueta'}
                  </h2>
                  <p className="admin-subcopy">
                    Código {selectedReservation.reservation.group_id ??
                      selectedReservation.reservation.invitation_code ??
                      'Sin código'}{' '}
                    · Guardada el {formatAdminDateTime(selectedReservation.reservation.created_at)}
                  </p>
                </div>
                <span className="admin-mode-pill">
                  {selectedReservation.reservation.travel_group_mode === 'create'
                    ? 'Crea grupo'
                    : selectedReservation.linkedInvitations > 1
                      ? 'Reserva compartida'
                      : 'Reserva individual'}
                </span>
              </div>

              <div className="admin-summary-grid">
                <article className="admin-summary-card">
                  <span className="meta-label">Contacto principal</span>
                  <strong>{selectedReservation.reservation.full_name ?? 'Sin nombre'}</strong>
                  <p>{selectedReservation.reservation.phone ?? 'Sin teléfono'}</p>
                  <p>ID: {selectedReservation.reservation.identity_document ?? 'Sin documento'}</p>
                </article>
                <article className="admin-summary-card">
                  <span className="meta-label">Hospedaje</span>
                  <strong>{selectedReservation.reservation.room ?? 'Sin habitación'}</strong>
                  <p>{selectedReservation.reservation.number_of_nights ?? 0} noche(s)</p>
                  <p>
                    {formatAdminDate(selectedReservation.reservation.check_in_date)} al{' '}
                    {formatAdminDate(selectedReservation.reservation.check_out_date)}
                  </p>
                </article>
                <article className="admin-summary-card">
                  <span className="meta-label">Reserva</span>
                  <strong>{selectedReservation.confirmedPeople} persona(s) asisten</strong>
                  <p>Invitaciones dentro: {selectedReservation.linkedInvitations}</p>
                  <p>Habitación: {selectedReservation.reservation.room ?? 'Sin habitación'}</p>
                </article>
              </div>

              <div className="admin-attendees-card">
                <div className="flow-card-heading">
                  <span className="meta-label">Asisten</span>
                  <strong>{selectedAttendingGuests.length} persona(s) confirmadas</strong>
                </div>
                <div className="admin-attendees-grid">
                  {selectedAttendingGuests.map((guest) => (
                    <article className="admin-attendee-card" key={guest.id}>
                      <strong>
                        {guest.fullName || guest.name}
                        {guest.isPrimaryContact ? ' · contacto principal' : ''}
                      </strong>
                      <p>ID: {guest.identityDocument || 'Sin documento'}</p>
                      <p>Tel: {guest.phone || 'Sin teléfono'}</p>
                      <p>Correo: {guest.email || 'Sin correo'}</p>
                      <p>Alergias: {guest.hasAllergies ? guest.allergies || 'Sí, sin detalle' : 'No reporta'}</p>
                    </article>
                  ))}
                  {!selectedAttendingGuests.length ? (
                    <p className="availability-note">Esta reserva no tiene asistentes confirmados.</p>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <p className="availability-note">Selecciona una reserva para ver el detalle.</p>
          )}
        </section>
      </section>

      <section className="admin-attendees-card">
        <div className="flow-card-heading">
          <span className="meta-label">No asistiran</span>
          <strong>
            {declinedInvitations.reduce((total, reservation) => total + reservation.guests.length, 0)} persona(s) registradas
          </strong>
        </div>
        <div className="admin-attendees-grid">
          {declinedInvitations.map((reservation) => (
            <article className="admin-attendee-card" key={reservation.id}>
              <strong>{reservation.invitationLabel}</strong>
              <p>Codigo: {reservation.invitationCode}</p>
              <p>Guardada: {formatAdminDateTime(reservation.createdAt)}</p>
              <p>
                Personas: {reservation.guests.map((guest) => guest.fullName || guest.name).join(', ')}
              </p>
            </article>
          ))}
          {!declinedInvitations.length ? (
            <p className="availability-note">Aun no hay personas guardadas con no asistire.</p>
          ) : null}
        </div>
      </section>
    </main>
  )
}

function App() {
  if (isAdminRoute()) {
    return <AdminPanel />
  }

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(weddingDate))
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isSongModalOpen, setIsSongModalOpen] = useState(false)
  const [isDressCodeModalOpen, setIsDressCodeModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [activePortraitIndex, setActivePortraitIndex] = useState(0)
  const [visiblePortraits, setVisiblePortraits] = useState(() => (window.innerWidth <= 900 ? 1 : 3))
  const [activeInvitation] = useState<InvitationPreset>(() => getInvitationFromSearch())
  const [familyMembers, setFamilyMembers] = useState<InvitationMember[]>(() => createMembers(getInvitationFromSearch()))
  const [formData, setFormData] = useState<RsvpFormData>(() => buildInitialFormData())
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isEditingReservation, setIsEditingReservation] = useState(false)
  const [isReservationLoading, setIsReservationLoading] = useState(false)
  const [hasSavedReservation, setHasSavedReservation] = useState(false)
  const [savedReservationSnapshot, setSavedReservationSnapshot] = useState<SavedReservationSnapshot | null>(null)
  const [availabilityEntries, setAvailabilityEntries] = useState<AvailabilityEntry[]>([])
  const [existingGroups, setExistingGroups] = useState<ExistingGroupOption[]>([])
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState('')
  const [songSuggestionForm, setSongSuggestionForm] = useState<SongSuggestionFormData>(initialSongSuggestionFormData)
  const [songSuggestionFeedback, setSongSuggestionFeedback] = useState('')
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [hasUserMutedAudio, setHasUserMutedAudio] = useState(false)
  const [hasAudioStarted, setHasAudioStarted] = useState(false)
  const [isAutoplayPending, setIsAutoplayPending] = useState(false)
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)
  const [audioVolume, setAudioVolume] = useState(0.72)
  const [audioProgressSeconds, setAudioProgressSeconds] = useState(0)
  const [audioDurationSeconds, setAudioDurationSeconds] = useState(0)
  const [paymentPortalToast, setPaymentPortalToast] = useState('')

  const invitationType = getInvitationType(activeInvitation)
  const activeTrack = weddingSoundtrack[activeTrackIndex] ?? null
  const attendingMembers = familyMembers.filter((member) => member.attending)
  const attendingCount = attendingMembers.length
  const isDecliningInvitation = attendingCount === 0
  const isKnownInvitation = activeInvitation.code !== 'INV-DEFAULT'
  const isPaymentPortalEnabled = isKnownInvitation && hasSavedReservation && !isReservationLoading
  const principalContact = attendingMembers.find((member) => member.isPrimaryContact) ?? attendingMembers[0] ?? null
  const principalContactName = principalContact?.fullName.trim() || activeInvitation.members[0] || ''
  const minimumGroupCapacityOption = attendingCount < 6 ? attendingCount + 1 : 6
  const groupCapacityOptions = Array.from(
    { length: Math.max(1, 6 - minimumGroupCapacityOption + 1) },
    (_, index) => String(Math.min(minimumGroupCapacityOption + index, 6)),
  ).filter((value, index, array) => array.indexOf(value) === index)
  const estimatedGroupCapacity =
    formData.travelGroupMode === 'create' && Number(formData.sharedInvitationsEstimate) > 0
      ? Number(formData.sharedInvitationsEstimate)
      : attendingCount
  const requiredLodgingCapacity = formData.travelGroupMode === 'create' ? estimatedGroupCapacity : attendingCount
  const selectedExistingGroup =
    formData.travelGroupMode === 'join'
      ? existingGroups.find((group) => group.id === formData.groupName) ?? null
      : null
  const selectedRoomOption = lodgingOptions.find((option) => option.label === formData.room) ?? null
  const selectedNightCount = isNightCount(formData.numberOfNights) ? formData.numberOfNights : null
  const currentInvitationCodeForAvailability =
    savedReservationSnapshot?.invitationCode ?? (isKnownInvitation ? activeInvitation.code : null)
  const availableLodgingOptions = lodgingOptions.filter((option) => {
    const reservedCount = getAdjustedReservedRoomCount(
      option.label,
      availabilityEntries,
      formData.checkInDate,
      formData.checkOutDate,
      currentInvitationCodeForAvailability,
    )
    return option.capacity >= requiredLodgingCapacity && (reservedCount < option.totalRooms || option.label === formData.room)
  })
  const selectedPricePerPerson = getPriceForNightCount(selectedRoomOption, selectedNightCount)
  const selectedStayTotal = selectedPricePerPerson ? selectedPricePerPerson * requiredLodgingCapacity : null
  const selectedExistingGroupNightCount =
    selectedExistingGroup && isNightCount(selectedExistingGroup.numberOfNights)
      ? String(selectedExistingGroup.numberOfNights) as NightCount
      : null
  const summaryRoomLabel = formData.travelGroupMode === 'join' ? selectedExistingGroup?.room ?? '' : formData.room
  const summaryNightCount = formData.travelGroupMode === 'join' ? selectedExistingGroupNightCount : selectedNightCount
  const summaryRoomOption = lodgingOptions.find((option) => option.label === summaryRoomLabel) ?? null
  const summaryPeopleCount =
    formData.travelGroupMode === 'create'
      ? requiredLodgingCapacity
      : formData.travelGroupMode === 'join'
        ? selectedExistingGroup?.capacity ?? null
        : attendingCount > 0
          ? attendingCount
          : null
  const summaryPricePerPerson = getPriceForNightCount(summaryRoomOption, summaryNightCount)
  const summaryStayTotal = summaryPricePerPerson && summaryPeopleCount ? summaryPricePerPerson * summaryPeopleCount : null
  const paymentPlan = summaryStayTotal
    ? [
        { label: '30% hasta el 1 de Octubre de 2026', amount: summaryStayTotal * 0.3 },
        { label: '30% hasta el 22 de Diciembre de 2026', amount: summaryStayTotal * 0.3 },
        { label: '40% hasta el 1 de Abril de 2026', amount: summaryStayTotal * 0.4 },
      ]
    : []
  const paymentPlanPerPerson = summaryPricePerPerson
    ? [
        { label: '30% hasta el 1 de Octubre de 2026', amount: summaryPricePerPerson * 0.3 },
        { label: '30% hasta el 22 de Diciembre de 2026', amount: summaryPricePerPerson * 0.3 },
        { label: '40% hasta el 1 de Abril de 2026', amount: summaryPricePerPerson * 0.4 },
      ]
    : []
  const selectedRemainingRooms = selectedRoomOption
    ? selectedRoomOption.totalRooms -
      getAdjustedReservedRoomCount(
        selectedRoomOption.label,
        availabilityEntries,
        formData.checkInDate,
        formData.checkOutDate,
        currentInvitationCodeForAvailability,
      )
    : null
  const isSelectedExistingGroupFull =
    selectedExistingGroup !== null &&
    selectedExistingGroup.capacity > 0 &&
    selectedExistingGroup.reservedPeople >= selectedExistingGroup.capacity
  const maxPortraitIndex = Math.max(lovePortraits.length - visiblePortraits, 0)

  useEffect(() => {
    if (!paymentPortalToast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setPaymentPortalToast('')
    }, 2800)

    return () => window.clearTimeout(timeoutId)
  }, [paymentPortalToast])

  async function loadAvailabilityData() {
    if (!supabase) {
      setAvailabilityEntries([])
      setExistingGroups([])
      return
    }

    const supabaseClient = supabase

    setIsAvailabilityLoading(true)
    setAvailabilityError('')

    const { data, error } = await supabaseClient.rpc('get_wedding_availability')

    if (error) {
      setAvailabilityError('No pudimos validar la disponibilidad en tiempo real. Intenta de nuevo.')
      setAvailabilityEntries([])
      setExistingGroups([])
      setIsAvailabilityLoading(false)
      return
    }

    const nextAvailabilityEntries: AvailabilityEntry[] = []
    const nextExistingGroups = new Map<string, ExistingGroupOption>()

    for (const row of data ?? []) {
      const roomLabel = typeof row.room === 'string' ? row.room.trim() : ''
      const groupId = typeof row.group_id === 'string' ? row.group_id.trim() : ''
      const groupLabel = typeof row.group_label === 'string' ? row.group_label.trim() : ''
      const groupLeaderName = typeof row.group_leader_name === 'string' ? row.group_leader_name.trim() : ''
      const travelGroupMode = typeof row.travel_group_mode === 'string' ? row.travel_group_mode.trim() : ''
      const groupCapacity =
        typeof row.group_capacity === 'number' && Number.isFinite(row.group_capacity) ? row.group_capacity : 0
      const rowPeopleCount =
        typeof row.number_of_people === 'number' && Number.isFinite(row.number_of_people) ? row.number_of_people : 0

      if (
        countsAsRoomReservation(travelGroupMode as TravelGroupMode | null, roomLabel) &&
        typeof row.check_in_date === 'string' &&
        row.check_in_date.trim() &&
        typeof row.check_out_date === 'string' &&
        row.check_out_date.trim()
      ) {
        nextAvailabilityEntries.push({
          invitationCode:
            typeof row.invitation_code === 'string' && row.invitation_code.trim() ? row.invitation_code.trim() : null,
          room: roomLabel,
          checkInDate: row.check_in_date,
          checkOutDate: row.check_out_date,
          travelGroupMode: travelGroupMode as TravelGroupMode | null,
        })
      }

      if (travelGroupMode === 'create' && groupId && groupLabel) {
        const currentGroup = nextExistingGroups.get(groupId)

        nextExistingGroups.set(groupId, {
          id: groupId,
          label: groupLabel,
          leaderName: groupLeaderName || currentGroup?.leaderName || 'Pendiente',
          capacity: groupCapacity || currentGroup?.capacity || 0,
          reservedPeople: currentGroup?.reservedPeople ?? rowPeopleCount,
          room: roomLabel || currentGroup?.room || '',
          numberOfNights:
            typeof row.number_of_nights === 'number' && Number.isFinite(row.number_of_nights)
              ? row.number_of_nights
              : currentGroup?.numberOfNights ?? 0,
          checkInDate:
            typeof row.check_in_date === 'string' && row.check_in_date.trim()
              ? row.check_in_date
              : currentGroup?.checkInDate ?? '',
          checkOutDate:
            typeof row.check_out_date === 'string' && row.check_out_date.trim()
              ? row.check_out_date
              : currentGroup?.checkOutDate ?? '',
          arrivalTime:
            typeof row.arrival_time === 'string' && row.arrival_time.trim()
              ? row.arrival_time
              : currentGroup?.arrivalTime ?? '',
          departureTime:
            typeof row.departure_time === 'string' && row.departure_time.trim()
              ? row.departure_time
              : currentGroup?.departureTime ?? '',
          boardingPoint:
            typeof row.boarding_point === 'string' && row.boarding_point.trim()
              ? row.boarding_point
              : currentGroup?.boardingPoint ?? '',
        })
        continue
      }

      if (travelGroupMode === 'join' && groupId && rowPeopleCount > 0) {
        const currentGroup = nextExistingGroups.get(groupId)

        if (currentGroup) {
          nextExistingGroups.set(groupId, {
            ...currentGroup,
            reservedPeople: currentGroup.reservedPeople + rowPeopleCount,
          })
        }
      }
    }

    const nextGroups = Array.from(nextExistingGroups.values())

    setAvailabilityEntries(nextAvailabilityEntries)
    setExistingGroups(nextGroups)
    writeStoredGroups(nextGroups)
    setIsAvailabilityLoading(false)
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdown(weddingDate))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const portraitIntervalId = window.setInterval(() => {
      setActivePortraitIndex((currentIndex) => (currentIndex >= maxPortraitIndex ? 0 : currentIndex + 1))
    }, 4800)

    return () => window.clearInterval(portraitIntervalId)
  }, [maxPortraitIndex])

  useEffect(() => {
    function handleResize() {
      setVisiblePortraits(window.innerWidth <= 900 ? 1 : 3)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setActivePortraitIndex((currentIndex) => Math.min(currentIndex, maxPortraitIndex))
  }, [maxPortraitIndex])

  useEffect(() => {
    document.body.classList.toggle(
      'modal-open',
      isRsvpOpen || isInfoOpen || isSongModalOpen || isDressCodeModalOpen || isPaymentModalOpen,
    )

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isDressCodeModalOpen, isInfoOpen, isPaymentModalOpen, isRsvpOpen, isSongModalOpen])

  useEffect(() => {
    if (attendingCount > 0) {
      return
    }

    setFormData((current) => ({
      ...current,
      travelGroupMode: 'individual',
      groupName: '',
      groupLeaderName: '',
      sharedInvitationsEstimate: '',
      room: '',
      numberOfNights: '',
      checkInDate: '',
      checkOutDate: '',
      arrivalTime: '',
      departureTime: '',
      boardingPoint: '',
      allergies: '',
      notes: '',
    }))
  }, [attendingCount])

  useEffect(() => {
    if (attendingMembers.length === 0) {
      return
    }

    const hasPrimaryContact = attendingMembers.some((member) => member.isPrimaryContact)

    if (hasPrimaryContact) {
      return
    }

    const fallbackPrimaryId = attendingMembers[0]?.id

    if (!fallbackPrimaryId) {
      return
    }

    setFamilyMembers((current) =>
      current.map((member) => ({
        ...member,
        isPrimaryContact: member.id === fallbackPrimaryId,
      })),
    )
  }, [attendingMembers])

  useEffect(() => {
    if (!isRsvpOpen || !supabase) {
      if (!supabase) {
        setAvailabilityEntries([])
      }
      return
    }

    void loadAvailabilityData()
  }, [isRsvpOpen])

  useEffect(() => {
    if (!isKnownInvitation || !supabase) {
      setHasSavedReservation(false)
      return
    }

    let isCancelled = false
    const supabaseClient = supabase

    async function checkSavedReservation() {
      const { data, error } = await supabaseClient.rpc('get_wedding_rsvp_by_invitation', {
        invitation_code_param: activeInvitation.code,
      })

      if (isCancelled) {
        return
      }

      if (error) {
        setHasSavedReservation(false)
        return
      }

      const savedReservation = (Array.isArray(data) ? data[0] : data) as SavedRsvpRecord | null
      setHasSavedReservation(Boolean(savedReservation))
    }

    void checkSavedReservation()

    return () => {
      isCancelled = true
    }
  }, [activeInvitation.code, isKnownInvitation, supabase])

  useEffect(() => {
    if (!audioRef.current || !activeTrack) {
      return
    }

    const audioElement = audioRef.current
    let isCancelled = false

    async function attemptPlayback(withSound: boolean) {
      audioElement.volume = audioVolume
      audioElement.loop = false
      audioElement.autoplay = true
      audioElement.muted = withSound ? false : isAudioMuted || hasUserMutedAudio

      try {
        await audioElement.play()

        if (!isCancelled) {
          setHasAudioStarted(true)
          setIsAutoplayPending(false)

          if (withSound) {
            setIsAudioMuted(false)
            setHasUserMutedAudio(false)
          }
        }
      } catch {
        if (!isCancelled) {
          setHasAudioStarted(false)
          setIsAutoplayPending(true)
        }
      }
    }

    function handleFirstInteraction() {
      if (hasUserMutedAudio) {
        if (audioElement.paused) {
          void attemptPlayback(false)
        }
        return
      }

      if (!audioElement.paused && !audioElement.muted) {
        setIsAutoplayPending(false)
        return
      }

      void attemptPlayback(true)
    }

    void attemptPlayback(false)

    document.addEventListener('touchstart', handleFirstInteraction, true)
    document.addEventListener('pointerdown', handleFirstInteraction, true)
    document.addEventListener('click', handleFirstInteraction, true)
    document.addEventListener('keydown', handleFirstInteraction, true)

    return () => {
      isCancelled = true
      document.removeEventListener('touchstart', handleFirstInteraction, true)
      document.removeEventListener('pointerdown', handleFirstInteraction, true)
      document.removeEventListener('click', handleFirstInteraction, true)
      document.removeEventListener('keydown', handleFirstInteraction, true)
    }
  }, [activeTrackIndex, activeTrack, audioVolume, hasUserMutedAudio, isAudioMuted])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.muted = isAudioMuted
  }, [isAudioMuted])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.volume = audioVolume
  }, [audioVolume])

  useEffect(() => {
    if (!isRsvpOpen || !isKnownInvitation || !supabase) {
      if (!supabase || !isKnownInvitation) {
        setIsReservationLoading(false)
      }
      return
    }

    let isCancelled = false
    const supabaseClient = supabase

    async function loadExistingReservation() {
      setIsReservationLoading(true)

      const { data, error } = await supabaseClient.rpc('get_wedding_rsvp_by_invitation', {
        invitation_code_param: activeInvitation.code,
      })

      if (isCancelled) {
        return
      }

      if (error) {
        setFamilyMembers(createMembers(activeInvitation))
        setFormData(buildInitialFormData())
        setSavedReservationSnapshot(null)
        setIsEditingReservation(false)
        setHasSavedReservation(false)
        setIsReservationLoading(false)
        return
      }

      const savedReservation = (Array.isArray(data) ? data[0] : data) as SavedRsvpRecord | null

      if (!savedReservation) {
        setFamilyMembers(createMembers(activeInvitation))
        setFormData(buildInitialFormData())
        setSavedReservationSnapshot(null)
        setIsEditingReservation(false)
        setHasSavedReservation(false)
        setIsReservationLoading(false)
        return
      }

      const storedAttendeesFromDb = resolveStoredAttendees(savedReservation.attendees_json, {
        reservationId: savedReservation.invitation_code,
        fullName: savedReservation.full_name,
        identityDocument: savedReservation.identity_document,
        phone: savedReservation.phone,
        allergies: savedReservation.allergies,
      })
      const storedAttendees = storedAttendeesFromDb
      const nextMembers = createMembers(activeInvitation).map((member, index) => {
        const isBabyMember = isBabyGuest(activeInvitation.code, member.name)
        const storedMember =
          storedAttendees.find((candidate) => candidate.id === member.id) ??
          storedAttendees.find((candidate) => candidate.name.trim().toLowerCase() === member.name.trim().toLowerCase())

        if (!storedMember) {
          return member
        }

        return {
          ...member,
          attending: storedMember.attending,
          fullName: storedMember.fullName || member.fullName,
          identityDocument: storedMember.identityDocument || (isBabyMember ? BABY_NOT_APPLICABLE_VALUE : ''),
          phone: storedMember.phone || (isBabyMember ? BABY_NOT_APPLICABLE_VALUE : ''),
          email: storedMember.email || (isBabyMember ? BABY_NOT_APPLICABLE_VALUE : ''),
          hasAllergies: storedMember.hasAllergies,
          allergies: storedMember.allergies || '',
          isPrimaryContact:
            storedMember.isPrimaryContact ||
            (!storedAttendees.some((candidate) => candidate.isPrimaryContact) && index === 0),
        }
      })

      const hasPrimaryContact = nextMembers.some((member) => member.attending && member.isPrimaryContact)

      const normalizedMembers = hasPrimaryContact
        ? nextMembers
        : nextMembers.map((member, index) => ({
            ...member,
            isPrimaryContact: member.attending ? index === nextMembers.findIndex((candidate) => candidate.attending) : false,
          }))

      setFamilyMembers(normalizedMembers)
      setSavedReservationSnapshot({
        invitationCode: savedReservation.invitation_code,
        room: savedReservation.room?.trim() || null,
        travelGroupMode: savedReservation.travel_group_mode,
      })
      const nextFormData = {
        ...buildInitialFormData(),
        fullName: savedReservation.full_name?.trim() || '',
        identityDocument: savedReservation.identity_document?.trim() || '',
        phone: savedReservation.phone?.trim() || '',
        travelGroupMode: savedReservation.travel_group_mode || 'individual',
        groupName:
          savedReservation.travel_group_mode === 'create'
            ? savedReservation.group_label?.trim() || ''
            : savedReservation.travel_group_mode === 'join'
              ? savedReservation.group_id?.trim() || ''
              : '',
        groupLeaderName: savedReservation.group_leader_name?.trim() || '',
        sharedInvitationsEstimate:
          savedReservation.group_capacity != null
            ? String(savedReservation.group_capacity)
            : '',
        room: savedReservation.room?.trim() || '',
        numberOfNights:
          savedReservation.number_of_nights != null
            ? String(savedReservation.number_of_nights)
            : '',
        checkInDate: savedReservation.check_in_date || '',
        checkOutDate: savedReservation.check_out_date || '',
        arrivalTime: savedReservation.arrival_time || '',
        departureTime: savedReservation.departure_time || '',
        boardingPoint: savedReservation.boarding_point?.trim() || '',
        allergies: savedReservation.allergies?.trim() || '',
        notes: savedReservation.notes?.trim() || '',
      }

      setFormData(nextFormData)
      setIsEditingReservation(true)
      setHasSavedReservation(true)
      setIsReservationLoading(false)
    }

    loadExistingReservation()

    return () => {
      isCancelled = true
    }
  }, [activeInvitation, isKnownInvitation, isRsvpOpen, supabase])

  useEffect(() => {
    if (!formData.room) {
      return
    }

    const roomStillAvailable = availableLodgingOptions.some((option) => option.label === formData.room)

    if (roomStillAvailable) {
      return
    }

    setFormData((current) => ({
      ...current,
      room: '',
    }))
  }, [availableLodgingOptions, formData.room])

  function openRsvpModal() {
    setFamilyMembers(createMembers(activeInvitation))
    setFormData(buildInitialFormData())
    setSavedReservationSnapshot(null)
    setIsEditingReservation(false)
    setIsReservationLoading(Boolean(supabase) && isKnownInvitation)
    setIsRsvpOpen(true)
    setSubmitState('idle')
    setFeedbackMessage('')
  }

  function closeRsvpModal() {
    setIsRsvpOpen(false)
  }

  function openInfoModal() {
    setIsInfoOpen(true)
  }

  function closeInfoModal() {
    setIsInfoOpen(false)
  }

  function openSongModal() {
    setIsSongModalOpen(true)
    setSongSuggestionFeedback('')
  }

  function closeSongModal() {
    setIsSongModalOpen(false)
  }

  function openDressCodeModal() {
    setIsDressCodeModalOpen(true)
  }

  function closeDressCodeModal() {
    setIsDressCodeModalOpen(false)
  }

  function openPaymentModal() {
    if (!isPaymentPortalEnabled) {
      setPaymentPortalToast('Esta información estará disponible cuando confirmes la asistencia')
      return
    }

    setIsPaymentModalOpen(true)
  }

  function closePaymentModal() {
    setIsPaymentModalOpen(false)
  }

  function showPreviousPortrait() {
    setActivePortraitIndex((currentIndex) => (currentIndex <= 0 ? maxPortraitIndex : currentIndex - 1))
  }

  function showNextPortrait() {
    setActivePortraitIndex((currentIndex) => (currentIndex >= maxPortraitIndex ? 0 : currentIndex + 1))
  }

  function handleSongSuggestionInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target

    setSongSuggestionForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSongSuggestionSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!supabase) {
      setSongSuggestionFeedback('No se pudo guardar la canción. Revisa la configuración de Supabase.')
      return
    }

    const payload = {
      invitation_code: isKnownInvitation ? activeInvitation.code : null,
      invitation_label: isKnownInvitation ? activeInvitation.label : null,
      guest_name: songSuggestionForm.guestName.trim(),
      song_name: songSuggestionForm.songName.trim(),
      artist_name: songSuggestionForm.artistName.trim(),
      song_link: songSuggestionForm.songLink.trim() || null,
    }

    const { error } = await supabase.from('song_suggestions').insert(payload)

    if (error) {
      setSongSuggestionFeedback(`No se pudo guardar la canción. ${error.message}`)
      return
    }

    setSongSuggestionFeedback('Canción sugerida con éxito.')
    setSongSuggestionForm(initialSongSuggestionFormData)
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target

    setFormData((current) => {
      const next = {
        ...current,
        [name]: value,
      }

      if (name === 'travelGroupMode') {
        if (value === 'individual') {
          next.groupName = ''
          next.groupLeaderName = ''
          next.sharedInvitationsEstimate = ''
          next.room = ''
          next.numberOfNights = ''
        }

        if (value === 'join') {
          next.sharedInvitationsEstimate = ''
          next.room = ''
          next.numberOfNights = ''
          next.groupLeaderName = ''
        }

        if (value === 'create') {
          next.groupName = ''
          next.groupLeaderName = ''
        }
      }

      if (name === 'groupName' && current.travelGroupMode === 'join') {
        const selectedGroup = existingGroups.find((group) => group.id === value)

        if (selectedGroup) {
          next.groupLeaderName = selectedGroup.leaderName
        }
      }

      return next
    })
  }

  function handleMemberAttendanceChange(memberId: string) {
    setFamilyMembers((current) =>
      current.map((member) =>
        member.id === memberId ? { ...member, attending: !member.attending } : member,
      ),
    )
  }

  function handleMemberFieldChange(
    memberId: string,
    field: 'fullName' | 'identityDocument' | 'phone' | 'email' | 'allergies',
    value: string,
  ) {
    setFamilyMembers((current) =>
      current.map((member) => (member.id === memberId ? { ...member, [field]: value } : member)),
    )
  }

  function handleMemberAllergyToggle(memberId: string) {
    setFamilyMembers((current) =>
      current.map((member) =>
        member.id === memberId
          ? {
              ...member,
              hasAllergies: !member.hasAllergies,
              allergies: member.hasAllergies ? '' : member.allergies,
            }
          : member,
      ),
    )
  }

  function handlePrimaryContactChange(memberId: string) {
    setFamilyMembers((current) =>
      current.map((member) => ({
        ...member,
        isPrimaryContact: member.id === memberId,
      })),
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const wasEditingReservation = isEditingReservation

    if (attendingCount > 0 && !principalContact) {
      setSubmitState('error')
      setFeedbackMessage('Selecciona un contacto principal entre las personas que asistirán.')
      return
    }

    const incompleteAttendee = attendingMembers.find(
      (member) =>
        !member.fullName.trim() ||
        (!isBabyGuest(activeInvitation.code, member.name) && !member.identityDocument.trim()) ||
        (!isBabyGuest(activeInvitation.code, member.name) && !member.phone.trim()) ||
        (member.hasAllergies && !member.allergies.trim()),
    )

    if (incompleteAttendee) {
      setSubmitState('error')
      setFeedbackMessage(
        `Completa los campos obligatorios de ${incompleteAttendee.name}: nombre completo, ID, teléfono${incompleteAttendee.hasAllergies ? ' y detalle de alergias' : ''}.`,
      )
      return
    }

    if (!supabase) {
      setSubmitState('error')
      setFeedbackMessage(
        'Falta conectar Supabase. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para guardar respuestas.',
      )
      return
    }

    if (formData.travelGroupMode === 'join' && !selectedExistingGroup) {
      setSubmitState('error')
      setFeedbackMessage('Selecciona uno de los grupos creados previamente para unirte.')
      return
    }

    if (formData.travelGroupMode === 'join' && isSelectedExistingGroupFull) {
      setSubmitState('error')
      setFeedbackMessage('Ese grupo ya completó su cupo y no admite más personas.')
      return
    }

    const requiresOwnLodgingDetails = formData.travelGroupMode !== 'join' && !isDecliningInvitation
    const selectedGroupLodgingDetails =
      formData.travelGroupMode === 'join' && !isDecliningInvitation ? selectedExistingGroup : null

    if (
      !isDecliningInvitation &&
      formData.travelGroupMode === 'join' &&
      (!selectedGroupLodgingDetails?.room ||
        !selectedGroupLodgingDetails.numberOfNights ||
        !selectedGroupLodgingDetails.checkInDate ||
        !selectedGroupLodgingDetails.checkOutDate)
    ) {
      setSubmitState('error')
      setFeedbackMessage(
        'Ese grupo no tiene completos los datos de hospedaje compartido. Primero guarda correctamente la invitación que crea el grupo.',
      )
      return
    }

    if (
      requiresOwnLodgingDetails &&
      (!selectedRoomOption || !selectedNightCount || !selectedPricePerPerson || !selectedStayTotal)
    ) {
      setSubmitState('error')
      setFeedbackMessage('Selecciona una habitación disponible y el número de noches antes de guardar.')
      return
    }

    if (
      requiresOwnLodgingDetails &&
      selectedRoomOption &&
      selectedRoomOption.capacity < requiredLodgingCapacity
    ) {
      setSubmitState('error')
      setFeedbackMessage('La habitación elegida no alcanza para la capacidad requerida de este grupo.')
      return
    }

    if (requiresOwnLodgingDetails && selectedNightCount) {
      const selectedNightDifference = getNightDifference(formData.checkInDate, formData.checkOutDate)

      if (selectedNightDifference === null || selectedNightDifference !== Number(selectedNightCount)) {
        setSubmitState('error')
        setFeedbackMessage(
          `La fecha de ingreso y la fecha de salida deben coincidir con ${selectedNightCount} noche(s).`,
        )
        return
      }
    }

    if (requiresOwnLodgingDetails && selectedRemainingRooms !== null && selectedRemainingRooms <= 0) {
      setSubmitState('error')
      setFeedbackMessage('La habitación elegida ya no tiene disponibilidad. Elige otra opción.')
      return
    }

    setSubmitState('submitting')
    setFeedbackMessage('')

    const membersSummary = familyMembers
      .map((member) => `${member.name}: ${member.attending ? 'Asiste' : 'No asiste'}`)
      .join(' | ')
    const attendingMembersDetails = attendingMembers
      .map(
        (member) =>
          `${member.fullName.trim()}${member.isPrimaryContact ? ' (contacto principal)' : ''} | ID: ${member.identityDocument.trim()} | Tel: ${member.phone.trim()} | Correo: ${member.email.trim() || 'No registra'} | Alergias: ${member.hasAllergies ? member.allergies.trim() : 'No reporta'}`,
      )
      .join(' || ')
    const nonAttendingMembers = familyMembers.filter((member) => !member.attending)
    const nonAttendingMembersDetails = nonAttendingMembers
      .map((member) => member.fullName.trim() || member.name.trim())
      .filter(Boolean)
      .join(' | ')
    const fallbackContact = familyMembers[0] ?? null
    const savedContactName =
      principalContact?.fullName.trim() ||
      fallbackContact?.fullName.trim() ||
      fallbackContact?.name.trim() ||
      activeInvitation.members[0] ||
      activeInvitation.label
    const savedIdentityDocument = principalContact?.identityDocument.trim() || null
    const savedPhone = principalContact?.phone.trim() || null

    const payload = {
      full_name: savedContactName,
      identity_document: savedIdentityDocument,
      phone: savedPhone,
      description:
        [
          `Código de invitación: ${activeInvitation.code}`,
          `Invitación visible: ${activeInvitation.label}`,
          `Tipo de invitación: ${invitationType === 'family' ? 'Familiar' : 'Individual'}`,
          `Miembros: ${membersSummary}`,
          attendingMembersDetails ? `Datos asistentes: ${attendingMembersDetails}` : 'Datos asistentes: nadie asistirá',
          nonAttendingMembersDetails ? `No podrán asistir: ${nonAttendingMembersDetails}` : '',
          isDecliningInvitation ? 'Estado: esta invitación confirmó que no asistirá' : '',
          `Modo de hospedaje: ${travelGroupOptions.find((option) => option.value === formData.travelGroupMode)?.title ?? 'Sin definir'}`,
          buildGroupSummary(formData, activeInvitation.code, principalContactName, selectedExistingGroup),
          requiresOwnLodgingDetails && selectedRoomOption ? `Habitación seleccionada: ${selectedRoomOption.label}` : '',
          requiresOwnLodgingDetails && selectedNightCount ? `Noches: ${selectedNightCount}` : '',
          requiresOwnLodgingDetails && selectedPricePerPerson
            ? `Tarifa por persona: ${formatCurrency(selectedPricePerPerson)}`
            : '',
          requiresOwnLodgingDetails && selectedStayTotal ? `Total estimado: ${formatCurrency(selectedStayTotal)}` : '',
          formData.description.trim(),
        ]
          .filter(Boolean)
          .join(' | ') || null,
      room: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? formData.room.trim() || null
          : selectedGroupLodgingDetails?.room || null,
      number_of_people: attendingCount,
      invitation_code: activeInvitation.code,
      invitation_label: activeInvitation.label,
      travel_group_mode: formData.travelGroupMode,
      group_id:
        formData.travelGroupMode === 'create'
          ? generateGroupCode(activeInvitation.code, formData.groupName)
          : formData.travelGroupMode === 'join'
            ? formData.groupName
            : null,
      group_label:
        formData.travelGroupMode === 'create'
          ? formData.groupName.trim()
          : formData.travelGroupMode === 'join'
            ? selectedExistingGroup?.label ?? null
            : null,
      group_leader_name:
        formData.travelGroupMode === 'create'
          ? formData.groupLeaderName.trim() || principalContactName
          : formData.travelGroupMode === 'join'
            ? selectedExistingGroup?.leaderName ?? null
            : null,
      group_capacity: formData.travelGroupMode === 'create' ? Number(formData.sharedInvitationsEstimate) || null : null,
      number_of_nights: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? Number(formData.numberOfNights)
          : selectedGroupLodgingDetails?.numberOfNights ?? null,
      check_in_date: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? formData.checkInDate
          : selectedGroupLodgingDetails?.checkInDate ?? null,
      check_out_date: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? formData.checkOutDate
          : selectedGroupLodgingDetails?.checkOutDate ?? null,
      arrival_time: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? formData.arrivalTime || null
          : selectedGroupLodgingDetails?.arrivalTime || null,
      departure_time: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? formData.departureTime || null
          : selectedGroupLodgingDetails?.departureTime || null,
      boarding_point: isDecliningInvitation
        ? null
        : requiresOwnLodgingDetails
          ? formData.boardingPoint.trim() || null
          : selectedGroupLodgingDetails?.boardingPoint || null,
      attendees_json: familyMembers.map((member) => ({
        id: member.id,
        name: member.name,
        attending: member.attending,
        fullName: member.fullName.trim() || member.name.trim(),
        identityDocument: getBabySafeFieldValue(activeInvitation.code, member.name, member.identityDocument),
        phone: getBabySafeFieldValue(activeInvitation.code, member.name, member.phone),
        email: getBabySafeFieldValue(activeInvitation.code, member.name, member.email),
        hasAllergies: member.hasAllergies,
        allergies: member.hasAllergies ? member.allergies.trim() : '',
        isPrimaryContact: member.attending ? member.isPrimaryContact : false,
      })),
      allergies:
        attendingMembers
          .map((member) => `${member.fullName.trim()}: ${member.hasAllergies ? member.allergies.trim() : 'No reporta'}`)
          .join(' | ') || null,
      notes:
        [
          formData.notes.trim(),
          formData.travelGroupMode === 'create' && formData.sharedInvitationsEstimate
            ? `Personas dentro del grupo: ${formData.sharedInvitationsEstimate}`
            : '',
          `Asisten: ${attendingCount}`,
          `No asisten: ${nonAttendingMembers.length}`,
        ]
          .filter(Boolean)
          .join(' | ') || null,
    }

    const { error } = await supabase.rpc('upsert_wedding_rsvp', {
      rsvp_payload: payload,
    })

    if (error) {
      setSubmitState('error')
      setFeedbackMessage(`No se pudo guardar la información. ${error.message}`)
      return
    }

    await loadAvailabilityData()

    if (formData.travelGroupMode === 'create') {
      const createdGroup: ExistingGroupOption = {
        id: generateGroupCode(activeInvitation.code, formData.groupName),
        label: formData.groupName.trim(),
        leaderName: formData.groupLeaderName.trim() || principalContactName,
        capacity: Number(formData.sharedInvitationsEstimate) || 0,
        reservedPeople: attendingCount,
        room: formData.room.trim(),
        numberOfNights: Number(formData.numberOfNights),
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        arrivalTime: formData.arrivalTime,
        departureTime: formData.departureTime,
        boardingPoint: formData.boardingPoint.trim(),
      }

      const mergedStoredGroups = new Map<string, ExistingGroupOption>()

      for (const group of readStoredGroups()) {
        mergedStoredGroups.set(group.id, group)
      }

      mergedStoredGroups.set(createdGroup.id, createdGroup)

      const nextStoredGroups = Array.from(mergedStoredGroups.values())
      writeStoredGroups(nextStoredGroups)
      setExistingGroups(nextStoredGroups)
    }

    setSavedReservationSnapshot({
      invitationCode: activeInvitation.code,
      room: payload.room,
      travelGroupMode: payload.travel_group_mode,
    })
    setIsEditingReservation(true)
    setHasSavedReservation(true)
    setSubmitState('success')
    setFeedbackMessage(
      wasEditingReservation
        ? 'Los cambios de esta invitación fueron actualizados con éxito.'
        : 'La confirmación de esta invitación fue registrada con éxito. Desde ahora puedes editarla aquí mismo.',
    )
  }

  async function handleToggleAudioMute() {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused || isAutoplayPending) {
      if (isAudioMuted) {
        setHasUserMutedAudio(false)
      }

      try {
        audio.muted = isAudioMuted ? false : true
        await audio.play()
        setHasAudioStarted(true)
        setIsAutoplayPending(false)

        if (isAudioMuted) {
          setIsAudioMuted(false)
          setHasUserMutedAudio(false)
        } else {
          setIsAudioMuted(true)
          setHasUserMutedAudio(true)
        }

        return
      } catch {
        setHasAudioStarted(false)
      }
    }

    const nextMuted = !isAudioMuted
    audio.muted = nextMuted
    setIsAudioMuted(nextMuted)
    setHasUserMutedAudio(nextMuted)
  }

  function handleAudioProgressChange(event: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setAudioProgressSeconds(nextTime)
  }

  function handleAudioVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextVolume = Math.min(Math.max(Number(event.target.value), 0), 1)
    setAudioVolume(nextVolume)
    setIsAudioMuted(nextVolume === 0)
  }

  function playNextTrack() {
    setAudioProgressSeconds(0)
    setAudioDurationSeconds(0)
    setActiveTrackIndex((currentIndex) => (currentIndex + 1) % weddingSoundtrack.length)
  }

  function playPreviousTrack() {
    setAudioProgressSeconds(0)
    setAudioDurationSeconds(0)
    setActiveTrackIndex((currentIndex) => (currentIndex - 1 + weddingSoundtrack.length) % weddingSoundtrack.length)
  }

  return (
    <>
      <main className="invitation-shell">
        {paymentPortalToast ? (
          <div className="payment-portal-toast" role="status" aria-live="polite">
            {paymentPortalToast}
          </div>
        ) : null}
        <section className="hero-section">
          <div className="hero-media">
            <img alt="Laura y Juan abrazados junto al lago" className="hero-image" src={portadaLauraJuan} />
            {activeTrack ? (
              <div className={`music-player music-player--hero ${isPlayerExpanded ? 'is-expanded' : ''}`} aria-label="Reproductor musical de la invitación">
                <audio
                  ref={audioRef}
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  src={activeTrack.src}
                  onLoadedMetadata={(event) => {
                    setAudioDurationSeconds(event.currentTarget.duration || 0)
                    setAudioProgressSeconds(event.currentTarget.currentTime || 0)
                  }}
                  onPause={() => setHasAudioStarted(false)}
                  onPlay={() => setHasAudioStarted(true)}
                  onTimeUpdate={(event) => setAudioProgressSeconds(event.currentTarget.currentTime || 0)}
                  onEnded={playNextTrack}
                />
                <button
                  aria-label={isAudioMuted ? 'Activar sonido' : 'Silenciar música'}
                  className={`music-player-toggle ${isAudioMuted ? 'is-muted' : ''}`}
                  onClick={handleToggleAudioMute}
                  title={isAudioMuted ? 'Activar sonido' : 'Silenciar música'}
                  type="button"
                >
                  <span className="music-player-speaker" aria-hidden="true">
                    {isAudioMuted ? '🔇' : '🔊'}
                  </span>
                </button>
                <button
                  aria-expanded={isPlayerExpanded}
                  aria-label={isPlayerExpanded ? 'Ocultar controles de música' : 'Ver controles de música'}
                  className="music-player-main"
                  onClick={() => setIsPlayerExpanded((current) => !current)}
                  type="button"
                >
                  <div className="music-player-nav" aria-hidden="true">
                    <span>‹</span>
                    <span>›</span>
                  </div>
                  <div className="music-player-copy">
                    <strong>{activeTrack.title}</strong>
                    <span>
                      {activeTrack.artist}
                      {hasAudioStarted ? '' : isAutoplayPending ? ' · autoplay pendiente' : ''}
                    </span>
                  </div>
                  <div className="music-player-progress music-player-progress--inline">
                    <input
                      aria-label="Progreso de la canción"
                      className="music-player-progress-bar"
                      max={audioDurationSeconds || 0}
                      min={0}
                      onChange={handleAudioProgressChange}
                      step={1}
                      type="range"
                      value={Math.min(audioProgressSeconds, audioDurationSeconds || 0)}
                    />
                  </div>
                  <span className="music-player-caret" aria-hidden="true">{isPlayerExpanded ? '−' : '+'}</span>
                </button>
                {isPlayerExpanded ? (
                  <div className="music-player-panel">
                    <div className="music-player-track-actions">
                      <button
                        aria-label="Canción anterior"
                        className="music-player-track-button"
                        onClick={playPreviousTrack}
                        type="button"
                      >
                        ‹
                      </button>
                      <button
                        aria-label="Siguiente canción"
                        className="music-player-track-button"
                        onClick={playNextTrack}
                        type="button"
                      >
                        ›
                      </button>
                    </div>
                    <div className="music-player-times">
                      <span>{formatTrackTime(audioProgressSeconds)}</span>
                      <span>{formatTrackTime(audioDurationSeconds)}</span>
                    </div>
                    <div className="music-player-volume">
                      <span className="music-player-volume-label" aria-hidden="true">Vol</span>
                      <input
                        aria-label="Nivel de volumen"
                        className="music-player-volume-slider"
                        max={1}
                        min={0}
                        onChange={handleAudioVolumeChange}
                        step={0.01}
                        type="range"
                        value={isAudioMuted ? 0 : audioVolume}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="hero-content">
            <img
              alt=""
              aria-hidden="true"
              className="hero-sea-accent"
              src={marinoPerlasEstrellas}
            />
            <img
              alt=""
              aria-hidden="true"
              className="hero-tree-watercolor"
              src={sicomoroAcuarela}
            />
            <p className="hero-kicker">¡Nos casamos!</p>
            <span className="ornament" aria-hidden="true"></span>
            <div className="sycamore-sprig" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h1>Laura & Juan</h1>
            <p className="hero-name-emojis">💚💙</p>
            <p className="hero-quote">
              Después de recorrer muchos caminos juntos, con mucha alegría te invitamos a celebrar el inicio de nuestra nueva aventura.
            </p>
            <div className="hero-meta">
              <div>
                <span className="meta-label">Fecha</span>
                <strong>29 de Mayo de 2027</strong>
              </div>
              <div>
                <span className="meta-label">Hora</span>
                <strong>4:30 PM</strong>
              </div>
              <div>
                <span className="meta-label">Lugar</span>
                <strong>Hotel Isla Múcura</strong>
                <span className="meta-support-copy">Frente al mar en el jardín del hotel</span>
              </div>
            </div>
          </div>
        </section>

        <section className="invitees-section">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--invitees"
            src={marinoConchasPlaya}
          />
          <p className="invitees-label">{activeInvitation.members.length === 1 ? 'Querido/a:' : 'Queridos:'}</p>
          <h2 className="invitees-title">
            {isKnownInvitation ? activeInvitation.label : 'Tu invitación personalizada'}
          </h2>
          <div className="sycamore-sprig sycamore-sprig--centered" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <div className="beach-divider beach-divider--center" aria-hidden="true">
          <span className="beach-divider-line"></span>
          <span className="beach-divider-shell"></span>
          <span className="beach-divider-foam beach-divider-foam--left"></span>
          <span className="beach-divider-foam beach-divider-foam--right"></span>
        </div>

        <section className="countdown-section" aria-label="Cuenta regresiva para la boda">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--countdown"
            src={marinoPerlasEstrellas}
          />
          <h2 className="countdown-title title-with-sea-charm title-with-sea-charm--shell-right">
            Cuenta regresiva para el gran día
            <span aria-hidden="true" className="sea-charm sea-charm--shell"></span>
          </h2>
          <p className="countdown-date">29 de Mayo de 2027 · Hotel Isla Múcura</p>
          <div className="sycamore-sprig sycamore-sprig--centered" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="countdown-card">
            {Object.entries(countdown).map(([unit, value]) => (
              <div className="countdown-item" key={unit}>
                <div className="countdown-ring">
                  <div className="countdown-ring-inner">
                    <strong>{String(value).padStart(2, '0')}</strong>
                    <span>
                      {unit === 'days'
                        ? 'Días'
                        : unit === 'hours'
                          ? 'Horas'
                          : unit === 'minutes'
                            ? 'Minutos'
                            : 'Segundos'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="beach-divider beach-divider--left" aria-hidden="true">
          <span className="beach-divider-line"></span>
          <span className="beach-divider-shell"></span>
          <span className="beach-divider-foam beach-divider-foam--left"></span>
          <span className="beach-divider-foam beach-divider-foam--right"></span>
        </div>

        <section className="venue-section">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--venue"
            src={marinoCaracolaEstrella}
          />
          <p className="eyebrow">Lugar</p>
          <h2 className="venue-title title-with-sea-charm title-with-sea-charm--star-left">
            Hostel Isla Múcura
            <span aria-hidden="true" className="sea-charm sea-charm--star"></span>
          </h2>
          <p className="venue-subcopy">Frente al mar en el jardín del hotel</p>
          <p className="venue-copy">
            Hemos elegido este rincón del Caribe para celebrar juntos un fin de semana inolvidable.
          </p>
          <div className="sycamore-sprig sycamore-sprig--centered" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="venue-actions">
            <a
              className="primary-button"
              href="https://hotelislamucura.com/"
              rel="noreferrer"
              target="_blank"
            >
              Ver hotel
            </a>
            <a
              aria-label="Instagram del Hotel Isla Múcura"
              className="instagram-link"
              href="https://www.instagram.com/hotelislamucura/"
              rel="noreferrer"
              target="_blank"
            >
              <span className="instagram-icon" aria-hidden="true">
                ◎
              </span>
              <span>@hotelislamucura</span>
            </a>
          </div>
        </section>

        <div className="beach-divider beach-divider--right" aria-hidden="true">
          <span className="beach-divider-line"></span>
          <span className="beach-divider-shell"></span>
          <span className="beach-divider-foam beach-divider-foam--left"></span>
          <span className="beach-divider-foam beach-divider-foam--right"></span>
        </div>

        <section className="attendance-info-section">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--attendance"
            src={marinoArenaEstrella}
          />
          <p className="eyebrow">Confirmación</p>
          <h2 className="attendance-info-title title-with-sea-charm title-with-sea-charm--shell-left">
            Información importante
            <span aria-hidden="true" className="sea-charm sea-charm--shell"></span>
          </h2>
          <p className="attendance-info-copy">
            Primero conoce las tarifas y la información del hospedaje antes de confirmar tu
            asistencia.
          </p>
          <div className="attendance-info-actions">
            <button className="secondary-button attendance-action-info" onClick={openInfoModal} type="button">
              Ver información completa
            </button>
            <button
              className="primary-button attendance-action-rsvp"
              disabled={!isKnownInvitation}
              onClick={openRsvpModal}
              type="button"
            >
              Responder invitación
            </button>
          </div>
          <div className="attendance-payment-action">
            <button
              aria-disabled={!isPaymentPortalEnabled}
              className="secondary-button attendance-action-payment"
              onFocus={!isPaymentPortalEnabled ? () => setPaymentPortalToast('Esta información estará disponible cuando confirmes la asistencia') : undefined}
              onClick={openPaymentModal}
              type="button"
            >
              Portal de pagos
            </button>
          </div>
        </section>

        <div className="beach-divider beach-divider--center" aria-hidden="true">
          <span className="beach-divider-line"></span>
          <span className="beach-divider-shell"></span>
          <span className="beach-divider-foam beach-divider-foam--left"></span>
          <span className="beach-divider-foam beach-divider-foam--right"></span>
        </div>

        <section className="portraits-section" aria-label="Retratos de Nuestra Historia">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--portraits"
            src={marinoPerlasEstrellas}
          />
          <div className="section-heading">
            <p className="eyebrow">Retratos de Nuestra Historia</p>
            <h2 className="title-with-sea-charm title-with-sea-charm--star-right">
              Un recorrido por momentos, viajes y miradas que han hecho aún más bonito este amor.
              <span aria-hidden="true" className="sea-charm sea-charm--star"></span>
            </h2>
            <div className="sycamore-sprig sycamore-sprig--centered" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="portraits-carousel">
            <img
              alt=""
              aria-hidden="true"
              className="portraits-carousel-accent portraits-carousel-accent--top"
              src={marinoConchasPlaya}
            />
            <img
              alt=""
              aria-hidden="true"
              className="portraits-carousel-accent portraits-carousel-accent--bottom"
              src={marinoCaracolaEstrella}
            />
            <button
              aria-label="Ver retrato anterior"
              className="portrait-arrow is-left"
              onClick={showPreviousPortrait}
              type="button"
            >
              ‹
            </button>
            <div className="portraits-viewport">
              <div
                className="portraits-track"
                style={{ transform: `translateX(calc(-${activePortraitIndex} * (100% / var(--portraits-visible))))` }}
              >
                {lovePortraits.map((portrait, index) => (
                  <figure className="portrait-slide" key={portrait.src}>
                    <img
                      alt={portrait.alt}
                      className="portrait-image"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      src={portrait.src}
                    />
                  </figure>
                ))}
              </div>
            </div>
            <button
              aria-label="Ver siguiente retrato"
              className="portrait-arrow is-right"
              onClick={showNextPortrait}
              type="button"
            >
              ›
            </button>
          </div>
          <div className="portrait-dots" aria-label="Indicadores de retratos">
            {lovePortraits.map((portrait, index) => (
              <button
                aria-label={`Ir al retrato ${index + 1}`}
                aria-pressed={activePortraitIndex === index}
                className={`portrait-dot ${activePortraitIndex === index ? 'is-active' : ''}`}
                key={`${portrait.src}-dot`}
                onClick={() => setActivePortraitIndex(index)}
                type="button"
              />
            ))}
          </div>
        </section>

        <div className="beach-divider beach-divider--left" aria-hidden="true">
          <span className="beach-divider-line"></span>
          <span className="beach-divider-shell"></span>
          <span className="beach-divider-foam beach-divider-foam--left"></span>
          <span className="beach-divider-foam beach-divider-foam--right"></span>
        </div>

        <section className="party-section" aria-label="Fiesta">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--party"
            src={marinoArenaEstrella}
          />
          <div className="section-heading">
            <p className="eyebrow">Fiesta</p>
            <h2 className="title-with-sea-charm title-with-sea-charm--shell-right">
              Hagamos juntos una fiesta épica.
              <span aria-hidden="true" className="sea-charm sea-charm--shell"></span>
            </h2>
            <p className="party-copy">Aquí algunos detalles a tener en cuenta.</p>
          </div>
          <div className="party-grid">
            <article className="party-card">
              <span className="meta-label">Música</span>
              <strong>¿Cuál es la canción que no debe faltar en la playlist de la fiesta?</strong>
              <button className="secondary-button" onClick={openSongModal} type="button">
                Sugerir cancion
              </button>
            </article>
            <article className="party-card">
              <span className="meta-label">Dress code</span>
              <strong>Una orientación para tu vestuario</strong>
              <button className="secondary-button" onClick={openDressCodeModal} type="button">
                Ver mas
              </button>
            </article>
            <article className="party-card party-card--gift-note">
              <span className="meta-label">Regalo</span>
              <strong>Tu presencia es nuestro mejor regalo</strong>
              <p className="party-card-copy">¡Te esperamos!</p>
            </article>
          </div>
        </section>

        <div className="beach-divider beach-divider--right" aria-hidden="true">
          <span className="beach-divider-line"></span>
          <span className="beach-divider-shell"></span>
          <span className="beach-divider-foam beach-divider-foam--left"></span>
          <span className="beach-divider-foam beach-divider-foam--right"></span>
        </div>

        <section className="contact-section" aria-label="Contacto de los novios">
          <img
            alt=""
            aria-hidden="true"
            className="section-botanical-corner section-botanical-corner--contact"
            src={marinoCaracolaEstrella}
          />
          <div className="section-heading">
            <p className="eyebrow">Contacto</p>
            <h2 className="title-with-sea-charm title-with-sea-charm--star-left">
              Si tienes dudas o preguntas, aquí estamos para ti
              <span aria-hidden="true" className="sea-charm sea-charm--star"></span>
            </h2>
            <p className="contact-copy">
              Queremos que disfrutes este viaje con tranquilidad. Si necesitas ayuda, puedes escribirnos directamente.
            </p>
            <div className="sycamore-sprig sycamore-sprig--centered" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="contact-grid">
            <article className="contact-card">
              <span className="meta-label">Novia</span>
              <strong>Lau</strong>
              <a className="secondary-button" href="https://wa.me/573197659146" rel="noreferrer" target="_blank">
                +57 3197659146
              </a>
            </article>
            <article className="contact-card">
              <span className="meta-label">Novio</span>
              <strong>Juancho</strong>
              <a className="secondary-button" href="https://wa.me/573195852884" rel="noreferrer" target="_blank">
                +57 3195852884
              </a>
            </article>
          </div>
        </section>

      </main>

      {isRsvpOpen && isKnownInvitation ? (
        <div className="modal-backdrop" role="presentation" onClick={closeRsvpModal}>
          <section
            className="rsvp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Cerrar formulario"
              className="modal-close"
              onClick={closeRsvpModal}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">Confirmación</p>
            <h2 id="rsvp-title">{activeInvitation.label}</h2>
            <p className="modal-copy rsvp-intro-copy">
              {isReservationLoading
                ? 'Estamos buscando si esta invitación ya tenía una reserva guardada...'
                : isEditingReservation
                  ? (
                    <>
                      Ya habías confirmado esta invitación. Aquí puedes editar tu información y guardar cambios hasta el{' '}
                      <strong className="rsvp-deadline-highlight">10 de Agosto</strong>.
                    </>
                  )
                  : (
                    <>
                      Completa la información de tu invitación. Si necesitas hacer cambios, podrás editarla aquí mismo hasta el{' '}
                      <strong className="rsvp-deadline-highlight">10 de Agosto</strong>.
                    </>
                  )}
            </p>

            <form className="rsvp-form" onSubmit={handleSubmit}>
              <div className="full-span form-section-card">
                <div className="flow-card-heading">
                  <span className="meta-label">Miembros de esta invitación</span>
                  <strong>Marca exactamente quiénes asistirán</strong>
                </div>
                <div className="member-grid">
                  {familyMembers.map((member) => (
                    <div className="member-stack" key={member.id}>
                      <div className={`member-card ${member.attending ? 'is-attending' : 'is-not-attending'}`}>
                        <span className="member-card-name">{member.name}</span>
                        <div className="attendance-choice-group" aria-label={`Confirmación de asistencia para ${member.name}`} role="radiogroup">
                          <button
                            aria-checked={member.attending}
                            className={`attendance-choice attendance-choice-accept ${member.attending ? 'is-selected' : ''}`}
                            onClick={() => {
                              if (!member.attending) handleMemberAttendanceChange(member.id)
                            }}
                            role="radio"
                            type="button"
                          >
                            <span>Asistiré</span>
                          </button>
                          <button
                            aria-checked={!member.attending}
                            className={`attendance-choice attendance-choice-decline ${!member.attending ? 'is-selected' : ''}`}
                            onClick={() => {
                              if (member.attending) handleMemberAttendanceChange(member.id)
                            }}
                            role="radio"
                            type="button"
                          >
                            <span>No asistiré</span>
                          </button>
                        </div>
                      </div>
                      {member.attending ? (
                        <details className="attendee-details-card" open>
                          <summary className="attendee-details-heading">
                            <span className="meta-label">Datos del asistente</span>
                            <span aria-hidden="true" className="attendee-details-toggle" />
                          </summary>
                          <div className="attendee-details-body">
                            <label className="primary-contact-toggle">
                              <input
                                checked={member.isPrimaryContact}
                                name="primaryContact"
                                onChange={() => handlePrimaryContactChange(member.id)}
                                type="radio"
                              />
                              <span>Contacto principal</span>
                            </label>
                            <div className="attendee-details-grid">
                              {(() => {
                                const isBabyMember = isBabyGuest(activeInvitation.code, member.name)

                                return (
                                  <>
                              <label>
                                <span className="field-label">
                                  <span>Nombre completo</span>
                                  <span className="required-indicator">*</span>
                                </span>
                                <input
                                  onChange={(event) => handleMemberFieldChange(member.id, 'fullName', event.target.value)}
                                  required
                                  value={member.fullName}
                                />
                              </label>
                              <label>
                                <span className="field-label">
                                  <span>ID o Pasaporte</span>
                                  {isBabyMember ? null : <span className="required-indicator">*</span>}
                                </span>
                                <input
                                  readOnly={isBabyMember}
                                  onChange={(event) =>
                                    handleMemberFieldChange(member.id, 'identityDocument', event.target.value)
                                  }
                                  required={!isBabyMember}
                                  value={member.identityDocument}
                                />
                              </label>
                              <label>
                                <span className="field-label">
                                  <span>Teléfono</span>
                                  {isBabyMember ? null : <span className="required-indicator">*</span>}
                                </span>
                                <input
                                  readOnly={isBabyMember}
                                  onChange={(event) => handleMemberFieldChange(member.id, 'phone', event.target.value)}
                                  required={!isBabyMember}
                                  value={member.phone}
                                />
                              </label>
                              <label>
                                <span className="field-label">
                                  <span>Correo</span>
                                </span>
                                <input
                                  readOnly={isBabyMember}
                                  onChange={(event) => handleMemberFieldChange(member.id, 'email', event.target.value)}
                                  type="email"
                                  value={member.email}
                                />
                              </label>
                                  </>
                                )
                              })()}
                              <div className="full-span allergy-toggle-row">
                                <span>Alergias</span>
                                <button
                                  aria-label={member.hasAllergies ? `Indicar que ${member.name} sí tiene alergias` : `Indicar que ${member.name} no tiene alergias`}
                                  aria-pressed={member.hasAllergies}
                                  className={`member-toggle ${member.hasAllergies ? 'is-active' : ''}`}
                                  onClick={() => handleMemberAllergyToggle(member.id)}
                                  type="button"
                                >
                                  <span className="member-toggle-thumb" />
                                </button>
                              </div>
                              {member.hasAllergies ? (
                                <label className="full-span">
                                  <span className="field-label">
                                    <span>¿Cuáles?</span>
                                    <span className="required-indicator">*</span>
                                  </span>
                                  <textarea
                                    onChange={(event) =>
                                      handleMemberFieldChange(member.id, 'allergies', event.target.value)
                                    }
                                    required
                                    rows={3}
                                    value={member.allergies}
                                  />
                                </label>
                              ) : null}
                            </div>
                          </div>
                        </details>
                      ) : null}
                    </div>
                  ))}
                </div>
                <article className="member-summary-card">
                  <span className="meta-label">Resumen</span>
                  <strong>{attendingCount}</strong>
                  <p>persona(s) confirmada(s) hasta ahora</p>
                </article>
              </div>

              {attendingCount > 0 ? (
                <>
                  <div className="full-span form-section-card">
                    <div className="flow-card-heading">
                      <strong>¿Cómo quieren organizarse?</strong>
                    </div>
                    <div className="flow-options">
                      {travelGroupOptions.map((option) => (
                        <label className="flow-option" key={option.value}>
                          <span className="flow-option-control">
                            <input
                              checked={formData.travelGroupMode === option.value}
                              name="travelGroupMode"
                              onChange={handleInputChange}
                              type="radio"
                              value={option.value}
                            />
                          </span>
                          <div className="flow-option-copy">
                            <strong>{option.title}</strong>
                            <p>{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.travelGroupMode === 'join' ? (
                    <div className="full-span lodging-grid">
                      <label>
                        Grupo disponible
                        <select name="groupName" onChange={handleInputChange} required value={formData.groupName}>
                          <option value="">Selecciona un grupo creado</option>
                          {existingGroups.map((group) => (
                            <option
                              disabled={group.capacity > 0 && group.reservedPeople >= group.capacity}
                              key={group.id}
                              value={group.id}
                            >
                              {group.label} · {group.id}
                              {group.capacity > 0
                                ? ` · ${group.reservedPeople}/${group.capacity} personas`
                                : ''}
                              {group.capacity > 0 && group.reservedPeople >= group.capacity
                                ? ' · Cupo completo'
                                : ''}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ) : null}

                  {formData.travelGroupMode === 'join' && existingGroups.length === 0 ? (
                    <p className="availability-note is-empty">
                      Aún no hay grupos creados para unirse. Primero debe existir al menos un grupo anfitrión.
                    </p>
                  ) : null}

                  {formData.travelGroupMode === 'join' && isSelectedExistingGroupFull ? (
                    <p className="availability-note is-empty">
                      Este grupo ya alcanzó su capacidad máxima y no admite más personas.
                    </p>
                  ) : null}

                  {formData.travelGroupMode === 'join' && selectedExistingGroup ? (
                    <div className="full-span form-section-card">
                      <div className="form-section-heading">
                        <span className="meta-label">Hospedaje compartido</span>
                        <strong>Este grupo ya tiene una reserva anfitriona</strong>
                      </div>

                      <div className="lodging-grid">
                        <label>
                          Habitación
                          <input readOnly value={selectedExistingGroup.room || 'Pendiente'} />
                        </label>

                        <label>
                          Número de noches
                          <input
                            readOnly
                            value={
                              selectedExistingGroup.numberOfNights
                                ? `${selectedExistingGroup.numberOfNights} noche(s)`
                                : 'Pendiente'
                            }
                          />
                        </label>

                        <label>
                          Fecha de ingreso
                          <input readOnly value={selectedExistingGroup.checkInDate || 'Pendiente'} />
                        </label>

                        <label>
                          Fecha de salida
                          <input readOnly value={selectedExistingGroup.checkOutDate || 'Pendiente'} />
                        </label>
                      </div>

                      {summaryRoomOption && summaryNightCount && summaryPricePerPerson && summaryStayTotal && summaryPeopleCount ? (
                        <details className="accordion-card lodging-price-accordion" open>
                          <summary className="accordion-card-summary">
                            <span className="meta-label">Resumen de precio</span>
                            <strong>{summaryRoomOption.label}</strong>
                          </summary>
                          <div className="accordion-card-body">
                            <div className="lodging-price-card lodging-price-card--flat">
                              <p>
                                Esta habitación admite hasta {summaryRoomOption.capacity} persona(s) · Personas dentro del grupo:{' '}
                                {summaryPeopleCount}
                              </p>
                              <p>
                                Valor por persona para {summaryNightCount} noche(s): {formatCurrency(summaryPricePerPerson)}
                              </p>
                              <p>Total estimado del grupo: {formatCurrency(summaryStayTotal)}</p>
                              <div>
                                <span className="meta-label">Plan de pagos del grupo</span>
                                {paymentPlan.map((installment) => (
                                  <p key={installment.label}>
                                    {installment.label}: {formatCurrency(installment.amount)}
                                  </p>
                                ))}
                              </div>
                              <div>
                                <span className="meta-label">Plan de pagos por persona</span>
                                {paymentPlanPerPerson.map((installment) => (
                                  <p key={`person-${installment.label}`}>
                                    {installment.label}: {formatCurrency(installment.amount)}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </details>
                      ) : (
                        <p className="availability-note">
                          El grupo seleccionado todavía no tiene completos los datos necesarios para mostrar el resumen del hospedaje.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {formData.travelGroupMode === 'create' ? (
                    <div className="full-span accordion-flow">
                      <details className="accordion-card" open>
                        <summary className="accordion-card-summary">
                          <span className="meta-label">Datos del grupo</span>
                        </summary>
                        <div className="accordion-card-body">
                          <div className="lodging-grid">
                            <label>
                              Nombre del grupo
                              <input
                                name="groupName"
                                onChange={handleInputChange}
                                placeholder="Ej: Grupo Amigos Laura"
                                required
                                value={formData.groupName}
                              />
                            </label>

                            <label>
                              Responsable del grupo
                              <input
                                name="groupLeaderName"
                                onChange={handleInputChange}
                                placeholder="Nombre del líder del grupo"
                                required
                                value={formData.groupLeaderName}
                              />
                            </label>
                          </div>

                          <label className="group-estimate-field">
                            Personas dentro del grupo
                            <select
                              name="sharedInvitationsEstimate"
                              onChange={handleInputChange}
                              required
                              value={formData.sharedInvitationsEstimate}
                            >
                              <option value="">Selecciona el total de personas</option>
                              {groupCapacityOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option} persona{option === '1' ? '' : 's'}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </details>

                      <details className="accordion-card" open>
                        <summary className="accordion-card-summary">
                          <span className="meta-label">Hospedaje del grupo</span>
                          <strong>Selecciona habitación, noches y fechas</strong>
                        </summary>
                        <div className="accordion-card-body">
                          <div className="form-section-card">
                            <div className="form-section-heading">
                              <span className="meta-label">Detalles del hospedaje</span>
                              <strong>Completa los datos del viaje</strong>
                            </div>

                            {isAvailabilityLoading ? (
                              <p className="availability-note">Estamos validando las habitaciones disponibles...</p>
                            ) : null}

                            {availabilityError ? <p className="availability-note is-error">{availabilityError}</p> : null}

                            {availableLodgingOptions.length === 0 ? (
                              <p className="availability-note is-empty">
                                No hay habitaciones disponibles para {requiredLodgingCapacity} invitado(s) en este momento.
                              </p>
                            ) : null}

                            <div className="lodging-grid">
                              <label>
                                Habitación
                                <select name="room" onChange={handleInputChange} required value={formData.room}>
                                  <option value="">Selecciona una habitación</option>
                                  {availableLodgingOptions.map((option) => {
                                    const remainingRooms =
                                      option.totalRooms -
                                      getAdjustedReservedRoomCount(
                                        option.label,
                                        availabilityEntries,
                                        formData.checkInDate,
                                        formData.checkOutDate,
                                        currentInvitationCodeForAvailability,
                                      )

                                    return (
                                      <option key={option.id} value={option.label}>
                                        {option.label} · Hasta {option.capacity} personas · {remainingRooms} disponible(s)
                                      </option>
                                    )
                                  })}
                                </select>
                              </label>

                              <label>
                                Número de noches
                                <select
                                  name="numberOfNights"
                                  onChange={handleInputChange}
                                  required
                                  value={formData.numberOfNights}
                                >
                                  <option value="">Selecciona las noches</option>
                                  {supportedNightCounts.map((nightCount) => (
                                    <option key={nightCount} value={nightCount}>
                                      {nightCount} {nightCount === '1' ? 'noche' : 'noches'}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label>
                                Fecha de ingreso
                                <input
                                  max="2027-06-30"
                                  min="2027-05-01"
                                  name="checkInDate"
                                  onChange={handleInputChange}
                                  required
                                  type="date"
                                  value={formData.checkInDate}
                                />
                              </label>

                              <label>
                                Fecha de salida
                                <input
                                  max="2027-06-30"
                                  min="2027-05-01"
                                  name="checkOutDate"
                                  onChange={handleInputChange}
                                  required
                                  type="date"
                                  value={formData.checkOutDate}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </details>

                      {summaryRoomOption && summaryNightCount && summaryPricePerPerson && summaryStayTotal && summaryPeopleCount ? (
                        <details className="accordion-card lodging-price-accordion" open>
                          <summary className="accordion-card-summary">
                            <span className="meta-label">Resumen de precio</span>
                            <strong>{summaryRoomOption.label}</strong>
                          </summary>
                          <div className="accordion-card-body">
                            <div className="lodging-price-card">
                              <p>
                                Esta habitación admite hasta {summaryRoomOption.capacity} persona(s) ·{' '}
                                {formData.travelGroupMode === 'create'
                                  ? `Personas dentro del grupo: ${summaryPeopleCount}`
                                  : `En esta reserva se hospedarán ${summaryPeopleCount}`}
                              </p>
                              <p>
                                Valor por persona para {summaryNightCount} noche(s):{' '}
                                {formatCurrency(summaryPricePerPerson)}
                              </p>
                              <p>Total estimado del grupo: {formatCurrency(summaryStayTotal)}</p>
                              <div>
                                <span className="meta-label">Plan de pagos del grupo</span>
                                {paymentPlan.map((installment) => (
                                  <p key={installment.label}>
                                    {installment.label}: {formatCurrency(installment.amount)}
                                  </p>
                                ))}
                              </div>
                              <div>
                                <span className="meta-label">Plan de pagos por persona</span>
                                {paymentPlanPerPerson.map((installment) => (
                                  <p key={`person-${installment.label}`}>
                                    {installment.label}: {formatCurrency(installment.amount)}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </details>
                      ) : (
                        <p className="availability-note">
                          Completa los datos del hospedaje para ver aquí el resumen final del grupo.
                        </p>
                      )}
                    </div>
                  ) : null}

                  {formData.travelGroupMode === 'individual' ? (
                    <div className="full-span form-section-card">
                    <div className="form-section-heading">
                      <span className="meta-label">Detalles del hospedaje</span>
                      <strong>Completa los datos del viaje</strong>
                    </div>

                    {isAvailabilityLoading ? (
                      <p className="availability-note">Estamos validando las habitaciones disponibles...</p>
                    ) : null}

                    {availabilityError ? <p className="availability-note is-error">{availabilityError}</p> : null}

                    {availableLodgingOptions.length === 0 ? (
                      <p className="availability-note is-empty">
                        No hay habitaciones disponibles para {requiredLodgingCapacity} invitado(s) en este momento.
                      </p>
                    ) : null}

                    <div className="lodging-grid">
                      <label>
                        Habitación
                        <select
                          name="room"
                          onChange={handleInputChange}
                          required
                          value={formData.room}
                        >
                          <option value="">Selecciona una habitación</option>
                          {availableLodgingOptions.map((option) => {
                            const remainingRooms =
                              option.totalRooms -
                              getAdjustedReservedRoomCount(
                                option.label,
                                availabilityEntries,
                                formData.checkInDate,
                                formData.checkOutDate,
                                currentInvitationCodeForAvailability,
                              )

                            return (
                              <option key={option.id} value={option.label}>
                                {option.label} · Hasta {option.capacity} personas · {remainingRooms} disponible(s)
                              </option>
                            )
                          })}
                        </select>
                      </label>

                      <label>
                        Número de noches
                        <select
                          name="numberOfNights"
                          onChange={handleInputChange}
                          required
                          value={formData.numberOfNights}
                        >
                          <option value="">Selecciona las noches</option>
                          {supportedNightCounts.map((nightCount) => (
                            <option key={nightCount} value={nightCount}>
                              {nightCount} {nightCount === '1' ? 'noche' : 'noches'}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Fecha de ingreso
                        <input
                          max="2027-06-30"
                          min="2027-05-01"
                          name="checkInDate"
                          onChange={handleInputChange}
                          required
                          type="date"
                          value={formData.checkInDate}
                        />
                      </label>

                      <label>
                        Fecha de salida
                        <input
                          max="2027-06-30"
                          min="2027-05-01"
                          name="checkOutDate"
                          onChange={handleInputChange}
                          required
                          type="date"
                          value={formData.checkOutDate}
                        />
                      </label>

                    </div>

                    {summaryRoomOption && summaryNightCount && summaryPricePerPerson && summaryStayTotal && summaryPeopleCount ? (
                      <details className="accordion-card lodging-price-accordion" open>
                        <summary className="accordion-card-summary">
                          <span className="meta-label">Resumen de precio</span>
                          <strong>{summaryRoomOption.label}</strong>
                        </summary>
                        <div className="accordion-card-body">
                          <div className="lodging-price-card">
                            <p>
                              Esta habitación admite hasta {summaryRoomOption.capacity} persona(s) · En esta reserva se hospedarán{' '}
                              {summaryPeopleCount}
                            </p>
                            <p>Valor por persona para {summaryNightCount} noche(s): {formatCurrency(summaryPricePerPerson)}</p>
                            <p>Total estimado del grupo: {formatCurrency(summaryStayTotal)}</p>
                            <div>
                              <span className="meta-label">Plan de pagos del grupo</span>
                              {paymentPlan.map((installment) => (
                                <p key={installment.label}>
                                  {installment.label}: {formatCurrency(installment.amount)}
                                </p>
                              ))}
                            </div>
                            <div>
                              <span className="meta-label">Plan de pagos por persona</span>
                              {paymentPlanPerPerson.map((installment) => (
                                <p key={`person-${installment.label}`}>
                                  {installment.label}: {formatCurrency(installment.amount)}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </details>
                    ) : null}
                    </div>
                  ) : null}
                </>
              ) : null}

              {feedbackMessage ? (
                <p className={`form-feedback ${submitState === 'error' ? 'is-error' : 'is-success'}`}>
                  {feedbackMessage}
                </p>
              ) : null}

              <div className="form-actions">
                <button className="secondary-button" onClick={closeRsvpModal} type="button">
                  Cerrar
                </button>
                <button
                  className="primary-button"
                  disabled={submitState === 'submitting' || isReservationLoading}
                  type="submit"
                >
                  {submitState === 'submitting'
                    ? isEditingReservation
                      ? 'Guardando cambios...'
                      : 'Guardando...'
                    : isEditingReservation
                      ? 'Guardar cambios'
                      : 'Guardar reserva'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isInfoOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeInfoModal}>
          <section
            aria-labelledby="attendance-info-modal-title"
            aria-modal="true"
            className="info-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Cerrar información"
              className="modal-close"
              onClick={closeInfoModal}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">Información importante</p>
            <h2 id="attendance-info-modal-title">Antes de confirmar asistencia</h2>
            <article className="lodging-banner">
              <p className="lodging-banner-copy">
                La siguiente información corresponde al precio final que se mostrará más adelante. Te recomendamos
                revisarla antes de confirmar tu reserva, ya que incluye las condiciones, formas de pago y otros
                detalles importantes.
              </p>
              <div className="lodging-cards-grid">
                <article className="lodging-detail-card">
                  <span className="meta-label">Que incluye este plan:</span>
                  <ul className="lodging-includes-list">
                    <li>🏨 Hospedaje en Hotel Isla Múcura</li>
                    <li>🍽️ Alimentación desayuno -almuerzo-cena (buffet o platos a la carta)</li>
                    <li>🚢 Transporte desde Cartagena a la Isla en lancha (Ida y vuelta)</li>
                  </ul>
                </article>

                <article className="lodging-detail-card">
                  <span className="meta-label">Que no incluye este plan:</span>
                  <ul className="lodging-includes-list">
                    <li>🚫 Transporte desde tu ciudad a Cartagena</li>
                    <li>🚫 Gastos personales y consumos adicionales</li>
                  </ul>
                </article>

                <article className="lodging-detail-card">
                  <span className="meta-label">Plan de pagos:</span>
                  <ul className="lodging-includes-list">
                    <li>30% hasta el 1 de Octubre de 2026.</li>
                    <li>30% hasta el 22 de Diciembre de 2026.</li>
                    <li>40% hasta el 1 de Abril de 2026.</li>
                  </ul>
                </article>

                <article className="lodging-detail-card">
                  <span className="meta-label">Importante:</span>
                  <ul className="lodging-includes-list">
                    <li>Una vez realizado un abono, el hotel no realiza devoluciones.</li>
                    <li>
                      Tienes tiempo de confirmar o editar tu reserva hasta el{' '}
                      <span className="lodging-deadline">10 de Agosto de 2026</span>
                    </li>
                    <li>
                      Es importante que llegues a La Bodeguita de Cartagena antes de las 9:00 a. m., ya que el
                      transporte hacia la Isla Múcura sale antes de esa hora.
                    </li>
                  </ul>
                </article>
              </div>
            </article>
            <img
              alt="Tarifas actualizadas del hotel Isla Múcura"
              className="info-modal-image"
              src={tarifasHotelActualizadas}
            />
          </section>
        </div>
      ) : null}

      {isSongModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeSongModal}>
          <section
            aria-labelledby="song-suggestion-modal-title"
            aria-modal="true"
            className="party-modal song-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Cerrar formulario de canción"
              className="modal-close"
              onClick={closeSongModal}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">Música</p>
            <h2 id="song-suggestion-modal-title">Sugerir canción</h2>
            <p className="modal-copy song-modal-copy">
              Cuéntanos cuál canción te haría ilusión escuchar en nuestra fiesta.
            </p>
            <form className="party-form" onSubmit={handleSongSuggestionSubmit}>
              <label>
                Tu Nombre
                <input
                  name="guestName"
                  onChange={handleSongSuggestionInputChange}
                  required
                  value={songSuggestionForm.guestName}
                />
              </label>
              <label>
                Nombre de cancion
                <input
                  name="songName"
                  onChange={handleSongSuggestionInputChange}
                  required
                  value={songSuggestionForm.songName}
                />
              </label>
              <label>
                Autor
                <input
                  name="artistName"
                  onChange={handleSongSuggestionInputChange}
                  required
                  value={songSuggestionForm.artistName}
                />
              </label>
              <label>
                Si desea ingrese el link de YouTube o Spotify aqui
                <input
                  name="songLink"
                  onChange={handleSongSuggestionInputChange}
                  type="url"
                  value={songSuggestionForm.songLink}
                />
              </label>
              {songSuggestionFeedback ? (
                <p className={`form-feedback ${songSuggestionFeedback.startsWith('No se pudo') ? 'is-error' : 'is-success'}`}>
                  {songSuggestionFeedback}
                </p>
              ) : null}
              <div className="form-actions">
                <button className="secondary-button" onClick={closeSongModal} type="button">
                  Cerrar
                </button>
                <button className="primary-button" type="submit">
                  Sugerir cancion
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {isDressCodeModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeDressCodeModal}>
          <section
            aria-labelledby="dress-code-modal-title"
            aria-modal="true"
            className="party-modal party-modal--compact"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Cerrar dress code"
              className="modal-close"
              onClick={closeDressCodeModal}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">Dress code</p>
            <h2 id="dress-code-modal-title">White party</h2>
            <p className="modal-copy dress-code-copy">
              <span className="dress-code-highlight">Todos de blanco</span>
            </p>
            <p className="modal-copy dress-code-copy">
              Estilo <span className="dress-code-accent">boho chic</span>
            </p>
            <div className="dress-code-gallery">
              <article className="dress-code-card">
                <span className="meta-label">Ellas</span>
                <img alt="Inspiración de vestuario para mujeres" className="dress-code-image" src={dressCodeEllas} />
              </article>
              <article className="dress-code-card">
                <span className="meta-label">Ellos</span>
                <img alt="Inspiración de vestuario para hombres" className="dress-code-image" src={dressCodeEllos} />
              </article>
            </div>
          </section>
        </div>
      ) : null}

      {isPaymentModalOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closePaymentModal}>
          <section
            aria-labelledby="payment-modal-title"
            aria-modal="true"
            className="party-modal payment-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Cerrar portal de pagos"
              className="modal-close"
              onClick={closePaymentModal}
              type="button"
            >
              ×
            </button>
            <p className="eyebrow">Portal de pagos</p>
            <h2 id="payment-modal-title">Información para realizar tu pago</h2>
            <p className="modal-copy payment-modal-intro">Elige el método de pago que te resulte más cómodo.</p>
            <div className="payment-methods">
              <article className="payment-method-card">
                <span className="meta-label">Método 1</span>
                <strong>Pago en línea</strong>
                <p className="payment-method-copy">
                  Realiza tu pago directamente desde este enlace seguro.
                </p>
                <a className="secondary-button payment-method-link" href="https://checkout.wompi.co/method" rel="noreferrer" target="_blank">
                  Ir a Wompi
                </a>
              </article>
              <article className="payment-method-card">
                <span className="meta-label">Método 2</span>
                <strong>Transferencia Bancolombia</strong>
                <p className="payment-method-copy">
                  INVERSIONES MUNDO MUCURA SAS
                  <br />
                  NIT 901079616
                  <br />
                  Cuenta de ahorros 21889824406
                </p>
              </article>
            </div>
            <div className="payment-notes">
              <p className="payment-note">
                <strong>Importante:</strong> No se harán devoluciones en caso de que ya se haya realizado algún pago.
              </p>
              <p className="payment-note">
                Envía los comprobantes de pago al WA de{' '}
                <a href="https://wa.me/573197659146" rel="noreferrer" target="_blank">Lau</a>
                {' '}o{' '}
                <a href="https://wa.me/573195852884" rel="noreferrer" target="_blank">Juancho</a>.
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default App
