import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from './util/Store'; 

import './AddFriend.css';



export default class AddFriend extends Component {


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
				Welcome to addFriend.js
			</div>	
		);
	}
}


