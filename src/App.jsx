import { useState, useRef } from 'react'
import './App.css'
import { blankImages, newImages } from './images'
import PhaseOne from './PhaseOne'
import PhaseTwo from './PhaseTwo'

function App() {
  const [isPhaseOneStarted, setIsPhaseOneStarted] = useState(false)
  const [isPhaseOneFinished, setIsPhaseOneFinished] = useState(false)
  const [isPhaseTwoStarted, setIsPhaseTwoStarted] = useState(false)
  const [isPhaseTwoFinished, setIsPhaseTwoFinished] = useState(false)
  const [username, setUsername] = useState('')
  const logRef = useRef(null)
  const phaseTwoImagesRef = useRef(null)

  const handleStart = (e) => {
    e.preventDefault()
    if (!isPhaseOneStarted) {
      logRef.current = {username}
      setIsPhaseOneStarted(true)
    }

    if (isPhaseOneFinished && !isPhaseTwoStarted) {
      setPhaseTwoImages()
      setIsPhaseTwoStarted(true)
    }
  }

  const endPhaseOne = (phaseLog) => {
    logRef.current = {...logRef.current, phaseOne: phaseLog}
    setIsPhaseOneFinished(true)
  }

  const setPhaseTwoImages = () => {
    const allSeenAdverts = logRef.current.phaseOne
      .map(phaseOneItem => phaseOneItem.log
      .map(logItem => logItem.name?.includes('adverts') ? logItem.name : null))
      .flat()
      .filter(item => item !== null)
    
    //select all adverts of UserName from blankImages
    const usernameAdverts = []
    blankImages.filter(item => item.includes('UserName')).forEach(item => {
      const imageNameSplit = item.split('/')
      const imageName = imageNameSplit[imageNameSplit.length - 1]
      usernameAdverts.push({name: imageName, src: item})
    })

    //select random 15 adverts of NoName
    const noNameAdverts = allSeenAdverts.filter(item => item.includes('NoName'))
    for (let i = noNameAdverts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));    
      [noNameAdverts[i], noNameAdverts[j]] = [noNameAdverts[j], noNameAdverts[i]]
    }

    const noNameAdvertsRandom = []
    for (let i = 0; i < 15; i++) {
      const imageName = noNameAdverts[i]
      const image = blankImages.filter(item => item.includes(imageName))[0]
      noNameAdvertsRandom.push({name: imageName, src: image})
    }

    //select random 15 adverts of RandomName
    const randomNameAdverts = allSeenAdverts.filter(item => item.includes('RandomName'))
    for (let i = randomNameAdverts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomNameAdverts[i], randomNameAdverts[j]] = [randomNameAdverts[j], randomNameAdverts[i]]
    }

    const randomNameAdvertsRandom = []
    for (let i = 0; i < 15; i++) {
      const imageName = randomNameAdverts[i]
      const image = blankImages.filter(item => item.includes(imageName))[0]
      randomNameAdvertsRandom.push({name: imageName, src: image})
    }
    
    //add all new images
    const newImagesArray = []
    newImages.forEach(image => {
      const imageNameSplit = image.split('/')
      const imageName = imageNameSplit[imageNameSplit.length - 1]
      newImagesArray.push({name: imageName, src: image})
    })

    //combine all images
    phaseTwoImagesRef.current = [...usernameAdverts, ...noNameAdvertsRandom, ...randomNameAdvertsRandom, ...newImagesArray]
    
    //shuffle images
    for (let i = phaseTwoImagesRef.current.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [phaseTwoImagesRef.current[i], phaseTwoImagesRef.current[j]] = [phaseTwoImagesRef.current[j], phaseTwoImagesRef.current[i]];
    }
  }

  const endPhaseTwo = (phaseLog) => {
    logRef.current = {...logRef.current, phaseTwo: phaseLog}
    downloadLog()
    setIsPhaseTwoFinished(true)
  }

  const downloadLog = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(logRef.current)], {type: 'text/plain'});
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = username.replace(' ', '_').toLowerCase() + timestamp + "_log.txt";
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
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
        <div className='phase-two-welcome'>
          <h1>Thank you for your responses</h1>
          <p>Next, we would like you to identify if any of the following images were images that you have
              seen before.</p>
          <button name='startPhaseTwoButton' onClick={handleStart}>Start</button>
      </div>
      )}
      {isPhaseTwoStarted && !isPhaseTwoFinished && (
        <PhaseTwo images={phaseTwoImagesRef.current} endPhaseTwo={endPhaseTwo}/>
      )}
      {isPhaseTwoFinished && (<div className='thank-you-message'>
        <h1>Thank you for your participation in this experiment</h1>
        <p>You may exit the booth where you will be asked to complete a questionnaire.</p>
        <p>After, the details of the experiment will be explained to you.</p>
      </div>)}
    </div>
  )
}

export default App
