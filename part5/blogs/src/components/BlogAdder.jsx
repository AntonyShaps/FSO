import { useState } from 'react'
const BlogAdder = ({ createBlog }) => {

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
    const name = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).name

    createBlog({
      'title': newTitle,
      'author': newAuthor,
      'url': newUrl,
      'likes': Number(newLikes),
      'name' : name
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setNewLikes(0)
  }

  return(
    <form onSubmit={addBlog}>
      <h3>create new blog</h3>
      <div>
            title: <input id='title' value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
            author: <input id ='author' value={newAuthor} onChange={handleAuthorChange}/>
      </div>
      <div>
            url: <input id='url' value={newUrl} onChange={handleUrlChange}/>
      </div>
      <div>
            likes: <input value={newLikes} onChange={handleLikesChange}/>
      </div>
      <div>
        <button type="submit">
              save
        </button>
      </div>
    </form>

  )
}

export default BlogAdder