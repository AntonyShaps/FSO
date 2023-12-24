import { useState } from 'react'

const App = (props) => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
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

const Filter = (props) => {
  return(
    <form>
    <div>
      filter shown with <input value = {props.filterName} onChange={props.handleFilterName} />
    </div>
  </form>
  )
}

const PeopleAdder = (props) => {
  return(
    <form onSubmit={props.addName}>
        <div>
          name: <input value={props.newName} onChange={props.handleNameChange} />
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">
            add
          </button>
        </div>
      </form>

  )
}

const Numbers = ({ persons, filterName }) => {
  return (
    <div>
      {persons
        .filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
        .map(person => (
          <div key={person.id}>{person.name} {person.number}</div>
        ))
      }
    </div>
  );
}

export default App
