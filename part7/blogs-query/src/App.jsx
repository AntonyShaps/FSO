import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import loginService from './services/login'
import Blogs from './components/Blogs'
import BlogAdder from './components/BlogAdder'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './App.css'
import { Table } from 'react-bootstrap'
import { useNotificationDispatch } from './NotificationContext'
import userService from './services/users'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
  useParams
} from 'react-router-dom'
import queryString from 'query-string'

const Blogsview = ({ blogs, user, handleLogout }) => {
  const navigate = useNavigate()
  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)
  const name = JSON.parse(
    window.localStorage.getItem('loggedBlogappUser')
  )?.name
  const isCreator = name === blog.user?.name
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
      queryClient.invalidateQueries(['blogs']), navigate('/')
    }
  })
  const handleLikes = (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    mutationAddLikes.mutate({ id: blog.id, updatedBlog })
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this blog?')) {
      mutationRemoveBlog.mutate(id)
    }
  }
  const [comment, setComment] = useState('')

  const mutationAddComment = useMutation({
    mutationFn: (newComment) => blogService.addComment(blog.id, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      setComment('')
    }
  })

  const submitComment = (event) => {
    event.preventDefault()
    mutationAddComment.mutate(comment)
  }
  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />
      <h2>
        {blog.title} {blog.author}
      </h2>
      <br />
      {blog.url}
      <br />
      <div>
        Likes: {blog.likes}
        <button onClick={() => handleLikes(blog)}>Like</button>
      </div>
      <div>Posted by {blog.user?.name}</div>
      {isCreator && (
        <button onClick={() => handleDelete(blog.id)}>Remove</button>
      )}
      <div>
        <div>
          <h3>Comments</h3>
          <form onSubmit={submitComment}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <button type="submit">Post Comment</button>
          </form>
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
const Users = ({ user, handleLogout }) => {
  const {
    data: users,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  if (isLoading) return <div>Loading users...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />
      <h3>Users</h3>
      <Table striped>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link
                  to={`/userblogs?username=${encodeURIComponent(user.name)}`}
                >
                  {user.name}
                </Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
const Userblogs = () => {
  const location = useLocation()
  const { username } = queryString.parse(location.search)

  const {
    data: users,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })

  const decodedUsername = decodeURIComponent(username)
  const user = users?.find((u) => u.name === decodedUsername)

  if (isLoading) return <div>Loading user blogs...</div>
  if (isError) return <div>Error: {error.message}</div>
  if (!user) return <div>User not found.</div>

  return (
    <div>
      <h2>Blogs added by {user.name}</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const Main = ({ handleLogout, user, addBlogMutation, blogs }) => {
  return (
    <div>
      <Menu user={user} handleLogout={handleLogout} />
      <Notification />
      <h1>Blogs</h1>
      <Togglable buttonLabel="new blog">
        <BlogAdder
          createBlog={(blogObject) => addBlogMutation.mutate(blogObject)}
        />
      </Togglable>
      <Blogs blogs={blogs || []} />
    </div>
  )
}

const Login = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword
}) => {
  return (
    <form onSubmit={handleLogin}>
      <Notification />
      <h1>Blogs</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          name="Username"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          name="Password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <a href="/" style={padding}>
        blogs
      </a>
      <a href="/users" style={padding}>
        users
      </a>
      {user.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  )
  const navigate = useNavigate()
  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  const {
    isLoading,
    isError,
    error,
    data: blogs
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll
  })

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
    },
    onError: (error) => {
      dispatch({
        type: 'showNotification',
        payload: 'Wrong username or password'
      })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 1000)
    }
  })

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      dispatch({ type: 'showNotification', payload: 'Blog added successfully' })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 1000)
    },
    onError: (error) => {
      dispatch({
        type: 'showNotification',
        payload: `Failed to add blog: ${error.message}`
      })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 1000)
    }
  })

  const handleLogin = (event) => {
    event.preventDefault()
    loginMutation.mutate({ username, password })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    navigate('/login')
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      <div>
        <Link to="/blogs"></Link>
        <Link to="/users"></Link>
        <Link to="/login"></Link>
        <Link to="/"></Link>
      </div>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <Blogsview blogs={blogs} user={user} handleLogout={handleLogout} />
          }
        />
        <Route path="/userblogs" element={<Userblogs />} />
        <Route
          path="/"
          element={
            <Main
              handleLogout={handleLogout}
              user={user}
              addBlogMutation={addBlogMutation}
              blogs={blogs}
            />
          }
        />
        <Route
          path="/users"
          element={
            user ? (
              <Users user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
