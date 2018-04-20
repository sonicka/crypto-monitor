import React from 'react';
import './Row.css';

const row = (props) => {
    return (
        <div className="firstrow ">
            <div className="left">
                <span className="left lower">{props.name} </span>
            </div>
            <span style={{fontSize: 0.8 + 'em', fontFamily: "Raleway"}}>|</span>
            <div className="right">
                <span className="right lower"> {props.value}</span>
            </div>
        </div>
    )
};

export default row;