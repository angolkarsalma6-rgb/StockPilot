import { Routes, Route } from 'react-router-dom'

function Dashboard() { return <h1>Dashboard</h1> }
function Products() { return <h1>Products</h1> }
function Sales() { return <h1>Sales</h1> }
function Alerts() { return <h1>Alerts</h1> }
function Login() { return <h1>Login</h1> }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/alerts" element={<Alerts />} />
    </Routes>
  )
}