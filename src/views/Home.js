import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 

import './Home.css';



export default class Home extends Component {

	state = { 
		translations: {
			'EN': {
				'headline': 'Welcome to FriendZone',
				'text-1': 'FriendZone is an app that helps you keep track of when it is most likely that you can get in touch with your friends, even if they work weird hours, sleep in late or is in a timezone that you never can keep track of.',
				'text-2': 'Simply add your friends into the app and enter what timezones they are in and forget about thinking "is it in the middle of the night on their side of the globe right now?" '
			},
			'SE': {
				'headline': 'Välkommen till FriendZone',
				'text-1': 'FriendZone är en app som hjälper dig att hålla koll på när det är mest troligt att kunna få kontakt med dina vänner, även om de jobbar konstiga tider, sover sent eller befinner sig i en tidszon som du aldrig kan hålla koll på.',
				'text-2': 'Bara lägg till dina vänner i appen och fyll i vilka tidszoner de befinner sig i och sluta oroa dig över "är det natt nu på deras sida jordklotet?"'
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




