import React from "react";
import ReactTooltip from 'react-tooltip';
import './TitleRow.css';

const titleRow = (props) => {
    return (
        <div id="title" onClick={props.handleClick}>
            <div className="firstrow">
                <div className="up-left">
                    <ReactTooltip/>
                    <span data-tip={props.item.name}
                          className="up-left">{props.item.shortcut}</span>
                </div>
                <div className="up-right">
                    <div className="ninety">
                        <span className="up-right">{props.item.price}</span>
                    </div>
                    <div className="ten">
                        <button onClick={props.handleX} className="cancel">✕</button>
                    </div>
                </div>
            </div>
            <p className="update">Updated: {props.item.last_update}</p>
        </div>
    )
};

export default titleRow;