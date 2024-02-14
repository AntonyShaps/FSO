import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import loginService from './services/login'
import Blogs from './components/Blogs'
import BlogAdder from './components/BlogAdder'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './App.css'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(
    JSON.parse(window.localStorage.getItem('loggedBlogappUser'))
  )

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
      dispatch({ type: 'showNotification', payload: 'Logged in successfully' })
      setTimeout(() => {
        dispatch({ type: 'hideNotification' })
      }, 1000)
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
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />
      {user ? (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new blog">
            <BlogAdder
              createBlog={(blogObject) => addBlogMutation.mutate(blogObject)}
            />
          </Togglable>
          <Blogs blogs={blogs || []} />
        </div>
      ) : (
        <form onSubmit={handleLogin}>
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
      )}
    </div>
  )
}

export default App
