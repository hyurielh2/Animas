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
  normal: 'bg-gray-700 text-white font-bold', // actualizado el estilo para "NORMAL"
}

type Programa = {
  id: string
  dia: string
  hora_inicio: string
  hora_fin: string
  programa: string
  tipo: string
}

export default function Schedule() {
  const [activeDay, setActiveDay] = useState('Lunes')
  const [programas, setProgramas] = useState<Programa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Obtén el día actual para resaltar en la lista de días
  const todayIndex = new Date().getDay() // 0 es domingo en JS
  // Convertirlo a nuestro array (y considerar que nuestro array comienza en Lunes):
  // Si hoy es domingo (0), lo consideramos como "Domingo"
  const currentDay = todayIndex === 0 ? 'Domingo' : days[todayIndex - 1]

  useEffect(() => {
    async function fetchProgramas() {
      setLoading(true)
      const { data, error } = await supabase
        .from('programacion')
        .select('*')
        .order('hora_inicio')
      if (error) {
        console.error("Error al cargar la programación", error)
        setError('Error al cargar la programación')
      }
      setProgramas(data || [])
      setLoading(false)
    }
    fetchProgramas()
  }, [])

  const programasDelDia = programas.filter(p => p.dia === activeDay)

  return (
    <section className="w-full max-w-4xl px-2 sm:px-6 py-8 bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl mb-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 text-center tracking-wide drop-shadow-lg">
        Programación Semanal
      </h2>
      {/* Tabs para seleccionar día */}
      <div className="w-full flex justify-center mb-6">
        <div className="flex gap-2 overflow-x-auto sm:overflow-x-visible transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`min-w-[80px] px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200
                ${activeDay === day
                  ? 'bg-gradient-to-r from-blue-400 to-orange-400 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-200 hover:bg-orange-400 hover:text-white'} 
                ${currentDay === day ? 'ring-2 ring-orange-400' : ''}
              `}
              style={{ textAlign: 'center' }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      {/* Tabla de programación */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-4 sm:p-6 shadow-lg border border-gray-700">
        <h3 className="text-base sm:text-xl font-bold text-blue-400 mb-4 text-center drop-shadow">
          {activeDay}
        </h3>
        <div className="w-full">
          <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-700 mb-2">
            <div className="col-span-4 sm:col-span-3 text-xs text-gray-400 text-center">Horario</div>
            <div className="col-span-5 sm:col-span-6 text-center text-xs text-gray-400">Programa</div>
            <div className="col-span-3 text-left text-xs text-gray-400">Tipo</div>
          </div>
          {error && <div className="text-center text-red-500 py-4">{error}</div>}
          <ul>
            {loading ? (
              <li className="text-center text-gray-500 py-8">Cargando...</li>
            ) : programasDelDia.length === 0 ? (
              <li className="text-center text-gray-500 py-8">Sin programación para este día.</li>
            ) : (
              programasDelDia.map(show => (
                <li
                  key={show.id}
                  className="grid grid-cols-12 gap-2 items-center mb-2 p-2 rounded-lg transition-all duration-200 hover:scale-[1.01] hover:bg-gray-700"
                >
                  <div className="col-span-4 sm:col-span-3 text-xs sm:text-sm text-blue-300 font-mono text-center">
                    {show.hora_inicio} - {show.hora_fin}
                  </div>
                  <div className="col-span-5 sm:col-span-6 text-xs sm:text-base text-white font-semibold text-center">
                    {show.programa}
                  </div>
                  <div className="col-span-3 flex items-center justify-start">
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow ${typeStyles[show.tipo.toLowerCase()] || 'bg-gray-700 text-white'}`}>
                      {show.tipo.toUpperCase()}
                    </span>
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