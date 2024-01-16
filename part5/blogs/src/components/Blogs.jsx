import { useState } from 'react'
import PropTypes from 'prop-types'

const Blogs = ({ blogs, addLikes, removeBlog }) => {
  const [visible, setVisible] = useState({})
  const toggleVisibility = (id) => {

    setVisible({
      ...visible,
      [id]: !visible[id]
    })
  }
  const handleLikes = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    addLikes(blog.id, updatedBlog)
  }
  const handleDelete = (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      removeBlog(blog.id)
    }
  }
  const name = JSON.parse(window.localStorage.getItem('loggedBlogappUser')).name

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div>
      {blogs.map(blog => {
        const isVisible = visible[blog.id]
        const isCreator = name === blog.name
        return (
          <div key={blog.id} style={blogStyle} className='blogg'>
            {blog.title} {blog.author}
            <button onClick={() => toggleVisibility(blog.id)}>
              {isVisible ? 'hide' : 'show'}
            </button>
            <br />
            {isVisible && (
              <div>
                <div></div>
                <div>{blog.url}</div>
                <div>{blog.likes}<button onClick={() => handleLikes(blog)}>like</button></div>
                <div>{blog.name}</div>
                {isCreator && <button onClick={() => handleDelete(blog)}>remove</button>}
              </div>
            )}
            <p></p>
          </div>
        )
      })}
    </div>
  )
}


Blogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  addLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
}


export default Blogs