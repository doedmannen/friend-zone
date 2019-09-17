import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import store from './util/Store'; 

import Home from './views/Home'; 
import Login from './views/Login';
import Register from './views/Register'; 
import ViewFriends from './views/ViewFriends'; 
import AddFriend from './views/AddFriend'; 
import Settings from './views/Settings'; 
import Teapot from './views/Teapot';

import './App.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';


export default class App extends Component {

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
		let navbarOrder = store.screenSize.isMDorAbove ? 'order-2 mainHeaderNavigation' : ' pb-2 order-5';  
		return(
			<Router> 
				<div className="App">
					<header className="mainHeader order-1">
						<div className="header text-500 mb-2 pt-2">
							FriendZone 
						</div>
					</header>
					<div className="mainHeaderBottom order-3 pt-2"></div>
					<main className="mainApplication order-4 mt-4 pr-3 pl-3">
						<Switch>
							<Route path="/" exact component={Home} /> 
							<Route path="/add" component={AddFriend} /> 
							<Route path="/login" component={Login} /> 
							<Route path="/register" component={Register} /> 
							<Route path="/myFriends" component={ViewFriends} /> 
							<Route path="/settings" component={Settings} /> 
							<Route component={Teapot} />
						</Switch>
					</main>

					<section className={ 'mainNavigation ' + navbarOrder  }>
						<div className="flex-1"></div>
						<div className="linkNavigation flex-1">
							<Link to="/"><div><i class="fas fa-home text-300"></i></div></Link>
						</div>
						<div className="linkNavigation flex-1">
							<Link to="/add"><div><i class="fas fa-plus-circle text-300"></i></div></Link>
						</div>
						<div className="linkNavigation flex-1">
							<Link to="/myFriends"><div><i class="fas fa-users text-300"></i></div></Link>
						</div>
						<div className="linkNavigation flex-1">
							<Link to="/settings"><div><i class="fas fa-cog text-300"></i></div></Link>
						</div>
						<div className="flex-1"></div>
					</section>
				</div>
			</Router>
		);
	}
}

