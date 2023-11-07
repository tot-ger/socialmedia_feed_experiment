import { useState, useRef } from 'react'
import './App.css'
import PhaseOne from './PhaseOne'

function App() {
  const [isPhaseOneStarted, setIsPhaseOneStarted] = useState(false)
  const [isPhaseOneFinished, setIsPhaseOneFinished] = useState(false)
  const [isPhaseTwoStarted, setIsPhaseTwoStarted] = useState(false)
  const [isPhaseTwoFinished, setIsPhaseTwoFinished] = useState(false)
  const [username, setUsername] = useState('')
  const logRef = useRef(null)
  const seenAdvertsRef = useRef(null)

  const handleStart = (e) => {
    e.preventDefault()
    if (!isPhaseOneStarted) {
      logRef.current = {username}
      console.log(logRef.current)
      setIsPhaseOneStarted(true)
    }
  }

  const endPhaseOne = (phaseLog) => {
    console.log(phaseLog)
    setIsPhaseOneFinished(true)
  }

  return (
    <div className="app-container">
      {!isPhaseOneStarted && !isPhaseOneFinished && (
        <div className="phase-one-instructions">
          <h1>Welcome to the experiment</h1>
          <h2>Please read the instructions below</h2>
          <p>You are required to look at 10 separate feeds, these are the social media feeds of
            individuals.</p>
          <p>All personal information pertaining to them has been removed.</p>
          <p>Your task is to guess the age and gender of the person who would see this feed on their
              social media.</p>
          <div className="username-form-container">
            <form className='username-form' onSubmit={handleStart}>
              <label>Enter your name:
                <input  type="text"
                        className='username-input'
                        required
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}/>
              </label>
              <input type="submit" className='btn-start-phase-one' value="Start"/>
            </form>
          </div>
        </div>
      )}
      {isPhaseOneStarted && !isPhaseOneFinished && (
        <PhaseOne username={username} endPhaseOne={endPhaseOne}/>
      )}
      {isPhaseOneFinished && !isPhaseTwoStarted && (
        <h1>Phase Two instructions</h1>
      )}
      {isPhaseTwoStarted && !isPhaseTwoFinished && (
        <h1>Phase Two</h1>
      )}
      {isPhaseTwoFinished && (
        <h1>Experiment Finished</h1>
      )}
    </div>
  )
}

export default App
