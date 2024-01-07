import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Blogs from './components/Blogs'
import BlogAdder from './components/BlogAdder'
import './App.css'


const App = () => {

  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)
  const handleTitleChange = (event) => {setNewTitle(event.target.value)}
  const handleAuthorChange = (event) => {setNewAuthor(event.target.value)}
  const handleUrlChange = (event) => {setNewUrl(event.target.value)}
  const handleLikesChange = (event) => {setNewLikes(event.target.value)}
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
      .then(response=> {
        setBlogs(blogs.concat(response.data))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes(0)
      })
  }
  useEffect(() => {
    blogService
      .getAll()
      .then(response=> {
        setBlogs(response.data)
      })
  },[])



  return (
    <div>
      <h1>Blogs</h1>
      <BlogAdder
      addBlog={addBlog}
        newTitle={newTitle} handleTitleChange={handleTitleChange}
        newAuthor={newAuthor} handleAuthorChange={handleAuthorChange}
        newUrl={newUrl} handleUrlChange={handleUrlChange}
        newLikes={newLikes} handleLikesChange={handleLikesChange}
      />
      <Blogs blogs = {blogs}/>
    </div>
  )
}

export default App