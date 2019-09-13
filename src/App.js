import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from './util/Store'; 

import Home from './views/Home'; 
import Login from './views/Login';
import Register from './views/Register'; 
import ViewFriends from './views/ViewFriends'; 
import AddFriend from './views/AddFriend'; 

import './App.css';



export default class App extends Component {


	componentDidMount(){
		this.storeSub = function(changes, store){
			console.log(changes); 
		}
		store.subTo(this.storeSub);
		// TODO evolve to get sizing 
		window.addEventListener('resize', () => {console.log(window.innerWidth, window.innerHeight)});
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}


	render(){
		return(
			<Router> 
				<main className="mainApplication">
					<Route path="/" exact component={Home} /> 
					<Route path="/add" component={AddFriend} /> 
					<Route path="/login" component={Login} /> 
					<Route path="/register" component={Register} /> 
					<Route path="/view" component={ViewFriends} /> 
				</main>
				<section className="mainNavigation">

				</section>
			</Router>
		);
	}
}

