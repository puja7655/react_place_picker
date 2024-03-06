import { useState, useEffect } from "react"

export default function ProgressBar({ timer }) {

    const [remainingTime, setRemainingTime] = useState(timer)

    //Logic for showing timer in progress bar
    useEffect(() => {
        console.log("interval")
        const interval = setInterval(() => {
            setRemainingTime((prevState) => prevState - 10);
        }, 10)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <progress value={remainingTime} max={timer} />
    )
}