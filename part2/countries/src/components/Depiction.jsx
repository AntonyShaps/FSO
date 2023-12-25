import { useState, useEffect } from 'react'
import countriesService from '../services/countries'


const api_key = import.meta.env.VITE_SOME_KEY

const Depiction = ({ countries, filterName }) => {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [lastFetchedCountry, setLastFetchedCountry] = useState(null)
  const filteredCountries = countries.filter(country => 
    country.name.common.toLowerCase().includes(filterName.toLowerCase())
  )
  
  useEffect(() => {
    setSelectedCountry(null)
    setWeather(null)
  }, [filterName])
  
  useEffect(() => {
    const countryToShow = selectedCountry || (filteredCountries.length === 1 ? filteredCountries[0] : null);

    if (countryToShow && countryToShow !== lastFetchedCountry) {
      setLastFetchedCountry(countryToShow);
      countriesService
        .getWeather(countryToShow.capital, api_key)
        .then(weatherData => {
          setWeather(weatherData);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
          setWeather(null);
        });
    }
  }, [selectedCountry, filteredCountries, lastFetchedCountry]);

  const show = (country) => {
    setSelectedCountry(country)
  }
  


  if (filteredCountries.length > 10) {
    return <div>Please be more specific in your search.</div>
  } else if (filteredCountries.length === 1 || selectedCountry) {
    const country = selectedCountry || filteredCountries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <h2>languages:</h2>
        <ul>
          {Object.entries(country.languages).map(([key, language]) => (
            <li key={key}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
        <h2>Weather in {country.capital}</h2>
        {weather && (
          <div>
            <div>Temperature: {weather.main.temp} Celsius</div>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather in capital of ${country.name.common}`} />
            <div>Wind: {weather.wind.speed} m/s</div>
          </div>
        )}
      </div>
    )
    
  } else {
    return (
      <div>
        {filteredCountries.map(country => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={()=>show(country)}>show</button>
          </div>
        ))}
      </div>
    )
  }
}

export default Depiction

