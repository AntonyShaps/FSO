import { createSlice } from "@reduxjs/toolkit"



const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    addVote(state, action) {
      const id = action.payload.id;
      const anecdoteToVote = state.find(anecdote => anecdote.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1;
      }
    },
    appendAnecdote(state,action) {
      state.push(action.payload)
    },
    setAnecdotes(state,action) {
      return action.payload
    }
  },
})



export const { createAnecdote, addVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer