import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 

import './Home.css';



export default class Home extends Component {

	state = { 
		translations: {
			'EN': {
				'headline': 'Welcome to FriendZone',
				'text-1': 'Do you have a lot of friends that are spread out all over the world in different timezones? Do you find it hard to keep track of what the local time is in another country? Then FriendZone is the perfect app for you! ',
				'text-2': 'Simply add your friends and their location into the app and let us fetch their timezone and what local date and time they have. '
			},
			'SE': {
				'headline': 'Välkommen till FriendZone',
				'text-1': 'Har du många vänner som är utspridda över hela världen i olika tidszoner? Tycker du att det är svårt att komma ihåg vilken lokal tid det är i ett annat land? Då är FriendZone den perfekta appen för dig! ',
				'text-2': 'Bara lägg till dina vänner och deras plats i appen och låt oss hämta deras tidszon och vad för lokalt datum och tid de har. '
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
		let text = this.state.translations[store.lang]; 
		return(
			<div className="flex">
				<div className="flex-1"></div>
				<div className={ store.screenSize.isMDorAbove ? 'flex-2' : 'flex-10' }>
					<div className="text-300 mb-3">
						{ text['headline'] }
					</div>
					<div className="mb-2">
						{ text['text-1'] }
					</div>
					<div className="mb-2">
						{ text['text-2'] }
					</div>
				</div>
				<div className="flex-1"></div>
			</div>	
		);
	}
}




