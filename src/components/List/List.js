import React from "react";
import Cryptocontainer from "./Cryptocontainer/Cryptocontainer";
import './List.css'

const list = (props) => {

    let transformedCurrencies = props.list.map(item => {
        return <Cryptocontainer
            item={item}
            key={item.id}
            fetch={props.fetch}
            handleX={() => props.handleX(item.id)}/>
    });

    return (
        <div className="list">
            {props.list.length === 0 ?
                <p className="no_currencies"> No chosen cryptocurrencies to show!</p> : transformedCurrencies}
        </div>
    )
};

export default list;