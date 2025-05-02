import './App.css'
import Schedule from './Schedule'
import logo from './assets/logo.jpeg'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center py-8">
      <header className="w-full flex flex-col items-center py-8 mb-4">
        <img
          src={logo}
          alt="Animas Logo"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl border-4 border-orange-400 bg-black"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-widest drop-shadow-lg">
          <span className="text-blue-400">ANIMA</span>
          <span className="text-orange-400">A</span>
          <span className="text-blue-400">S</span>
        </h1>
      </header>
      <Schedule />
    </div>
  )
}

export default App
