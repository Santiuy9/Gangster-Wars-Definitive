import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-around text-white">
        <li><Link to="/misiones" className="hover:text-gray-300">Misiones</Link></li>
        <li><Link to="/negocios" className="hover:text-gray-300">Negocios</Link></li>
        <li><Link to="/tienda" className="hover:text-gray-300">Tienda</Link></li>
        <li><Link to="/pandilla" className="hover:text-gray-300">Pandilla</Link></li>
        <li><Link to="/equipo" className="hover:text-gray-300">Equipo</Link></li>
      </ul>
    </nav>
  )
}