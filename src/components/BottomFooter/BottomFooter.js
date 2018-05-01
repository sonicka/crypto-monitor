import React from "react";
import "./BottomFooter.css";

const bottomFooter = (props) => {
    return (
        <div className="footer">
            <button className="sort" onClick={props.sort}>sort by price</button>
            <button className="refresh" onClick={props.refresh}>refresh</button>
        </div>
    )
};

export default bottomFooter;