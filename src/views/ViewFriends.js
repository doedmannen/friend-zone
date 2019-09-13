import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from './util/Store'; 

import './ViewFriends.css';



export default class ViewFriends extends Component {


	componentDidMount(){
		this.storeSub = function(changes, store){
			console.log(changes); 
		}
		store.subTo(this.storeSub); 
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}


	render(){
		return(
			<div>
				Welcome to viewFriends.js
			</div>	
		);
	}
}


