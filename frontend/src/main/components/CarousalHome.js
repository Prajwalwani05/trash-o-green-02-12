import React from 'react';
import Carousel from 'react-material-ui-carousel';
import { Paper, Typography } from '@mui/material';
import '../../App.css';
import { useNavigate } from "react-router-dom";

function Example(props) {
    const { items } = props;
    const navigate = useNavigate();

    return (
        <Carousel 
        animation='slide'
        fullHeightHover={false}    
            navButtonsAlwaysVisible={false}
            indicators={false}>
            {items && items.map((item, i) => <Item key={i} item={item} onClick={() => navigate('/booking')} />)}
        </Carousel>
    );
}

function Item(props) {
    return (
        <Paper onClick={props.onClick} className='carousel' style={{borderRadius:'0', backgroundColor:'#785964', backgroundImage:`url(${props.item.img})`, backgroundSize:"contain",backgroundRepeat:'no-repeat', backgroundPosition:'center'}}>
        <div className='carouselInside'>
                <h2 style={{color: "white", margin:"0", textAlign:'center'}}>{props.item.name}</h2>
                {/* <p style={{color: "lightgray", textAlign:'center'}}>{props.item.description}</p> */}
            </div>
        </Paper>
    );
}

export default Example;
