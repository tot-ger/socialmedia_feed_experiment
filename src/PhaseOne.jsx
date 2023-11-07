import { useState, useEffect, useRef } from 'react'
import './PhaseOne.css'

import {  profileImages,
    advertsRandomNameImages,
    advertsNoNameImages,
    advertsUserNameImages,
    blankAdvertsNoNameImages,
    newImages } from './images'

export default function PhaseOne({ username, endPhaseOne }) {
    const maxRounds = 10
    const [round, setRound] = useState(1)
    const [isRoundStarted, setIsRoundStarted] = useState(false)
    const roundLogRef = useRef(null)
    const phaseLogRef = useRef(null)
    const roundImagesRef = useRef([])

    useEffect(() => {
        console.log('round starts')
        if (round > maxRounds) {
            endPhaseOne()
        }

        const roundImages = []
        profileImages.map((image, index) => {
            if (image.includes(`p${round}`)) {
                roundImages.push(image)
            }
            return
        })

        roundImagesRef.current = roundImages

        setIsRoundStarted(true)
    },[round])

    return (
        <div className="phase-one-container">
            <button onClick={() => setRound(round - 1)}>Previous</button>
            <button onClick={() => setRound(round + 1)}>Next</button>
            {isRoundStarted && (
            roundImagesRef.current.map((image, index) => {
                return (
                    <div className="phase-one-image-container" key={index}>
                        <img className="phase-one-image" src={image} alt={`p${round}-${index}`}/>
                    </div>
                )
            }))}
        </div>
    )
}