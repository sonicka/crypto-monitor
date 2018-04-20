import React from "react";
import "./BottomFooter.css";

const bottomFooter = (props) => {
    return (
        <div className="footer">
            <button className="sort" onClick={props.click}>sort by current price</button>
        </div>
    )
};

export default bottomFooter;