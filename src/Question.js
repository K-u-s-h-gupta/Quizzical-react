import React, { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import unescape from 'unescape'
import './style.css'
export default function Question(){
    const [quizzical , setQuizzical] = useState([])
    const [gameOver , setGameOver] = useState(false)
    const [score , setScore] = useState(0)

    function getQuizzical(){
        fetch('https://opentdb.com/api.php?amount=5')
        .then(res=> res.json())
        .then(data=> setQuizzical(data.results.map(quiz=>(
            {
                id:nanoid(),
                question: quiz.question,
                options: randomize([quiz.correct_answer , ...quiz.incorrect_answers]),
                answer: quiz.correct_answer,
                currentAns:'',
                correctAns:false,
                checked:false
            }
        ))))
        
    }
    function randomize(arr){
        let newArr=[...arr]
        let randomArr=[]
        while(newArr.length>0){
            let randomIndex=Math.floor(Math.random()*newArr.length)
            randomArr.push(newArr[randomIndex])
            newArr.splice(randomIndex,1)
        }
        return randomArr
    }

    useEffect(()=>{
         getQuizzical()
    },[])
    
    function filtered(htmlstr){
        htmlstr = htmlstr.replaceAll("&#039;" , "'")
        htmlstr = htmlstr.replaceAll("&ndash;" , "_")
        return htmlstr
    }

    function handleClick(event){
        const {id , value} = event.target
        setQuizzical(prevQuiz=> prevQuiz.map(quiz=>(
            quiz.id===id? {...quiz , currentAns:value} : quiz
        )))
    }

    function checkAnswer(){
        setQuizzical(prevQuiz=>prevQuiz.map(quiz=>{
            quiz.checked=true
            return quiz.currentAns === quiz.answer ? {...quiz , correctAns:true}: quiz
        }))
        setGameOver(true)
    }

    useEffect(()=>{
        setScore(prevScore=> quizzical.filter(quiz=> quiz.correctAns))
    } , [quizzical])

    function startAgain(){
            setQuizzical([])
            setGameOver(false)
            getQuizzical()
    }

    const displayQuizzical = quizzical.map(quiz=>{
            return(
                <div key={quiz.id}>
                    <h4 className='question'>{unescape(filtered(quiz.question))}</h4>
                    {quiz.options.map((option , index)=>(
                        gameOver? <button  className='answer_btn'
                        style={quiz.correctAns&&gameOver&&quiz.currentAns===option? {backgroundColor:"#95CD41"} : 
                        !quiz.correctAns&&quiz.currentAns===option?{backgroundColor:"#EA5C2B"}: 
                        option===quiz.answer?{backgroundColor:"#95CD41"}:
                        {backgroundColor:"white", pointerEvents:'none' , opacity:"50%"}}
                        key={index} 
                        id={quiz.id} 
                        value={option} 
                        onClick={handleClick}>{unescape(filtered(option))}</button> :
                        <button className='answer_btn'
                        style={!quiz.checked&&quiz.currentAns===option ? {backgroundColor:"#8FBDD3"}: {backgroundColor:"white"}}
                        key={index} 
                        id={quiz.id} 
                        value={option} 
                        onClick={handleClick}>{unescape(filtered(option))}</button>
                    ))}

                </div>
            )
    })
    return(
        <div>
        {displayQuizzical}
        {gameOver&& <p>You Scored {score.length}/5 answers</p>}
        {gameOver ? <button onClick={startAgain} className="play_btn">Play Again</button>: <button className="check_btn" onClick={checkAnswer}>Check Answer</button>} 
        </div>
    )
}