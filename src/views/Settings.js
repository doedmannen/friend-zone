import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import Auth from '../util/Auth'; 

import InputSelectList from '../components/InputSelectList'; 

import './Settings.css';



export default class Settings extends Component {

	constructor(props){
		super(props); 
		
		this.handleInput = this.handleInput.bind(this); 
	}

	state = {
		translations: {
			'EN': {
				'headline': 'Settings',
				'time': 'Time format', 
				'date': 'Date format', 
				'save': 'Save',
				'lang': 'Language',
				'signOut': 'Sign out'
			},
			'SE': {
				'headline': 'Inställningar',
				'time': 'Tids format', 
				'date': 'Datum format', 
				'save': 'Spara',
				'lang': 'Språk',
				'signOut': 'Logga ut'
			}
		},
		lang: {
			'SE': [{value: 'EN', name: 'Engelska'}, {value: 'SE', name: 'Svenska'}],
			'EN': [{value: 'EN', name: 'English'}, {value: 'SE', name: 'Swedish'}]
		},
		time: {
			'SE': [{value: '12HOUR', name: '12 timmar'}, {value: '24HOUR', name: '24 timmar'}],
			'EN': [{value: '12HOUR', name: '12 hours'}, {value: '24HOUR', name: '24 hours'}]
		},
		date: {
			'SE': [{value: 'YYYY/DD/MM', name: 'År/Månad/Dag'}, {value: 'DD/MM/YYYY', name: 'Dag/Månad/År'}, {value: 'MM/DD/YYYY', name: 'Månad/Dag/År'}],
			'EN': [{value: 'YYYY/DD/MM', name: 'Year/Month/Day'}, {value: 'DD/MM/YYYY', name: 'Day/Month/Year'}, {value: 'MM/DD/YYYY', name: 'Month/Day/Year'}]
		}, 
		input: {
			timeFormat: undefined,
			dateFormat: undefined, 
			lang: undefined
		},
		formClear: false
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

	handleInput(who, what){
		let input = this.state.input; 
		input[who] = what.value; 
		this.setState({ input }); 
	}

	async saveSettings(){
		let user = store.user; 
		for(let k in this.state.input){
			if(this.state.input[k]){
				user[k] = this.state.input[k]; 
			}
		}
		await user.save(); 
		Auth();
		this.setState({formClear: true}); 
		setTimeout(() => {this.setState({formClear: false})}, 1)
	}


	render(){
		return(
			<div>
				<div className="text-300 mb-3">
					{ this.state.translations[store.lang].headline }
				</div>

				<InputSelectList 
					onInput={this.handleInput}
					fieldName="lang"
					placeHolder={ this.state.translations[store.lang].lang }
					displayField="name"
					clear={ this.state.formClear }
					items={ this.state.lang[store.lang] } />

				<InputSelectList 
					onInput={this.handleInput}
					fieldName="dateFormat"
					placeHolder={ this.state.translations[store.lang].date }
					displayField="name"
					clear={ this.state.formClear }
					items={ this.state.date[store.lang] } />

				<InputSelectList 
					onInput={this.handleInput}
					fieldName="timeFormat"
					placeHolder={ this.state.translations[store.lang].time }
					displayField="name"
					clear={ this.state.formClear }
					items={ this.state.time[store.lang] } />


				<div className="p-3">
					<button 
						className="card-container p-3 green pointer" 
						onClick={ e => this.saveSettings() }>
						{ this.state.translations[store.lang].save.toUpperCase() }
					</button>
				</div>

				<div className="p-3">
					<button 
						className="card-container p-3 red pointer" 
						onClick={ e => this.props.history.push('/signout') }>
						{ this.state.translations[store.lang].signOut.toUpperCase() }
					</button>
				</div>
			</div>	
		);
	}
}




