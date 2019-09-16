import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import Friend from '../components/Friend';

import './ViewFriends.css';



export default class ViewFriends extends Component {

	state = {};

	friendInfo = {
		firstName: "Friend", 
		lastName: "Friendsson", 
		country: "Sweden", 
		city: "Stockholm", 
		timeZone: {
			name: 'Europe/Stockholm',
			offset: 3600000,
			dst_offset: 3600000,
			dst: true
		}
	}; 

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
				<Friend {...this.friendInfo} />	
			</div>	
		);
	}
}


