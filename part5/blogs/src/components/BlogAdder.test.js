import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogAdder from './BlogAdder'


beforeEach(() => {
  const user ={ 'token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ…NWDcDpNwGvlg1_ZxE','username':'why','name':'why' }
  window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
})

test('<BlogAdder /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogAdder createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'Hello')
  await user.type(inputs[1], 'my name is')
  await user.type(inputs[2], 'slim shady')
  await user.type(inputs[3], '3')
  const button = screen.getByText('save')
  await user.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Hello')
  expect(createBlog.mock.calls[0][0].author).toBe('my name is')
  expect(createBlog.mock.calls[0][0].url).toBe('slim shady')
  expect(createBlog.mock.calls[0][0].likes).toBe(3)
})