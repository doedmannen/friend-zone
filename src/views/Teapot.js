import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 

import './Teapot.css';



export default class Teapot extends Component {

	state = {};

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
		return(
			<div>
				<div className="text-300 mb-5">
					OOOPS! Something is wrong! 
				</div>
				<i className="fas fa-mug-hot text-500 p-5"></i>
				<div className="text-200 mt-5">
					There is nothing here... <br />
					We've put on a kettle of tea for you while you wait. 
				</div>
			</div>	
		);
	}
}



