import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blogs from './components/Blogs'
import BlogAdder from './components/BlogAdder'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './App.css'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [errorMessage, setErrorMessage] = useState(null)
  
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
  }
  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedNote=> {
        setBlogs(blogs.concat(returnedNote))
        setErrorMessage(`a new blog ${returnedNote.title} by ${returnedNote.author} added`)
        setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      })
  }
  useEffect(() => {
    blogService
      .getAll()
      .then(initialNotes=> {
        setBlogs(initialNotes)
      })
  },[])

  const blogAdder = () => (
    <Togglable buttonLabel="new blog">
      <BlogAdder createBlog={addBlog} />
    </Togglable>
    )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />
      {user === null && loginForm()}
      {user && <div>
       <div>{user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
        {blogAdder()}
       </div>
        <Blogs blogs={blogs}/>
      </div>
    }
      
    </div>
  )
}

export default App