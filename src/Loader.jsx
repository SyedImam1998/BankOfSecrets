import React from 'react';
// import './style.css';
const Loader =(props)=> {
    
        return (
            props.showLoader?<div className="rollerID"><div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </div></div>:<div></div>
        );
    
}

export default Loader;