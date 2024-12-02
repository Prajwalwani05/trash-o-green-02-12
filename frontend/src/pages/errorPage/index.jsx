import React from 'react'
import errorImg from '../../assets/error_page.jpg';

const ErrorPage = () => {
  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', height:'100vh'}}>
       <img src={errorImg} alt='img' width='300'/> 
    </div>
  )
}

export default ErrorPage