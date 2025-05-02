import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const tipos = ['Retro', 'Estreno', 'Maraton', 'Reprise', 'Normal']
const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

type Programa = {
  id: string
  dia: string
  hora_inicio: string
  hora_fin: string
  programa: string
  tipo: string
}

const tipoColors: Record<string, string> = {
  estreno: 'bg-orange-500 text-white',
  reprise: 'bg-blue-400 text-white',
  retro: 'bg-white text-black font-bold border-2 border-orange-400',
  maraton: 'bg-gradient-to-r from-orange-400 to-blue-400 text-white font-bold',
  normal: 'bg-gray-300 text-black font-bold',
}

export default function Dashboard() {
  const [user, setUser] = useState<unknown | null>(null)
  const [loading, setLoading] = useState(true)
  const [programas, setProgramas] = useState<Programa[]>([])
  const [form, setForm] = useState<Programa>({
    id: '',
    dia: '',
    hora_inicio: '',
    hora_fin: '',
    programa: '',
    tipo: 'normal'
  })
  const [editMode, setEditMode] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

  useEffect(() => {
    if (user) fetchProgramas()
  }, [user])

  async function fetchProgramas() {
    const { data, error } = await supabase
      .from('programacion')
      .select('*')
      .order('dia')
      .order('hora_inicio')
    if (error) setError('Error al cargar la programación')
    setProgramas(data || [])
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const email = (e.target as HTMLFormElement).email.value
    const password = (e.target as HTMLFormElement).password.value
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Credenciales incorrectas')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleAddOrEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (editMode) {
      const { error } = await supabase.from('programacion').update({
        dia: form.dia,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        programa: form.programa,
        tipo: form.tipo
      }).eq('id', form.id)
      if (error) setError('Error al editar')
    } else {
      const { error } = await supabase.from('programacion').insert([{
        dia: form.dia,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        programa: form.programa,
        tipo: form.tipo
      }])
      if (error) setError('Error al agregar')
    }
    setForm({ id: '', dia: '', hora_inicio: '', hora_fin: '', programa: '', tipo: 'normal' })
    setEditMode(false)
    fetchProgramas()
  }

  async function handleDelete(id: string) {
    await supabase.from('programacion').delete().eq('id', id)
    fetchProgramas()
  }

  function handleEdit(prog: Programa) {
    setForm(prog)
    setEditMode(true)
  }

  function handleCancelEdit() {
    setForm({ id: '', dia: '', hora_inicio: '', hora_fin: '', programa: '', tipo: 'normal' })
    setEditMode(false)
  }

  if (loading) return <div className="text-white p-8">Cargando...</div>

  if (!user) {
    return (
      <div className="max-w-sm mx-auto mt-12 bg-gradient-to-br from-black via-gray-900 to-black p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Iniciar sesión</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3 mb-4">
          <input name="email" type="email" placeholder="Email" className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" required />
          <input name="password" type="password" placeholder="Contraseña" className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" required />
          <button className="bg-gradient-to-r from-blue-500 to-orange-400 text-white rounded py-2 font-bold shadow">Entrar</button>
        </form>
        {error && <div className="text-red-400 text-center">{error}</div>}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center py-8">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-lg">
            Dashboard de <span className="text-blue-400">Programación</span>
          </h2>
          <button onClick={handleLogout} className="bg-gradient-to-r from-orange-400 to-blue-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition">Cerrar sesión</button>
        </div>
        <form onSubmit={handleAddOrEdit} className="flex flex-wrap gap-2 mb-8 items-end">
          <select
            required
            className="border border-gray-700 bg-gray-900 text-white rounded px-2 py-1"
            value={form.dia}
            onChange={e => setForm(f => ({ ...f, dia: e.target.value }))}
          >
            <option value="">Día</option>
            {dias.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {/* Contenedor para hora de inicio y fin */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex flex-col">
              <label className="text-xs text-white mb-1">Inicio</label>
              <input
                required
                type="time"
                className="border border-gray-700 bg-gray-900 text-white rounded px-2 py-1"
                style={{ accentColor: '#ff8c00' }} 
                value={form.hora_inicio}
                onChange={e => setForm(f => ({ ...f, hora_inicio: e.target.value }))}
                placeholder="Hora inicio"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-white mb-1">Fin</label>
              <input
                required
                type="time"
                className="border border-gray-700 bg-gray-900 text-white rounded px-2 py-1"
                value={form.hora_fin}
                onChange={e => setForm(f => ({ ...f, hora_fin: e.target.value }))}
                placeholder="Hora fin"
              />
            </div>
          </div>
          <input
            required
            className="border border-gray-700 bg-gray-900 text-white rounded px-2 py-1"
            value={form.programa}
            onChange={e => setForm(f => ({ ...f, programa: e.target.value }))}
            placeholder="Programa"
          />
          <select
            required
            className="border border-gray-700 bg-gray-900 text-white rounded px-2 py-1"
            value={form.tipo}
            onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
          >
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className="bg-gradient-to-r from-blue-500 to-orange-400 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition">
            {editMode ? 'Editar' : 'Agregar'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-600 text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition"
            >
              Cancelar
            </button>
          )}
        </form>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="overflow-x-auto">
          {programas.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No hay programación registrada.</div>
          ) : (
            <table className="w-full text-left rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-orange-400">
                  <th className="p-3 font-bold">Día</th>
                  <th className="p-3 font-bold">Inicio</th>
                  <th className="p-3 font-bold">Fin</th>
                  <th className="p-3 font-bold">Programa</th>
                  <th className="p-3 font-bold">Tipo</th>
                  <th className="p-3 font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programas.map(prog => (
                  <tr key={prog.id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="p-3 text-white">{prog.dia}</td>
                    <td className="p-3 text-blue-300 font-mono">{prog.hora_inicio}</td>
                    <td className="p-3 text-blue-300 font-mono">{prog.hora_fin}</td>
                    <td className="p-3 text-white font-semibold">{prog.programa}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${tipoColors[prog.tipo] || 'bg-gray-300 text-black'}`}>
                        {prog.tipo.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => handleEdit(prog)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full font-bold shadow transition">Editar</button>
                      <button onClick={() => handleDelete(prog.id)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full font-bold shadow transition">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}