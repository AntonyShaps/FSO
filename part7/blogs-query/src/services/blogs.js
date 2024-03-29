import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateLikes = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const addComment = async (id, commentText) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    { comment: commentText },
    config
  )
  return response.data
}

const getComments = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}
export default {
  getAll: getAll,
  create: create,
  setToken: setToken,
  updateLikes: updateLikes,
  deleteBlog: deleteBlog,
  addComment: addComment,
  getComments: getComments
}
