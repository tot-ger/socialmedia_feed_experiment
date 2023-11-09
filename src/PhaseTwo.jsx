import { useState, useRef, useEffect } from 'react'
import './PhaseTwo.css'

export default function PhaseTwo({ images, endPhaseTwo }) {
    const [index, setIndex] = useState(0)
    const phaseLogRef = useRef([])
    const timerRef = useRef(null)
    const phaseTwoImages = images
    

    const handleClick = (e) => {
        const loadingScreen = document.getElementById('loading-screen')
        loadingScreen.style.display = 'flex'
        const elapsedTime = Date.now() - timerRef.current

        const logItem = {
            image: phaseTwoImages[index].name,
            markedAsSeen: e.target.value,
            time: elapsedTime
        }

        phaseLogRef.current.push(logItem)

        if (index === phaseTwoImages.length - 1) {
            endPhaseTwo(phaseLogRef.current)
        }

        setIndex(prev => prev + 1)
    }

    useEffect(() => {
        console.log(phaseTwoImages)
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen')
            loadingScreen.style.display = 'none'
            timerRef.current = Date.now()
        }, 2000)
    }, [index])


    return (
        <div className="phase-two-container">
            <div className="loading-screen" id='loading-screen'><h1>Loading...</h1></div>
            <h1>Have you seen this image before?</h1>
            <div className="phase-two-controls-container">
                <button className='phase-two-btn btn-yes' value={true} onClick={handleClick}>Yes ✅</button>
                <button className='phase-two-btn btn-no' value={false} onClick={handleClick}>No ❌</button>
            </div>
            <div className="phase-two-image-container">
                <img className="phase-two-image" src={phaseTwoImages[index].src} alt={phaseTwoImages[index].alt}/>
            </div>
        </div>
    )
}