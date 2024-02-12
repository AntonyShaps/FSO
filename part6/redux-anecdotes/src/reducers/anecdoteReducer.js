import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'



const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    chVote(state, action) {
      const id = action.payload.id
      const changedAnecdote = action.payload
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : changedAnecdote
      )
    },
    appendAnecdote(state,action) {
      state.push(action.payload)
    },
    setAnecdotes(state,action) {
      return action.payload
    }
  },
})



export const { chVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}
export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = id => {
  return async dispatch => {
    const newVote = await anecdoteService.changeVote(id)
    dispatch(chVote(newVote))
  }
}

export default anecdoteSlice.reducer