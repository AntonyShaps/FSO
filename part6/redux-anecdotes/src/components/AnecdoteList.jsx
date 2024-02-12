import { useSelector, useDispatch } from 'react-redux'

import { addVote } from './../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
    
    const dispatch = useDispatch()
    const anecdotes = useSelector(state =>{
      if (state.filterr === null) {
        return state.anecdotes.sort((a, b) => b.votes - a.votes)
      } else {
        return state.anecdotes.filter((anecdote) =>
        anecdote.content.toLowerCase().includes(state.filterr.toLowerCase())).sort((a,b) => b.votes - a.votes)
      }
      })
  

    const vote = (id) => {
        const anecdote = anecdotes.find(anecdote => anecdote.id === id)
        dispatch(addVote(id))
        dispatch(setNotification(`You voted for "${anecdote.content}" !`, 5))
    }

    return (
    <div>
        {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
    )
}

export default AnecdoteList