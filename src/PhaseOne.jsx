import { useState, useEffect, useRef } from 'react'
import './PhaseOne.css'

import {  profileImages,
    advertsRandomNameImages,
    advertsNoNameImages,
    advertsUserNameImages } from './images'

const randomNames = ['Chloe', 'Brian', 'Trevor', 'Krissy', 'Donna', 'Taylor', 'Lottie', 'Megan', 'Katie', 'Stewart']
const isRoundWithRandomNameOverlay = [false, false, false, true, true, true, true, true, true, true]

export default function PhaseOne({ username, endPhaseOne }) {
    const maxRounds = 10
    const [round, setRound] = useState(1)
    const [isRoundStarted, setIsRoundStarted] = useState(false)
    const roundLogRef = useRef([])
    const phaseLogRef = useRef([])
    const roundImagesRef = useRef([])
    const advertsNoNameImagesRef = useRef(advertsNoNameImages)
    const advertsUserNameImagesRef = useRef(advertsUserNameImages)
    const advertsRandomNameImagesRef = useRef(advertsRandomNameImages)
    const scrollFocusRef = useRef(null)
    const overlayRef = useRef(null)
    const ageRef = useRef(null)
    const genderRef = useRef(null)

    const getImageName = (src) => {
        const splitSrc = src.split('/')
        const imageName = splitSrc[splitSrc.length - 1]
        return imageName
    }

    const getImages = () => {
        //shuffle isRoundWithRandomNameOverlay items in first round
        if (round === 1) {
            
            for (let i = isRoundWithRandomNameOverlay.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [isRoundWithRandomNameOverlay[i], isRoundWithRandomNameOverlay[j]] = [isRoundWithRandomNameOverlay[j], isRoundWithRandomNameOverlay[i]];
            }
        }

        //get random name
        overlayRef.current = randomNames[Math.floor(Math.random() * randomNames.length)]
        randomNames.splice(randomNames.indexOf(overlayRef.current), 1)

        const roundImages = []
        
        //add profile images
        profileImages.map((image, index) => {
            if (image.includes(`p${round}profile`)) {
                roundImages.push({src: image, imageName: getImageName(image), overlay: null})
            }
            return
        })

        //add 5 adverts with no name
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * advertsNoNameImagesRef.current.length)
            const image = advertsNoNameImagesRef.current[randomIndex]
            roundImages.push({src: image, imageName: getImageName(image), overlay: null})
            advertsNoNameImagesRef.current.splice(randomIndex, 1)
        }

        //add 5 adverts with username or random name
        for (let i = 0; i < 5; i++) {
            let image

            if (isRoundWithRandomNameOverlay[round - 1]) {
                const randomIndex = Math.floor(Math.random() * advertsRandomNameImagesRef.current.length)
                image = advertsRandomNameImagesRef.current[randomIndex]
                advertsRandomNameImagesRef.current.splice(randomIndex, 1)
            } else {
                const randomIndex = Math.floor(Math.random() * advertsUserNameImagesRef.current.length)
                image = advertsUserNameImagesRef.current[randomIndex]
                advertsUserNameImagesRef.current.splice(randomIndex, 1)
            }

            roundImages.push({src: image, imageName: getImageName(image), overlay: isRoundWithRandomNameOverlay[round - 1] ? overlayRef.current : username})
        }

        //shuffle round images
        for (let i = roundImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roundImages[i], roundImages[j]] = [roundImages[j], roundImages[i]];
        }

        roundImagesRef.current = roundImages
    }

    const updateRoundLog = (name) => {
        if (roundLogRef.current.filter(item => item.name === name).length === 0) {
            roundLogRef.current.push({ name: name, time: 0, refTime: Date.now() })
        } else {
            roundLogRef.current = roundLogRef.current.map(item => {
                if (item.name === name) {
                    item.time += Date.now() - item.refTime
                    item.refTime = Date.now()
                }
                return item
            })
        }
    }

    const handleScroll = (e) => {
        
        const feedImages = document.querySelectorAll('.feed-image')
        const feedImagesArr = Array.from(feedImages)
        const visibleImages = feedImagesArr.filter(item => {
            const rect = item.getBoundingClientRect()
            return rect.top >= 0 && rect.bottom <= window.innerHeight
        })

        const visibleImage = visibleImages[visibleImages?.length - 1]

        if (!visibleImage && !scrollFocusRef.current) {
            return
        }

        if (visibleImage && !scrollFocusRef.current) {
            updateRoundLog(visibleImage.alt)
            scrollFocusRef.current = visibleImage.alt
            return
        }

        if (!visibleImage && scrollFocusRef.current) {
            updateRoundLog(scrollFocusRef.current)
            scrollFocusRef.current = null
            return
        }

        if (visibleImage.alt === scrollFocusRef.current) {
            return
        }

        updateRoundLog(scrollFocusRef.current)
        scrollFocusRef.current = visibleImage.alt
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        setIsRoundStarted(false)

        if (ageRef.current === null || genderRef.current === null) {
            return
        }
   
        phaseLogRef.current.push(
        { 
            round: round,
            age: ageRef.current,
            gender: genderRef.current,
            onverlay: overlayRef.current ?? 'username',
            log: roundLogRef.current
        })

        roundLogRef.current = []
        scrollFocusRef.current = null
        overlayRef.current = null
        genderRef.current = null


        if (round === maxRounds) {
            endPhaseOne(phaseLogRef.current)
        } else {
            setRound(prev => prev + 1)
        }
    }

    useEffect(() => {
        console.log('round', round)

        getImages()
        setIsRoundStarted(true)
    },[round])

    return (
        <div className="phase-one-container">
            {!isRoundStarted && (
                <div className="round-loading">
                    <h1>Loading...</h1>
                </div>
            )}
            {isRoundStarted && (
            <div className="feed-container" onScroll={handleScroll}>
                <div className="round-start-page full-height">
                    <h1>Scroll down to start</h1>
                    <div className="scroll-down-indicator">
                        <div className="scroll-down-arrow"></div>
                        <div className="scroll-down-arrow"></div>
                        <div className="scroll-down-arrow"></div>
                    </div>
                </div>
                {roundImagesRef.current.map((image, index) => {
                    return (
                        <div className="feed-item full-height" key={index}>
                            <div className="feed-image-container">
                                <img src={image.src} alt={image.imageName} className='feed-image'/>
                                {image.overlay && <div className="feed-image-overlay">
                                    <p>{image.overlay}</p>
                                </div>}
                            </div>
                        </div>
                    )
                })}
                <div className="round-end-form-container full-height">
                    <form onSubmit={handleSubmit} className='round-end-form'>
                        <h2>Guess the age and gender that you think this feed belongs to</h2>
                            <div className='feed-end-form-input-container'>
                                <label className='age-label'>Age:</label>
                                <input type='number' name='age-input' className='age-input' min={1} max={99} required onChange={(e) => ageRef.current = e.target.value}/>
                            </div>
                            <div className='feed-end-form-input-container'>
                                <label>Gender:</label>
                                <div className='feed-end-form-radio-container'>
                                    <label className='radio-input'><input type='radio' name='genderInput' value='male' onChange={(e) => genderRef.current = e.target.value} />Male</label>
                                    <label className='radio-input'><input type='radio' name='genderInput' value='female' onChange={(e) => genderRef.current = e.target.value}/>Female</label>
                                    <label className='radio-input'><input type='radio' name='genderInput' value='nonbinary' onChange={(e) => genderRef.current = e.target.value}/>Non-binary</label>
                                </div>
                            </div>
                        <button type='submit'>Submit</button>
                    </form>
                </div>
            </div>)}
        </div>
    )
}