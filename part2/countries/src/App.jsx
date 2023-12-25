import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import Depiction from './components/Depiction'
import Filter from './components/Filter'

function App() {
  const [countries, setCountries] = useState([])
  const [filterName, setNewFilterName] = useState('')
  const handleFilterName = (event) => {setNewFilterName(event.target.value.toLowerCase())}


  useEffect(() =>{
    countriesService
    .getAll()
    .then(allCountries => {
      setCountries(allCountries)
    })
  },[])

  return (
    <>
      <Filter filterName={filterName} handleFilterName={handleFilterName} />
      <Depiction filterName={filterName} countries={countries} />
    </>
  )
}

export default App
