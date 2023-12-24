import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import Numbers from './components/Numbers'
import PeopleAdder from './components/PeopleAdder'

const App = (props) => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'notes')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilterName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    const nameExists = persons.some(person => person.name === newName)
    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {setNewName(event.target.value)}
  const handleNumberChange = (event) => {setNewNumber(event.target.value)}
  const handleFilterName = (event) => {setNewFilterName(event.target.value.toLowerCase())}

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter filterName={filterName} handleFilterName={handleFilterName} />
      <h2>add a new</h2>
        <PeopleAdder addName={addName} newName={newName} handleNameChange={handleNameChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
        <Numbers persons={persons} filterName={filterName}/>
    </div>
  )
}


export default App
