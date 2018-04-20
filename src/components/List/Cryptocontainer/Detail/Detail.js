import React from 'react';
import './Detail.css';
import Row from "./Row/Row";

const detail = (props) => {

    return (
        <div className="detail"
             style={{
                 height: props.expanded ? '100%' : '100%',
                 visibility: props.expanded ? 'visible' : 'visible'
             }}>
            <div className="detail-item">
                <Row name="Volume" value={props.item.volume}/>
                <Row name="24h change" value={props.item.change}/>
                <Row name="24h open" value={props.item.open}/>
                <Row name="24h high" value={props.item.high}/>
                <Row name="24h low" value={props.item.low}/>
                <Row name="Last market" value={props.item.last_market}/>
            </div>
        </div>
    )
};

export default detail;