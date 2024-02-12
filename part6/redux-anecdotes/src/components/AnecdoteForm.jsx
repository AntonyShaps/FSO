import { useDispatch } from 'react-redux'
import { setNotification } from "../reducers/notificationReducer"
import { createAnecdote } from './../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdotes.value
        event.target.anecdotes.value = ''
        dispatch(createAnecdote(content))
        dispatch(setNotification(`You added "${content}"!`, 5))
      }


    return(
    <div>
    <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdotes' /></div>
        <button type='submit'>create</button>
      </form>        
    </div>
    )
}

export default AnecdoteForm