import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blogs from './Blogs'

beforeEach(() => {
  const user ={ 'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ…NWDcDpNwGvlg1_ZxE','username':'why','name':'why' }
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
})

test('renders content appropriately', () => {
  const blogs = [
    {
      'title': 'my name is',
      'author': 'slim shady',
      'url': 'no url',
      'likes': 5,
    },
  ]

  const mockHandler = jest.fn()
  const mockHandler2 =  jest.fn()
  const { container } = render(<Blogs blogs={blogs} addLikes ={mockHandler} removeBlog = {mockHandler2} />)
  const div = container.querySelector('.blogg')

  expect(div).toHaveTextContent(
    'slim shady'
  )
  expect(div).toHaveTextContent(
    'my name is'
  )
  expect(div).not.toHaveTextContent(
    'no url'
  )
  expect(div).not.toHaveTextContent(
    5
  )
})

test('renders content appropriately when button is clicked',async () => {
  const blogs = [
    {
      'title': 'my name is',
      'author': 'slim shady',
      'url': 'no url',
      'likes': 5,
    },
  ]

  const mockHandler = jest.fn()
  const mockHandler2 =  jest.fn()
  const { container } = render(<Blogs blogs={blogs} addLikes ={mockHandler} removeBlog = {mockHandler2} />)
  const div = container.querySelector('.blogg')

  const user = userEvent.setup()
  const button = screen.getByText('show')
  await user.click(button)

  expect(div).toHaveTextContent(
    'slim shady'
  )
  expect(div).toHaveTextContent(
    'my name is'
  )
  expect(div).toHaveTextContent(
    'no url'
  )
  expect(div).toHaveTextContent(
    5
  )
})

test('ensures that if the like button is clicked twice, component called twice',async () => {
  const blogs = [
    {
      'title': 'my name is',
      'author': 'slim shady',
      'url': 'no url',
      'likes': 5,
    },
  ]

  const mockHandler = jest.fn()
  const mockHandler2 =  jest.fn()
  const { container } = render(<Blogs blogs={blogs} addLikes ={mockHandler} removeBlog = {mockHandler2} />)
  const div = container.querySelector('.blogg')

  const user = userEvent.setup()
  const button1 = screen.getByText('show')
  await user.click(button1)
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})