import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import portadaLauraJuan from './assets/images/portada-laura-juan.jpeg'
import infoIslaMucura from './assets/info/info-isla-mucura.jpeg'

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
}

type InvitationMember = {
  id: string
  name: string
  attending: boolean
}

type RsvpFormData = {
  fullName: string
  identityDocument: string
  phone: string
  travelGroupMode: TravelGroupMode
  groupName: string
  groupCode: string
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

const weddingDate = new Date('2027-05-27T16:00:00')

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
]

const initialFormData: RsvpFormData = {
  fullName: '',
  identityDocument: '',
  phone: '',
  travelGroupMode: 'individual',
  groupName: '',
  groupCode: '',
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

const timeline = [
  {
    time: '4:00 PM',
    title: 'Ceremonia',
    description: 'Nos encontraremos entre flores, velas y promesas para decirnos si para siempre.',
  },
  {
    time: '6:00 PM',
    title: 'Coctel al atardecer',
    description: 'Brindis, abrazos largos y música suave mientras cae la tarde.',
  },
  {
    time: '8:00 PM',
    title: 'Cena y celebración',
    description: 'Una mesa compartida, baile infinito y una noche para recordar.',
  },
]

const moments = [
  'Una historia que empezó con una conversación sencilla y terminó convirtiéndose en hogar.',
  'Después de miles de cafés, viajes, risas y planes, elegimos celebrar el amor con quienes más queremos.',
  'Queremos que esta invitación se sienta como un abrazo: íntima, cálida y muy nuestra.',
]

const details = [
  {
    label: 'Lugar',
    value: 'Hacienda Las Camelias',
  },
  {
    label: 'Ciudad',
    value: 'Medellín, Colombia',
  },
  {
    label: 'Dress code',
    value: 'Formal elegante en tonos suaves',
  },
  {
    label: 'Confirmación',
    value: 'Antes del 20 de marzo de 2027',
  },
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

function createMembers(invitation: InvitationPreset): InvitationMember[] {
  return invitation.members.map((memberName, index) => ({
    id: `${invitation.code}-${index}`,
    name: memberName,
    attending: true,
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

function buildGroupSummary(formData: RsvpFormData) {
  if (formData.travelGroupMode === 'individual') {
    return 'La invitación se hospeda sola y mantiene su reserva independiente.'
  }

  if (formData.travelGroupMode === 'create') {
    return `Crea grupo compartido: ${formData.groupName || 'Sin nombre aún'} | Código sugerido: ${formData.groupCode || 'Sin código aún'} | Responsable: ${formData.groupLeaderName || formData.fullName || 'Pendiente'} | Invitaciones estimadas: ${formData.sharedInvitationsEstimate || 'Pendiente'}`
  }

  return `Se une a grupo existente: ${formData.groupName || 'Sin nombre aún'} | Código del grupo: ${formData.groupCode || 'Sin código aún'} | Líder del grupo: ${formData.groupLeaderName || 'Pendiente'}`
}

function App() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(weddingDate))
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [activeInvitation] = useState<InvitationPreset>(() => getInvitationFromSearch())
  const [familyMembers, setFamilyMembers] = useState<InvitationMember[]>(() => createMembers(getInvitationFromSearch()))
  const [formData, setFormData] = useState<RsvpFormData>({
    ...initialFormData,
    fullName: getInvitationFromSearch().members[0] ?? '',
  })
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const invitationType = getInvitationType(activeInvitation)
  const attendingMembers = familyMembers.filter((member) => member.attending)
  const attendingCount = attendingMembers.length
  const isKnownInvitation = activeInvitation.code !== 'INV-DEFAULT'

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdown(weddingDate))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', isRsvpOpen || isInfoOpen)

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isInfoOpen, isRsvpOpen])

  useEffect(() => {
    if (attendingCount > 0) {
      return
    }

    setFormData((current) => ({
      ...current,
      travelGroupMode: 'individual',
      groupName: '',
      groupCode: '',
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

  function openRsvpModal() {
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
          next.groupCode = ''
          next.groupLeaderName = ''
          next.sharedInvitationsEstimate = ''
        }

        if (value === 'join') {
          next.sharedInvitationsEstimate = ''
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (attendingCount === 0) {
      setSubmitState('error')
      setFeedbackMessage('Selecciona por lo menos una persona asistente dentro de la invitación.')
      return
    }

    if (!supabase) {
      setSubmitState('error')
      setFeedbackMessage(
        'Falta conectar Supabase. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para guardar respuestas.',
      )
      return
    }

    setSubmitState('submitting')
    setFeedbackMessage('')

    const membersSummary = familyMembers
      .map((member) => `${member.name}: ${member.attending ? 'Asiste' : 'No asiste'}`)
      .join(' | ')

    const payload = {
      full_name: formData.fullName.trim(),
      identity_document: formData.identityDocument.trim(),
      phone: formData.phone.trim(),
      description:
        [
          `Código de invitación: ${activeInvitation.code}`,
          `Invitación visible: ${activeInvitation.label}`,
          `Tipo de invitación: ${invitationType === 'family' ? 'Familiar' : 'Individual'}`,
          `Miembros: ${membersSummary}`,
          `Modo de hospedaje: ${travelGroupOptions.find((option) => option.value === formData.travelGroupMode)?.title ?? 'Sin definir'}`,
          buildGroupSummary(formData),
          formData.description.trim(),
        ]
          .filter(Boolean)
          .join(' | ') || null,
      room: formData.room.trim() || null,
      number_of_people: attendingCount,
      number_of_nights: Number(formData.numberOfNights),
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      arrival_time: formData.arrivalTime || null,
      departure_time: formData.departureTime || null,
      boarding_point: formData.boardingPoint.trim() || null,
      allergies: formData.allergies.trim() || null,
      notes:
        [
          formData.notes.trim(),
          formData.travelGroupMode === 'create' && formData.sharedInvitationsEstimate
            ? `Invitaciones estimadas dentro del grupo: ${formData.sharedInvitationsEstimate}`
            : '',
        ]
          .filter(Boolean)
          .join(' | ') || null,
    }

    const { error } = await supabase.from('wedding_rsvps').insert(payload)

    if (error) {
      setSubmitState('error')
      setFeedbackMessage('No se pudo guardar la información. Revisa la configuración de Supabase.')
      return
    }

    setSubmitState('success')
    setFeedbackMessage('La confirmación de esta invitación fue registrada con éxito.')
    setFamilyMembers(createMembers(activeInvitation))
    setFormData({
      ...initialFormData,
      fullName: activeInvitation.members[0] ?? '',
    })
  }

  return (
    <>
      <main className="invitation-shell">
        <section className="hero-section">
          <div className="hero-media">
            <img alt="Laura y Juan abrazados junto al lago" className="hero-image" src={portadaLauraJuan} />
          </div>
          <div className="hero-content">
            <p className="hero-kicker">Nos casamos</p>
            <span className="ornament" aria-hidden="true"></span>
            <h1>Laura & Juan</h1>
            <p className="hero-quote">
              “De todas las historias que existen en el mundo, la nuestra es nuestra favorita.”
            </p>
            <p className="hero-copy">
              Queremos invitarte a compartir con nosotros un día lleno de amor, gratitud y
              recuerdos que atesoraremos para siempre.
            </p>
            <div className="hero-meta">
              <div>
                <span className="meta-label">Fecha</span>
                <strong>27 mayo 2027</strong>
              </div>
              <div>
                <span className="meta-label">Hora</span>
                <strong>4:00 PM</strong>
              </div>
              <div>
                <span className="meta-label">Lugar</span>
                <strong>Hotel Isla Múcura</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="countdown-section" aria-label="Cuenta regresiva para la boda">
          <h2 className="countdown-title">Cuenta regresiva para el gran día</h2>
          <p className="countdown-date">27 de mayo de 2027 · Hotel Isla Múcura</p>
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

        <section className="venue-section">
          <p className="eyebrow">Lugar</p>
          <h2 className="venue-title">Hostel Isla Múcura</h2>
          <p className="venue-copy">
            Hemos elegido este rincón del Caribe para celebrar juntos un fin de semana inolvidable.
          </p>
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

        <section className="invitees-section">
          <p className="invitees-label">Invitación para:</p>
          <h2 className="invitees-title">
            {isKnownInvitation ? activeInvitation.label : 'Tu invitación personalizada'}
          </h2>
        </section>

        <section className="attendance-info-section">
          <p className="eyebrow">Confirmación</p>
          <h2 className="attendance-info-title">Información importante</h2>
          <p className="attendance-info-copy">
            Aquí encontrarás un resumen importante sobre el viaje, el plan, los tiempos y los datos
            necesarios antes de completar tu respuesta.
          </p>
          <div className="attendance-info-actions">
            <button className="secondary-button" onClick={openInfoModal} type="button">
              Ver información completa
            </button>
            <button className="decline-button" type="button">
              No podré asistir
            </button>
            <button className="primary-button" disabled={!isKnownInvitation} onClick={openRsvpModal} type="button">
              Asistiré
            </button>
          </div>
        </section>

        <section className="story-section">
          <div className="section-heading">
            <p className="eyebrow">Nuestra historia</p>
            <h2>Una invitación íntima con aire vintage</h2>
          </div>
          <div className="story-grid">
            <article className="story-card quote-card">
              <p>
                “El amor verdadero no hace ruido. Se queda, florece y convierte lo cotidiano en
                algo extraordinario.”
              </p>
            </article>
            {moments.map((moment) => (
              <article className="story-card" key={moment}>
                <p>{moment}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="details-section">
          <div className="section-heading aligned-left">
            <p className="eyebrow">Detalles del día</p>
            <h2>Todo lo que necesitas para acompañarnos</h2>
          </div>
          <div className="details-grid">
            {details.map((detail) => (
              <article className="detail-card" key={detail.label}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="timeline-section">
          <div className="section-heading">
            <p className="eyebrow">Agenda</p>
            <h2>Un día pensado para celebrar despacio</h2>
          </div>
          <div className="timeline-list">
            {timeline.map((item) => (
              <article className="timeline-card" key={item.time}>
                <span>{item.time}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="closing-section" id="rsvp">
          <p className="eyebrow">RSVP</p>
          <h2>{isKnownInvitation ? activeInvitation.label : 'Esperando enlace personalizado'}</h2>
          <p>
            {isKnownInvitation
              ? `Esta invitación está lista para confirmar a ${activeInvitation.members.length} integrante(s) y decidir si se hospeda sola o comparte grupo con otra familia.`
              : 'Cuando abras un enlace real de invitación, aquí aparecerá el nombre de la familia o del invitado correspondiente.'}
          </p>
          <div className="closing-actions">
            <button className="primary-button" disabled={!isKnownInvitation} type="button" onClick={openRsvpModal}>
              Completar formulario
            </button>
            <a
              className="secondary-button"
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
            >
              Ver ubicación
            </a>
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
            <p className="modal-copy">
              Confirma quiénes asistirán y, si aplica, completa los datos del hospedaje.
            </p>

            <form className="rsvp-form" onSubmit={handleSubmit}>
              <div className="full-span form-section-card is-soft">
                <div className="form-section-heading">
                  <span className="meta-label">Datos de contacto</span>
                  <strong>Quién está diligenciando esta respuesta</strong>
                </div>
                <div className="contact-grid">
                  <label>
                    Contacto principal
                    <input
                      name="fullName"
                      onChange={handleInputChange}
                      required
                      value={formData.fullName}
                    />
                  </label>

                  <label>
                    C.C o Pasaporte
                    <input
                      name="identityDocument"
                      onChange={handleInputChange}
                      required
                      value={formData.identityDocument}
                    />
                  </label>

                  <label className="phone-field">
                    Teléfono
                    <input name="phone" onChange={handleInputChange} required value={formData.phone} />
                  </label>
                </div>
                <article className="member-summary-card">
                  <span className="meta-label">Resumen</span>
                  <strong>{attendingCount}</strong>
                  <p>persona(s) confirmada(s) hasta ahora</p>
                </article>
              </div>

              <div className="full-span form-section-card">
                <div className="flow-card-heading">
                  <span className="meta-label">Miembros de esta invitación</span>
                  <strong>Marca exactamente quiénes asistirán</strong>
                </div>
                <div className="member-grid">
                  {familyMembers.map((member) => (
                    <label className={`member-card ${member.attending ? 'is-attending' : ''}`} key={member.id}>
                      <input
                        checked={member.attending}
                        onChange={() => handleMemberAttendanceChange(member.id)}
                        type="checkbox"
                      />
                      <div>
                        <strong>{member.name}</strong>
                        <p>{member.attending ? 'Asiste a la boda' : 'No asistirá'}</p>
                      </div>
                    </label>
                  ))}
                </div>
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
                          <input
                            checked={formData.travelGroupMode === option.value}
                            name="travelGroupMode"
                            onChange={handleInputChange}
                            type="radio"
                            value={option.value}
                          />
                          <div>
                            <strong>{option.title}</strong>
                            <p>{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.travelGroupMode !== 'individual' ? (
                    <div className="full-span lodging-grid">
                      <label>
                        Nombre del grupo
                        <input
                          name="groupName"
                          onChange={handleInputChange}
                          placeholder="Ej: Grupo primos Laura"
                          required
                          value={formData.groupName}
                        />
                      </label>

                      <label>
                        Código del grupo
                        <input
                          name="groupCode"
                          onChange={handleInputChange}
                          placeholder="Ej: GR-PRIMOS"
                          required
                          value={formData.groupCode}
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
                  ) : null}

                  {formData.travelGroupMode === 'create' ? (
                    <label className="group-estimate-field">
                      Invitaciones estimadas dentro del grupo
                      <input
                        min="1"
                        name="sharedInvitationsEstimate"
                        onChange={handleInputChange}
                        placeholder="Ej: 3"
                        required
                        type="number"
                        value={formData.sharedInvitationsEstimate}
                      />
                    </label>
                  ) : null}

                  <div className="full-span form-section-card">
                    <div className="form-section-heading">
                      <span className="meta-label">Detalles del hospedaje</span>
                      <strong>Completa los datos del viaje</strong>
                    </div>
                    <div className="lodging-grid">
                      <label>
                        Habitación
                        <input name="room" onChange={handleInputChange} value={formData.room} />
                      </label>

                      <label>
                        Número de noches
                        <input
                          min="1"
                          name="numberOfNights"
                          onChange={handleInputChange}
                          required
                          type="number"
                          value={formData.numberOfNights}
                        />
                      </label>

                      <label>
                        Fecha de ingreso
                        <input
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
                          name="checkOutDate"
                          onChange={handleInputChange}
                          required
                          type="date"
                          value={formData.checkOutDate}
                        />
                      </label>

                      <label>
                        Hora llegada
                        <input
                          name="arrivalTime"
                          onChange={handleInputChange}
                          type="time"
                          value={formData.arrivalTime}
                        />
                      </label>

                      <label>
                        Hora salida
                        <input
                          name="departureTime"
                          onChange={handleInputChange}
                          type="time"
                          value={formData.departureTime}
                        />
                      </label>

                      <label className="full-span">
                        Punto de abordaje
                        <input
                          name="boardingPoint"
                          onChange={handleInputChange}
                          value={formData.boardingPoint}
                        />
                      </label>

                      <label className="full-span">
                        Alergias
                        <textarea
                          name="allergies"
                          onChange={handleInputChange}
                          rows={3}
                          value={formData.allergies}
                        />
                      </label>
                    </div>
                  </div>
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
                  disabled={submitState === 'submitting' || attendingCount === 0}
                  type="submit"
                >
                  {submitState === 'submitting' ? 'Guardando...' : 'Guardar'}
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
            <img
              alt="Información de la boda en Isla Múcura con plan, fechas, tarifas y datos logísticos"
              className="info-modal-image"
              src={infoIslaMucura}
            />
          </section>
        </div>
      ) : null}
    </>
  )
}

export default App
