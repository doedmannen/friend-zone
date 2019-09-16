import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 

import './Clock.css';



export default class Clock extends Component {

	state = {  };
	

	componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}


	render(){
		let size = this.props.size + 'px', borderSize = Math.ceil(this.props.size / 100) + 'px';
		const clockStyler = { width: size, height: size, border:  borderSize+' solid #555555' };
		const hourTurn = { transform: 'rotate(' + this.props.timeAnalog.HOUR + 'deg)' }; 
		const minuteTurn = { transform: 'rotate(' + this.props.timeAnalog.MINUTE + 'deg)' };
		const secondTurn = {transform: 'rotate(' + this.props.timeAnalog.SECOND + 'deg)'};
		return(
			<div>
				<main className="clocktainer" style={clockStyler}>
					<div className="clockdiv hour" style={hourTurn}></div>
					<div className="clockdiv minute" style={minuteTurn}></div>
					<div className="clockdiv second" style={secondTurn}></div>
					<div className="clockdiv midcircle"></div>
				</main>
			</div>	
		);
	}
}





