import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import slugify from 'slugify'
import sanitizeHtml from 'sanitize-html'

export default function HomePage() {
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const newErrors = {}

    if (name.trim() === '') newErrors.name = 'Name is required'
    else if (name.length > 38) newErrors.name = 'Name must be ≤38 characters'

    if (wish.trim() === '') newErrors.wish = 'Wish is required'
    else if (wish.length > 300) newErrors.wish = 'Wish must be ≤300 characters'

    setErrors(newErrors)
  }, [name, wish])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (Object.keys(errors).length > 0) return

    const cleanName = sanitizeHtml(name)
    const cleanWish = sanitizeHtml(wish, {
      allowedTags: ['br'],
      allowedAttributes: {},
      nonTextTags: ['br'],
    })

    const slug = slugify(cleanName, {
      replacement: '-',
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: false,
    })

    const encodedWish = encodeURIComponent(cleanWish.replace(/\n/g, '%0A'))

    navigate(`/wish/${slug}?wish=${encodedWish}`)
  }

  return (
    <div className="card">
      <div className="card-content">
        <h2 className="title is-4 mb-5 mt-4">Create Your Greeting ✨</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label has-text-dark">Name</label>
            <div className="control">
              <input
                className={`input ${errors.name ? 'is-danger' : ''}`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={38}
                placeholder="Enter name (max 38 chars)"
              />
            </div>
            <p className="help is-danger">{errors.name}</p>
            <p className="help">{name.length}/38</p>
          </div>

          <div className="field">
            <label className="label has-text-dark">Custom Wish</label>
            <div className="control">
              <textarea
                className={`textarea ${errors.wish ? 'is-danger' : ''}`}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                maxLength={300}
                placeholder="Enter your custom wish (max 300 chars)"
                rows={10}
              />
            </div>
            <p className="help is-danger">{errors.wish}</p>
            <p className="help">{wish.length}/300</p>
          </div>

          <div className="field">
            <div className="control">
              <button type="submit" className="button is-warning">
                Generate Greeting
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
