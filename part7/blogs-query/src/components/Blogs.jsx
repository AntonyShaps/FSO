import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom'

const Blogs = ({ blogs }) => {
  const [visible, setVisible] = useState({})

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
        const isCreator = name === blog.user?.name
        return (
          <div key={blog.id} style={blogStyle} className="blog">
            <div>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} {blog.author}
              </Link>
            </div>
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
