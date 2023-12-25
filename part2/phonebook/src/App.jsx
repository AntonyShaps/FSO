import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Filter from './components/Filter'
import Numbers from './components/Numbers'
import PeopleAdder from './components/PeopleAdder'
import Notification from './components/Notification'

const App = (props) => {
  const [persons, setPersons] = useState([])
  useEffect(() =>{
    personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  },[])
  console.log('render', persons.length, 'persons')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilterName] = useState('')
  const [completeMessage, setCompleteMessage] = useState(null)
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const nameExists = persons.find(person => person.name === newName)
    if (nameExists) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`))
      {
        personService
        .update(nameExists.id, nameObject)
        .then(returnedName => {
          setPersons(persons.map(person => person.id !== nameExists.id ? person : returnedName))
          setNewName('')
          setNewNumber('')
          setCompleteMessage(
            `Updated ${nameExists.name}`
          )
          setTimeout(() => {
            setCompleteMessage(null)
          }, 5000)
        })
        .catch(error => {
          setCompleteMessage(`Information of ${nameExists.name} has already been removed from server`)
          setTimeout(() => {
            setCompleteMessage(null)
          }, 5000)
          setPersons(persons.filter(person=>person.name !==nameExists.name))
          setNewName('')
          setNewNumber('')
        })
      }
    } else {
      personService
      .create(nameObject)
      .then(returnedName => {
        setPersons(persons.concat(returnedName))
        setNewName('')
        setNewNumber('')
        setCompleteMessage(
          `Added ${nameObject.name}`
        )
        setTimeout(() => {
          setCompleteMessage(null)
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {setNewName(event.target.value)}
  const handleNumberChange = (event) => {setNewNumber(event.target.value)}
  const handleFilterName = (event) => {setNewFilterName(event.target.value.toLowerCase())}
  const removeName = id =>{
    const person = persons.find(n => n.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })    
  }}
  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={completeMessage} />
        <Filter filterName={filterName} handleFilterName={handleFilterName} />
      <h2>add a new</h2>
        <PeopleAdder addName={addName} newName={newName} handleNameChange={handleNameChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
        <Numbers persons={persons} filterName={filterName} removeName={removeName}/>
    </div>
  )
}


export default App
