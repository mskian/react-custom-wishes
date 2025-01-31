import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="hero is-fullheight">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-3 has-text-white">404</h1>
          <p className="subtitle has-text-white">Page not found or invalid parameters</p>
          <button 
            className="button is-warning"
            onClick={() => navigate('/')}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  )
}