import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import store from './util/Store'; 

import PrivateRoute from './router/PrivateRoute'; 

import Home from './views/Home'; 
import Login from './views/Login';
import Register from './views/Register'; 
import ViewFriends from './views/ViewFriends'; 
import AddFriend from './views/AddFriend'; 
import EditFriend from './views/EditFriend'; 
import Settings from './views/Settings'; 
import SignOut from './views/SignOut'; 
import Teapot from './views/Teapot';

import './App.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.css';


export default class App extends Component {

	state = {
		translations: {
			'EN': {
				'HOME': 'HOME',
				'ADD': 'ADD',
				'FRIENDS': 'FRIENDS',
				'SETTINGS': 'SETTINGS'
			},
			'SE': {
				'HOME': 'HEM',
				'ADD': 'LÄGG TILL',
				'FRIENDS': 'VÄNNER',
				'SETTINGS': 'INSTÄLLNINGAR'
			}
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
		let navbarOrder = store.screenSize.isMDorAbove ? 'order-2 main-header-navigation' : ' pb-2 pt-2 order-5 bottom-navigation';  
		return(
			<Router> 
				<div className="app">
					<header className="main-header order-1">
						<Link to="/">
							<div className="header text-500 mb-2 pt-2">
								FriendZone 
							</div>
						</Link>
					</header>
					<div className="main-header-bottom order-3 pt-2"></div>
					<main className="main-application order-4 mt-4 pr-3 pl-3 mb-5 pb-5">
						<Switch>
							<Route path="/" exact component={Home} /> 
							<Route path="/register" component={Register} /> 
							<Route path="/login" component={Login} /> 
							<Route path="/signout" component={SignOut} /> 
							<PrivateRoute exact path="/editFriend" component={EditFriend} /> 
							<PrivateRoute exact path="/add" component={AddFriend} /> 
							<PrivateRoute exact path="/myFriends" component={ViewFriends} /> 
							<PrivateRoute exact path="/settings" component={Settings} /> 
							<Route component={Teapot} />
						</Switch>
					</main>

					<section className={ 'main-navigation ' + navbarOrder  }>
						<div className="flex-1"></div>
						<div className="linkNavigation flex-1">
							<Link to="/"><div>
								<i className="fas fa-home text-300 pr-3"></i> 
								{ store.screenSize.isMDorAbove ? this.state.translations[store.lang]['HOME'] : null } 
								</div></Link>
						</div>
						<div className="linkNavigation flex-1">
							<Link to="/add"><div>
								<i className="fas fa-plus-circle text-300 pr-3"></i> 
								{ store.screenSize.isMDorAbove ? this.state.translations[store.lang]['ADD'] : null }
								</div></Link>
						</div>
						<div className="linkNavigation flex-1">
							<Link to="/myFriends"><div>
								<i className="fas fa-users text-300 pr-3"></i> 
								{ store.screenSize.isMDorAbove ? this.state.translations[store.lang]['FRIENDS'] : null } 
								</div></Link>
						</div>
						<div className="linkNavigation flex-1">
							<Link to="/settings"><div>
								<i className="fas fa-cog text-300 pr-3"></i> 
								{ store.screenSize.isMDorAbove ? this.state.translations[store.lang]['SETTINGS'] : null }	
								</div></Link>
						</div>
						<div className="flex-1"></div>
					</section>
				</div>
			</Router>
		);
	}
}

