import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blogs from './components/Blogs'
import BlogAdder from './components/BlogAdder'
import Notification from './components/Notification'
import './App.css'


const App = () => {

  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)
  const [errorMessage, setErrorMessage] = useState(null)
  const handleTitleChange = (event) => {setNewTitle(event.target.value)}
  const handleAuthorChange = (event) => {setNewAuthor(event.target.value)}
  const handleUrlChange = (event) => {setNewUrl(event.target.value)}
  const handleLikesChange = (event) => {setNewLikes(event.target.value)}
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const addBlog = event => {
    event.preventDefault()
    const blogObject = {
      "title": newTitle,
      "author": newAuthor,
      "url": newUrl,
      "likes": Number(newLikes)
    }
    blogService
      .create(blogObject)
      .then(returnedNote=> {
        setBlogs(blogs.concat(returnedNote))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes(0)
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
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
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




  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage} />
      {user === null && loginForm()}
      {user && <div>
       <p>{user.name} logged in
        <button onClick={handleLogout}>
          logout
        </button>
       </p>
         
         <BlogAdder
          addBlog={addBlog}
          newTitle={newTitle} handleTitleChange={handleTitleChange}
          newAuthor={newAuthor} handleAuthorChange={handleAuthorChange}
          newUrl={newUrl} handleUrlChange={handleUrlChange}
          newLikes={newLikes} handleLikesChange={handleLikesChange}
        />
          <Blogs blogs = {blogs}/>
      </div>
    }
      
    </div>
  )
}

export default App