import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import sanitizeHtml from 'sanitize-html'
import slugify from 'slugify'
import { getGreetingType } from './utils'
import { FaCopy } from 'react-icons/fa'
import { FaSun, FaMoon, FaStar, FaCloudSun, FaHome } from 'react-icons/fa'

export default function GreetingPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [copyStatus, setCopyStatus] = useState({ text: 'Copy Text', url: 'Copy URL' })

  useEffect(() => {
    try {
      const cleanSlug = slugify(slug, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: false
      })

      if (slug !== cleanSlug) {
        const rawWish = searchParams.get('wish') || ''
        navigate(`/wish/${cleanSlug}?wish=${encodeURIComponent(rawWish)}`, { replace: true })
        return
      }

      const rawName = cleanSlug.split('-').join(' ')
      const cleanName = sanitizeHtml(rawName)
      const rawWish = searchParams.get('wish') || ''
      const decodedWish = decodeURIComponent(rawWish)
      const cleanWish = sanitizeHtml(decodedWish, { 
        allowedTags: [], 
        allowedAttributes: {},
        transformTags: { br: () => ({ tagName: 'br', attribs: {} }) }
      }).replace(/\n/g, '<br />')

      if (cleanName.length > 38 || decodedWish.length > 300) {
        throw new Error('Invalid input length')
      }

      setName(cleanName)
      setWish(cleanWish)
      setIsValid(true)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setIsValid(false)
      navigate('/error', { replace: true })
    }
  }, [slug, searchParams, navigate])

  useEffect(() => {
    if (name && wish) {
      document.title = `${name}'s Greeting - Happy Wishes!`
      document.querySelector('meta[name="description"]').setAttribute(
        'content',
        `A special greeting for ${name}: ${wish.slice(0, 150)}...`
      )
      document.querySelector('link[rel="canonical"]').setAttribute('href', window.location.href)
    }
  }, [name, wish])

  const handleCopy = async (type) => {
    try {
      if (type === 'text') {
        const text = decodeURIComponent(searchParams.get('wish') || '').replace(/<br\s*\/?>/gi, '\n')
        await navigator.clipboard.writeText(text)
        setCopyStatus(prev => ({ ...prev, text: 'Copied!' }))
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopyStatus(prev => ({ ...prev, url: 'Copied!' }))
      }

      setTimeout(() => {
        setCopyStatus({ text: 'Copy Text', url: 'Copy URL' })
      }, 2000)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setCopyStatus({ text: 'Failed!', url: 'Failed!' })
    }
  }

  if (!isValid) return null

  const icons = {
    morning: <FaSun className="icon mr-2" />,
    afternoon: <FaCloudSun className="icon mr-2" />,
    evening: <FaStar className="icon mr-2" />,
    night: <FaMoon className="icon mr-2" />,
  }

  const { type, currentTime } = getGreetingType()

  const colors = {
    morning: 'is-warning',
    noon: 'is-info',
    evening: 'is-primary',
    night: 'is-dark'
  }

  return (
    <div className={`card mt-5 mb-4 ${colors[type]}`}>
      <div className="card-content">
        <h1 className="title is-4 mb-4 mt-4">
          {icons[type]} <br /><br />
          Good {type}, {name}
        </h1>
        <p className="subtitle is-6">
          🕒 Current Time: {currentTime} (IST)
        </p>

        {wish && (
          <p className="wish-content has-text-dark" dangerouslySetInnerHTML={{ __html: wish }} />
        )}
        <hr />
        <div className="field is-grouped">
          <button
            className="button is-warning"
            onClick={() => handleCopy('text')}
            type="button"
          >
            <FaCopy />&nbsp;
            <span>{copyStatus.text}</span>
          </button>
          <button
            className="button is-info"
            onClick={() => handleCopy('url')}
            type="button"
          >
            <FaCopy />&nbsp;
            <span>{copyStatus.url}</span>
          </button>
        </div>
        <br />
        <div className="buttons is-centered">
          <button 
            className="button is-link"
            onClick={() => navigate('/')}
          >
            <FaHome />
          </button>
        </div>
      </div>
    </div>
  )
}
