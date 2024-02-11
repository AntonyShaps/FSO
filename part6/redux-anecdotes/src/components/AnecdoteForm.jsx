import { useDispatch } from 'react-redux'
import { showNotification, hideNotification } from './../reducers/notificationReducer';


import { createAnecdote } from './../reducers/anecdoteReducer'
const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdotes.value
        event.target.anecdotes.value = ''
        dispatch(createAnecdote(content))
        dispatch(showNotification(`Anecdote '${content}' added!`))
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