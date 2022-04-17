import React from 'react'
import './style.css'

export default function Start(props){
 return(
     <div className='start_page'>
         <h2 className='quiz-heading'>Quizzicals</h2>
         <p className='quiz-para'>Lets test our IQ</p>
         <button className='start_btn' onClick={props.onClick}>START</button>
     </div>
 )
}