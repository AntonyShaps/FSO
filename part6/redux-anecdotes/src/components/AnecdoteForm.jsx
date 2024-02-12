import { useDispatch } from 'react-redux'
import { showNotification, hideNotification } from './../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'


import { createAnecdote } from './../reducers/anecdoteReducer'
const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdotes.value
        event.target.anecdotes.value = ''
        const newAnecdote = await anecdoteService.createNew(content)
        console.log(typeof newAnecdote.content)
        dispatch(createAnecdote(newAnecdote))
        dispatch(showNotification(`Anecdote '${newAnecdote.content}' added!`))
        setTimeout(() => {
            dispatch(hideNotification())
        }, 5000)
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