import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 

import './Friend.css';



export default class Friend extends Component {

	state = { time: new Date().toISOString() };

	sleep(ms){
		return new Promise((res,rej) => setTimeout(res, ms));
	};

	async updateClock(){
		while(this._isMounted){
			this.setState({time: new Date().toISOString()});
			await this.sleep(500);
		}
	}

	componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
		this._isMounted = true; 
		this.updateClock();
}

	componentWillUnmount(){
		store.unSub(this.storeSub)
		this._isMounted = false;
	}


	render(){
		return(
			<div>
				<div>
					<div>{this.props.firstname}{this.props.lastname}</div>
					<div></div>
				</div>
			</div>	
		);
	}
}




