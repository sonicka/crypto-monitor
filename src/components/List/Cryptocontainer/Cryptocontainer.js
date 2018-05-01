import React, {Component} from 'react';
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'
import './Cryptocontainer.css'
import TitleRow from "./TitleRow/TitleRow";
import Detail from "./Detail/Detail";

class CryptoContainer extends Component {
    state = {
        expanded: true
    };

    /**
     * changes expanded boolean on click on detail row
     */
    clickHandler = () => {
        this.setState({expanded: !this.state.expanded});
    };

    render() {
        return (

            <div className="crypto-container">
                <TitleRow handleClick={this.clickHandler}
                          handleX={this.props.handleX}
                          item={this.props.item}/>
                <SlideDown className={'pure-menu pure-menu-scrollable dropdown-slidedown'}>
                    {!this.state.expanded && <Detail expanded={this.state.expanded} item={this.props.item}/>}
                </SlideDown>
            </div>
        )
    };
}

export default CryptoContainer;
