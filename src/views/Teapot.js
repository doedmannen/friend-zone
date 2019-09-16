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
				<div className="text-300">
					OOOPS! Something is wrong! 
				</div>
				<i class="fas fa-mug-hot text-500"></i>
				<div classname="text-200">
					There is nothing here <br />
					We've put on a kettle of tea for you while you wait. 
				</div>
			</div>	
		);
	}
}



