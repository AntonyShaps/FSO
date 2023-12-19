import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  console.log(good)


  return (
    <div>
      <Header/>
      <Button text = "good" onClick={() => setGood(good+1)}/>
      <Button text = "neutral" onClick={() => setNeutral(neutral+1)}/>
      <Button text = "bad" onClick={() => setBad(bad+1)}/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
    </div>
  )
}

const Header = () => <h1>give feedback</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}> {text} </button>

const Statistics = ({good,bad,neutral}) => {
  if (good+bad+neutral>0) {
    return(
      <div>
        <h1>statistics</h1>
        <StatisticLine text = "good" value = {good}/>
        <StatisticLine text = "neutral" value = {neutral}/>
        <StatisticLine text = "bad" value = {bad}/>
        <StatisticLine text = "all" value = {good + neutral + bad}/>
        <StatisticLine text = "average" value = {(good-bad)/(good+neutral+bad)}/>
        <StatisticLine text = "positive" value ={good/(good+neutral+bad)*100} text1 = "%" />
      </div>
    )
  } else {
    return(
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )
  }
}

const StatisticLine = ({text, text1, value}) =>{
  return(
    <div>{text} {value} {text1}</div>
  )
}
export default App

