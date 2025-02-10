import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import sanitizeHtml from 'sanitize-html'
import slugify from 'slugify'
import { FaHome, FaCopy, FaWhatsapp, FaTelegram, FaShareAlt, FaTimes } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import ImageCanvas from "../components/Lovecanva";
import Love from '../components/Love';
import AudioPlayer from "../components/AudioPlayer";


export default function GreetingPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [copyStatus, setCopyStatus] = useState({ text: 'Copy Text', url: 'Copy URL' })
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (name) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }, [name]);

  useEffect(() => {
    try {
      const cleanSlug = slugify(slug, {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
        strict: false
      })

      if (slug !== cleanSlug) {
        navigate(`/love/${cleanSlug}`, { replace: true })
        return
      }

      const rawName = cleanSlug.split('-').join(' ')
      const cleanName = sanitizeHtml(rawName)

      if (cleanName.length > 38) {
        throw new Error('Invalid input length')
      }

      setName(cleanName)
      setIsValid(true)
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 3000)
      return () => clearTimeout(timer)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setIsValid(false)
      navigate('/love/partner-name', { replace: true })
    }
  }, [slug, navigate])

  useEffect(() => {
    if (name) {
      document.title = `${name} காதலர் தின வாழ்த்துக்கள் 💖`
      document.querySelector('meta[name="description"]').setAttribute(
        'content',
        `A special காதலர் தின வாழ்த்துக்கள் 💖 for you ${name}.`
      )
      document.querySelector('link[rel="canonical"]').setAttribute('href', window.location.href)
    }
  }, [name])

  const validateInput = (input) => {
    const trimmed = input.trim()
    if (!trimmed) return 'Please enter a name to generate greeting'
    if (trimmed.length > 38) return 'Maximum 38 characters allowed'
    const wordCount = trimmed.split(/\s+/).filter(word => word).length
    if (wordCount > 38) return 'Maximum 38 words allowed'
    return ''
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserInput(value)
    setInputError(validateInput(value))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const error = validateInput(userInput)
    if (error) return setInputError(error)
    
    const formattedSlug = slugify(userInput.trim(), {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: false
    })
    navigate(`/love/${formattedSlug}`)
    setName(userInput.trim());
  }

  if (!isValid) return null;

  const imageURL = "/love.png";
  const overlayText = `${name}`;
  const shareURL = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`A special காதலர் தின வாழ்த்துக்கள் 💖 for you ${name}`);
  const WishText = `உன் விழிகள் பேசும் காதல் மொழியில் 🎧\nஎன் இதயம் எழுதி வைத்த கவிதை நீ 😍\nஉன் பெயரைச் சொன்னால் கூட 🎤\nஎன் இதயம் இசைபோல் ஒலிக்கிறது 🎵\nஉன் இதயத் தோட்டத்தில் நான் ஒரு நிலா ஒளி 🌹\nகாதலர் தினம் வாழ்த்துக்கள் என் உயிரே 💖✨`;
   const cleanWish = sanitizeHtml(WishText, { 
          allowedTags: [], 
          allowedAttributes: {},
          transformTags: { br: () => ({ tagName: 'br', attribs: {} }) }
        }).replace(/\n/g, '<br />')

  const handleCopy = async (type) => {
          try {
            if (type === 'text') {
              await navigator.clipboard.writeText(WishText)
              setCopyStatus(prev => ({ ...prev, text: '✅ Copied' }))
            } else {
              await navigator.clipboard.writeText(window.location.href)
              setCopyStatus(prev => ({ ...prev, url: '✅ Copied' }))
            }
      
            setTimeout(() => {
              setCopyStatus({ text: 'Copy Text', url: 'Copy URL' })
            }, 2000)
          // eslint-disable-next-line no-unused-vars
          } catch (error) {
            setCopyStatus({ text: 'Failed!', url: 'Failed!' })
          }
        }

  return (
    <>
      <div className="card mt-5 mb-4">
        <div className="card-content">
        {showSuccess && (
            <div className="notification is-success is-light">
              Greeting successfully updated ✨
            </div>
          )}
          <h1 className="is-size-4 mb-4 mt-4 shining-text">
              💜 காதலர் தின வாழ்த்துக்கள் 💜
          </h1>
          <AudioPlayer src="https://christmaswish.pages.dev/love.mp3" title="காதல் கவிதை 🎧" />
          <br />
          <p className="is-size-5 love-content shining-text">
              💕 {name}
          </p>
          <Love key={name} />
          {cleanWish && (
          <p className="wish-content has-text-dark" dangerouslySetInnerHTML={{ __html: cleanWish }} />
           )}
          <br />
          <ImageCanvas image={imageURL} text={overlayText} />
          <br /><hr />
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
              aria-label="Copy share URL"
            >
              <FaCopy />&nbsp;
              <span>{copyStatus.url}</span>
            </button>
          </div>
          <br />
          <form onSubmit={handleSubmit} className="mt-4" noValidate>
            <div className="field">
              <label htmlFor="partnerName" className="label has-text-dark">
                Enter Your Partner Name
                <span className="has-text-grey is-size-7"> (Max 38 words)</span>
              </label>
              <div className="control">
                <input
                  id="partnerName"
                  type="text"
                  className={`input ${inputError ? 'is-danger' : ''}`}
                  placeholder="Partner Name"
                  value={userInput}
                  onChange={handleInputChange}
                  aria-invalid={!!inputError}
                  aria-describedby="inputError"
                />
              </div>
              {inputError && (
                <p id="inputError" className="help is-danger">
                  {inputError}
                </p>
              )}
            </div>
            <div className="control">
              <button 
                type="submit" 
                className="button is-primary"
                disabled={!!inputError || !userInput.trim()}
              >
                <IoIosCreate size={15} />&nbsp; Create
              </button>
            </div>
          </form>
          <br />
          <br />
          <div className="buttons is-centered">
             <button 
                className="button is-link"
                onClick={() => navigate('/love/partner-name')}
              >
                <FaHome />
              </button>
          </div>
          <br />
        </div>
      </div>
      <div className={`floating-share-bar ${isOpen ? "open" : ""}`}>
        <button 
          className="toggle-button" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close share menu" : "Open share menu"}
        >
          {isOpen ? <FaTimes size={20} /> : <FaShareAlt size={20} />}
        </button>

        <div className="share-buttons">
          <a
            href={`https://api.whatsapp.com/send?text=${shareText} - ${shareURL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button is-success is-rounded"
            aria-label="Share via WhatsApp"
          >
            <FaWhatsapp size={22} />
          </a>
          <a
            href={`https://t.me/share/url?url=${shareURL}&text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="button is-info is-rounded"
            aria-label="Share via Telegram"
          >
            <FaTelegram size={22} />
          </a>
        </div>
      </div>
    </>
  )
}