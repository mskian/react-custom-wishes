import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <section className="section">
        <div className="container">
          <Outlet />
        </div>
      </section>
    </>
  )
}