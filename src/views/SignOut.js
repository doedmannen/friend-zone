import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Auth from '../util/Auth'; 



export default class Home extends Component {

	state = { };

	componentDidMount(){
		localStorage.removeItem('user_id');
		Auth();
		this.props.history.push("/")
	}

	render(){
		return(
			<div>
				
			</div>	
		);
	}
}


