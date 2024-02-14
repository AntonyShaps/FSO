import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

const Blogs = ({ blogs }) => {
  const [visible, setVisible] = useState({})
  const queryClient = useQueryClient()

  const mutationAddLikes = useMutation({
    mutationFn: ({ id, updatedBlog }) =>
      blogService.updateLikes(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const mutationRemoveBlog = useMutation({
    mutationFn: (id) => blogService.deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const toggleVisibility = (id) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleLikes = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    mutationAddLikes.mutate({ id: blog.id, updatedBlog })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this blog?')) {
      mutationRemoveBlog.mutate(id)
    }
  }

  const name = JSON.parse(
    window.localStorage.getItem('loggedBlogappUser')
  )?.name

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      {blogs.map((blog) => {
        const isVisible = visible[blog.id]
        const isCreator = name === blog.user?.name
        return (
          <div key={blog.id} style={blogStyle} className="blog">
            <div>
              {blog.title} {blog.author}
            </div>
            <button onClick={() => toggleVisibility(blog.id)}>
              {isVisible ? 'Hide' : 'Show'}
            </button>
            {isVisible && (
              <div>
                <div>URL: {blog.url}</div>
                <div>
                  Likes: {blog.likes}
                  <button onClick={() => handleLikes(blog)}>Like</button>
                </div>
                <div>Posted by {blog.user?.name}</div>
                {isCreator && (
                  <button onClick={() => handleDelete(blog.id)}>Remove</button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

Blogs.propTypes = {
  blogs: PropTypes.array.isRequired
}

export default Blogs
