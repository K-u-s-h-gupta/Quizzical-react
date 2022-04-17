import React , {useState} from 'react'
import Question from './Question'
import Start from './Start'

export default function App(){
    const [start , setStart] = useState(false)

    function startGame(){
        setStart(prev=> !prev)
    }
    return(
        <>
        {start? <Question/> : <Start onClick={startGame}/>}
        </>
    )
}