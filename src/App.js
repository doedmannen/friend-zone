import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from './util/Store'; 
import ScreenCalc from './util/ScreenCalc';

import Home from './views/Home'; 
import Login from './views/Login';
import Register from './views/Register'; 
import ViewFriends from './views/ViewFriends'; 
import AddFriend from './views/AddFriend'; 

import './App.css';



export default class App extends Component {

	state = {};

	componentDidMount(){
		ScreenCalc();	
		this.storeSub = (changes) => {
			console.log(store);
			this.setState( { } );
		}
		store.subTo(this.storeSub);
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}



	render(){
		let navbarOrder;  
		if(store.screenSize && store.screenSize.isMDorAbove){
			navbarOrder = "order-2";
		}	else {
			navbarOrder = 'order-4';
		}
		return(
			<Router> 
				<div className="App">
					<header className="mainHeader order-1">
						<h1 className="pb-4 pt-2">
							FriendZone is { navbarOrder }
						</h1>
					</header>
					<main className="mainApplication order-3">
						<Route path="/" exact component={Home} /> 
						<Route path="/add" component={AddFriend} /> 
						<Route path="/login" component={Login} /> 
						<Route path="/register" component={Register} /> 
						<Route path="/view" component={ViewFriends} /> 
					</main>
					<section className={ 'mainNavigation ' + navbarOrder  }>
						<div className="linkNavigation">
							<Link to="/">Home</Link>
						</div>
						<div className="linkNavigation">
							<Link to="/add">Add friend</Link>
						</div>
						<div className="linkNavigation">
							<Link to="/myFriends">My friends</Link>
						</div>
						<div className="linkNavigation">
							<Link to="/login">Login</Link>
						</div>
					</section>
				</div>
			</Router>
		);
	}
}

