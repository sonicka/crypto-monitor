import React from "react";
import './TopToolbar.css'


const topToolbar = (props) => {
    let transformedOptions = Array.from(props.allCoins).sort((a, b) => a < b ? -1 : 1).map((item, index) => {
        return <option
            value={item[0]}
            key={index}>{item[0] + " | " + item[1]}</option>
    });

    return (
        <div className="top-toolbar">
            <div className="topdiv">
                <select className="select" onChange={props.handleSelect} autoFocus value="selected">
                    <option value="selected" disabled>cryptocurrency</option>
                    {transformedOptions}
                </select>
            </div>
        </div>
    )
};

export default topToolbar;