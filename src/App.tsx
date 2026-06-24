import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

type RsvpFormData = {
  fullName: string
  identityDocument: string
  phone: string
  description: string
  room: string
  numberOfPeople: string
  numberOfNights: string
  checkInDate: string
  checkOutDate: string
  arrivalTime: string
  departureTime: string
  boardingPoint: string
  allergies: string
  notes: string
}

const weddingDate = new Date('2027-04-17T16:00:00')

const initialFormData: RsvpFormData = {
  fullName: '',
  identityDocument: '',
  phone: '',
  description: '',
  room: '',
  numberOfPeople: '',
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

function App() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(weddingDate))
  const [isRsvpOpen, setIsRsvpOpen] = useState(false)
  const [formData, setFormData] = useState<RsvpFormData>(initialFormData)
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  )
  const [feedbackMessage, setFeedbackMessage] = useState('')

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdown(weddingDate))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', isRsvpOpen)

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isRsvpOpen])

  function openRsvpModal() {
    setIsRsvpOpen(true)
    setSubmitState('idle')
    setFeedbackMessage('')
  }

  function closeRsvpModal() {
    setIsRsvpOpen(false)
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!supabase) {
      setSubmitState('error')
      setFeedbackMessage(
        'Falta conectar Supabase. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para guardar respuestas.',
      )
      return
    }

    setSubmitState('submitting')
    setFeedbackMessage('')

    const payload = {
      full_name: formData.fullName.trim(),
      identity_document: formData.identityDocument.trim(),
      phone: formData.phone.trim(),
      description: formData.description.trim() || null,
      room: formData.room.trim() || null,
      number_of_people: Number(formData.numberOfPeople),
      number_of_nights: Number(formData.numberOfNights),
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      arrival_time: formData.arrivalTime || null,
      departure_time: formData.departureTime || null,
      boarding_point: formData.boardingPoint.trim() || null,
      allergies: formData.allergies.trim() || null,
      notes: formData.notes.trim() || null,
    }

    const { error } = await supabase.from('wedding_rsvps').insert(payload)

    if (error) {
      setSubmitState('error')
      setFeedbackMessage('No se pudo guardar la información. Revisa la configuración de Supabase.')
      return
    }

    setSubmitState('success')
    setFeedbackMessage('Tu información fue registrada con éxito. Gracias por confirmar.')
    setFormData(initialFormData)
  }

  return (
    <>
      <main className="invitation-shell">
        <section className="hero-section">
          <p className="eyebrow">Laura & Juan</p>
          <span className="ornament" aria-hidden="true"></span>
          <p className="hero-kicker">Nos casamos</p>
          <h1>Una celebración hecha de amor, memoria y familia</h1>
          <p className="hero-copy">
            Queremos invitarte a compartir con nosotros un día lleno de emoción, belleza y
            pequeños detalles inolvidables.
          </p>
          <div className="hero-meta">
            <div>
              <span className="meta-label">Fecha</span>
              <strong>17 abril 2027</strong>
            </div>
            <div>
              <span className="meta-label">Hora</span>
              <strong>4:00 PM</strong>
            </div>
            <div>
              <span className="meta-label">Lugar</span>
              <strong>Hacienda Las Camelias</strong>
            </div>
          </div>
          <button className="primary-button" type="button" onClick={openRsvpModal}>
            Confirmar asistencia
          </button>
        </section>

        <section className="countdown-card" aria-label="Cuenta regresiva para la boda">
          {Object.entries(countdown).map(([unit, value]) => (
            <div className="countdown-item" key={unit}>
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
          ))}
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
          <h2>Nos hará muy felices contar contigo</h2>
          <p>Reserva este día para acompañarnos y celebrar el inicio de este nuevo capítulo.</p>
          <div className="closing-actions">
            <button className="primary-button" type="button" onClick={openRsvpModal}>
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

      {isRsvpOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={closeRsvpModal}>
          <section
            className="rsvp-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" type="button" aria-label="Cerrar formulario" onClick={closeRsvpModal}>
              ×
            </button>
            <p className="eyebrow">Confirmación</p>
            <h2 id="rsvp-title">Completa tus datos de hospedaje y asistencia</h2>
            <p className="modal-copy">
              Este formulario quedará conectado a Supabase para almacenar cada confirmación en una
              base de datos segura y fácil de administrar.
            </p>

            <form className="rsvp-form" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                C.C o Pasaporte
                <input
                  name="identityDocument"
                  value={formData.identityDocument}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Teléfono
                <input name="phone" value={formData.phone} onChange={handleInputChange} required />
              </label>

              <label className="full-span">
                Descripción
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </label>

              <label>
                Habitación
                <input name="room" value={formData.room} onChange={handleInputChange} />
              </label>

              <label>
                Número de personas
                <input
                  name="numberOfPeople"
                  type="number"
                  min="1"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Número de noches
                <input
                  name="numberOfNights"
                  type="number"
                  min="1"
                  value={formData.numberOfNights}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Fecha de ingreso
                <input
                  name="checkInDate"
                  type="date"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Fecha de salida
                <input
                  name="checkOutDate"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Hora llegada
                <input
                  name="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Hora salida
                <input
                  name="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Punto de abordaje
                <input
                  name="boardingPoint"
                  value={formData.boardingPoint}
                  onChange={handleInputChange}
                />
              </label>

              <label className="full-span">
                Alergias
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                />
              </label>

              <label className="full-span">
                Anotación
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} />
              </label>

              {feedbackMessage ? (
                <p className={`form-feedback ${submitState === 'error' ? 'is-error' : 'is-success'}`}>
                  {feedbackMessage}
                </p>
              ) : null}

              <div className="form-actions">
                <button className="secondary-button" type="button" onClick={closeRsvpModal}>
                  Cerrar
                </button>
                <button className="primary-button" type="submit" disabled={submitState === 'submitting'}>
                  {submitState === 'submitting' ? 'Guardando...' : 'Guardar información'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default App
