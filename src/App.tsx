import { useEffect, useState } from 'react'
import './App.css'

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const weddingDate = new Date('2027-04-17T16:00:00')

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

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(getCountdown(weddingDate))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
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
        <a className="primary-button" href="#rsvp">
          Confirmar asistencia
        </a>
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
        <p>
          Reserva este día para acompañarnos y celebrar el inicio de este nuevo capítulo.
        </p>
        <div className="closing-actions">
          <a className="primary-button" href="mailto:hola@laurayjuan.com?subject=Confirmacion%20de%20asistencia">
            Confirmar por email
          </a>
          <a className="secondary-button" href="https://maps.google.com" target="_blank" rel="noreferrer">
            Ver ubicación
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
