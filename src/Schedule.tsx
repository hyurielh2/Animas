import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const days = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
]

const typeStyles: Record<string, string> = {
  estreno: 'bg-orange-500 text-white font-bold',
  reprise: 'bg-blue-400 text-white font-bold',
  retro: 'bg-white text-black font-bold border-2 border-orange-400',
  maraton: 'bg-gradient-to-r from-orange-400 to-blue-400 text-white font-bold',
  pelicula: 'bg-gradient-to-r from-blue-400 to-orange-400 text-white font-bold',
  normal: 'bg-gray-700 text-white font-bold',
}

const typeIcons: Record<string, string> = {
  estreno: '🆕',
  reprise: '🔁',
  retro: '⏳',
  maraton: '🔥',
  pelicula: '🎞️',
  normal: '📺',
}

type Programa = {
  id: string
  dia: string
  hora_inicio: string
  hora_fin: string
  programa: string
  tipo: string
}

// Calcula la fecha de cada día de la semana actual
function getWeekDates() {
  const today = new Date()
  const currentDay = today.getDay() || 7 // Domingo=7
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDay - 1))
  return days.map((day, idx) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + idx)
    return {
      day,
      date: date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    }
  })
}

const weekDates = getWeekDates()

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('Lunes')
  const [programas, setProgramas] = useState<Programa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fade, setFade] = useState(false)

  // Día actual para resaltar
  const todayIndex = new Date().getDay()
  const currentDay = todayIndex === 0 ? 'Domingo' : days[todayIndex - 1]

  useEffect(() => {
    async function fetchProgramas() {
      setLoading(true)
      const { data, error } = await supabase
        .from('programacion')
        .select('*')
        .order('hora_inicio')
      if (error) {
        setError('Error al cargar la programación')
      }
      setProgramas(data || [])
      setLoading(false)
    }
    fetchProgramas()
  }, [])

  // Transición suave entre días
  useEffect(() => {
    setFade(true)
    const timeout = setTimeout(() => setFade(false), 250)
    return () => clearTimeout(timeout)
  }, [activeDay])

  const programasDelDia = programas.filter(p => p.dia === activeDay)

  return (
    <section className="w-full max-w-4xl px-2 sm:px-6 py-8 bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl mb-8">
      <h2
        className="text-center font-extrabold mb-6 tracking-wide drop-shadow-lg"
        style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: 'white' }}
      >
        Programación Semanal
      </h2>
      {/* Tabs para seleccionar día */}
      <nav className="w-full flex justify-center mb-6" aria-label="Selector de día">
        <div className="flex gap-2 overflow-x-auto sm:overflow-x-visible scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {weekDates.map(({ day, date }) => (
            <button
              key={day}
              aria-label={`Ver programación de ${day}`}
              tabIndex={0}
              onClick={() => setActiveDay(day)}
              className={`
                flex flex-col items-center justify-center min-w-[90px] max-w-[120px] px-3 py-1
                rounded-lg font-medium transition-all duration-200
                ${activeDay === day
                  ? 'bg-gradient-to-r from-blue-500 to-orange-400 text-white shadow-md scale-105'
                  : 'bg-gray-800 text-gray-200 hover:bg-orange-400 hover:text-white'}
                ${currentDay === day ? 'ring-2 ring-orange-400' : ''}
                focus-visible:ring-4 focus-visible:ring-blue-400
              `}
              style={{ textAlign: 'center' }}
            >
              <span className="text-base mb-0.5" aria-hidden>📅</span>
              <span className="truncate text-[clamp(0.85rem,2vw,0.98rem)]">{day}</span>
              <span className="text-[0.72em] text-gray-300 font-normal">{date}</span>
            </button>
          ))}
        </div>
      </nav>
      {/* Tabla de programación */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
        <h3
          className="text-center font-bold mb-4 drop-shadow"
          style={{ color: '#60a5fa', fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}
        >
          <span className="mr-1" aria-hidden>📅</span>
          {activeDay}
        </h3>
        {error && (
          <div className="text-center text-red-500 py-2">{error}</div>
        )}
        <div className="w-full">
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-700 mb-2">
            <div className="col-span-4 sm:col-span-3 text-xs text-gray-400 text-center">
              <span className="mr-1" aria-hidden>⏰</span>Horario
            </div>
            <div className="col-span-5 sm:col-span-6 text-center text-xs text-gray-400">
              <span className="mr-1" aria-hidden>📺</span>Programa
            </div>
            <div className="col-span-3 text-left text-xs text-gray-400">
              <span className="mr-1" aria-hidden>🎞️</span>Tipo
            </div>
          </div>
          <ul
            className={`transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
            aria-live="polite"
          >
            {loading ? (
              <li className="text-center text-gray-500 py-8">Cargando...</li>
            ) : programasDelDia.length === 0 ? (
              <li className="text-center text-gray-500 py-8">Sin programación para este día.</li>
            ) : (
              programasDelDia.map(show => (
                <li
                  key={show.id}
                  tabIndex={0}
                  className="col-span-12 mb-4"
                >
                  <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-gray-800/80 rounded-xl shadow-lg p-4 transition-all duration-200 hover:scale-[1.01] hover:bg-gray-700 outline-none focus-visible:ring-4 focus-visible:ring-blue-400"
                    style={{
                      boxShadow: '0 4px 16px 0 rgba(0,0,0,0.15)',
                      fontSize: 'clamp(0.95rem, 2vw, 1.1rem)'
                    }}
                  >
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                      <span className="text-blue-300 text-base" aria-hidden>⏰</span>
                      <span className="font-mono text-blue-300">{show.hora_inicio} - {show.hora_fin}</span>
                    </div>
                    <div className="flex-1 text-center text-white font-semibold">{show.programa}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden>{typeIcons[show.tipo.toLowerCase()] || '📺'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shadow transition-all duration-200 ${typeStyles[show.tipo.toLowerCase()] || 'bg-gray-700 text-white'}`}>
                        {show.tipo.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}