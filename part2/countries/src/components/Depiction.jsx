
const Depiction = ({ countries, filterName }) => {
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(filterName.toLowerCase())
  )

  if (filteredCountries.length > 10) {
    return <div>Please be more specific in your search.</div>
  } else if (filteredCountries.length === 1) {
    return (
      <div>
        {filteredCountries.map(country => (
          <div key={country.name.common}>
            <h1>{country.name.common}</h1>
            <div>capital {country.capital}</div>
            <div>area {country.area}</div>
            <h2>languages:</h2>
            <ul>
            {Object.entries(country.languages).map(([key, language]) => (
              <li key={key}>{language}</li>))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div>
        {filteredCountries.map(country => (
          <div key={country.name.common}>
            {country.name.common}
          </div>
        ))}
      </div>
    )
  }
}

export default Depiction

