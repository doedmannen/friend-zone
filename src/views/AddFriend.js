import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import InputTextField from '../components/InputTextField'; 
import InputPhoneNumberField from '../components/InputPhoneNumberField'; 
import InputEmailField from '../components/InputEmailField'; 
import InputSelectList from '../components/InputSelectList';

import TimeZone from '../mongo_schema/TimeZone';
import Friend from '../mongo_schema/Friend';

import './AddFriend.css';


export default class AddFriend extends Component {

	constructor(props){
		super(props);

		// bind input handler
		this.handleInput = this.handleInput.bind(this);
	}

	state = {
		translations: {
			'EN': {
				'header': 'Add friend',
				'button_ok': 'ADD',
				'button_clear': 'CLEAR',
				'fetch_zone': 'FETCH TIMEZONE',
				'input_fields': {
					'firstName': 'Firstname', 
					'lastName': 'Lastname', 
					'phone': 'Phone number',
					'email': 'Email address',
					'country': 'Country',
					'city': 'City',
					'timeZone': 'Select timezone'
				}	
			}, 
			'SE': {
				'header': 'Lägg till vän',
				'button_ok': 'LÄGG TILL',
				'button_clear': 'RENSA', 
				'fetch_zone': 'HÄMTA TIDSZON',
				'input_fields': {
					'firstName': 'Förnamn', 
					'lastName': 'Efternamn', 
					'phone': 'Telefonnummer',
					'email': 'E-postadress',
					'country': 'Land',
					'city': 'Stad',
					'timeZone': 'Välj tidszon'
				}	
			}
		}, 
		timeZones: [],
		inputFromFields: {
			'firstName': undefined, 
			'lastName': undefined, 
			'country': undefined,
			'phone': undefined,
			'email': undefined,
			'city': undefined,
			'timeZone': undefined
		},
		formClear: false,
		preSetTimeZone: undefined,
		formValidate: false
	};

	async componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
		await this.loadTimeZones();
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	async loadTimeZones(){
		let timeZones = await TimeZone.find();
		this.setState({timeZones}); 
	}

	handleInput(who, what){
		let inputFromFields = this.state.inputFromFields;
		inputFromFields[who] = what; 
		this.setState( { inputFromFields } );
	}

	async submit(){
		this.setState({ formValidate: true }); 
		setTimeout(() => { this.setState({ formValidate: false }) }, 1)
		for(let k in this.state.inputFromFields){
			if(!this.state.inputFromFields[k]) return; 
		}
		let friend = new Friend(this.state.inputFromFields);
		friend.owner = store.user; 
		await friend.save();

		this.props.history.push('/myFriends'); 
	}

	printTimeZones(){
		if(this.state.timeZones.length){
			let o = this.state.timeZones.map((item, index) => <option className="flex-1" value={item._id}>{item.name}</option>);
			o.unshift(<option hidden>Select timezone</option>);
			return o; 
		}
		return null; 
	}

	clearAllFields(){
		this.setState({ formClear: true });
		setTimeout(() => {this.setState({formClear: false})}, 1)
	}

	hasLocation(){
		return this.state.inputFromFields.country && this.state.inputFromFields.city; 
	}

	async fetchZone(){
		let preSetTimeZone, {country, city} = this.state.inputFromFields, location = encodeURIComponent(`${country} ${city}`);
		try{
			preSetTimeZone = (await( await fetch(`${window.location.origin}/api/getTimeZone/${location}`) ).json()).timeZone || undefined; 
		}catch(err){}
		this.setState({ preSetTimeZone })
	}

	render(){
		let text = this.state.translations[store.lang];
		let inputNames = this.state.translations[store.lang]['input_fields'];
		return(
			<div>
				<div className="text-300 mb-3">
					{ text['header'] }
				</div>

				<InputTextField 
					onInput={this.handleInput} 
					fieldName="firstName" 
					placeHolder={ inputNames['firstName'] }
					max={20}
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					requiredField={true} />

				<InputTextField 
					onInput={this.handleInput} 
					fieldName="lastName" 
					placeHolder={ inputNames['lastName'] }
					max={30}
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					requiredField={true} />

				<InputTextField 
					onInput={this.handleInput} 
					fieldName="country" 
					placeHolder={ inputNames['country'] }
					max={25}
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					requiredField={true} />

				<InputTextField 
					onInput={this.handleInput} 
					fieldName="city" 
					placeHolder={ inputNames['city'] }
					max={25}
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					requiredField={true} />

				<InputPhoneNumberField 
					onInput={this.handleInput} 
					fieldName="phone" 
					placeHolder={ inputNames['phone'] }
					max={20}
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					requiredField={true} />

				<InputEmailField 
					onInput={this.handleInput} 
					fieldName="email" 
					placeHolder={ inputNames['email'] }
					max={255}
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					requiredField={true} />


				<div className={ this.hasLocation() ? 'block mb-3' : 'hidden' }>
						<button 
							className="card-container p-3 pr-5 pl-5 pointer blue ml-2"
							onClick={ e => this.fetchZone() }> { text['fetch_zone'] } <i className="fas fa-sync-alt"></i>
						</button>
				</div>

				<InputSelectList 
					onInput={this.handleInput}
					fieldName="timeZone"
					placeHolder={ inputNames['timeZone']}
					displayField="name"
					clear={ this.state.formClear }
					validate={ this.state.formValidate }
					preSetItem={ this.state.preSetTimeZone }
					requiredField={ true }
					items={ this.state.timeZones } />


				<div className="flex">
					<div className="flex-1">
						
						<button 
							className="card-container p-3 pr-5 pl-5 pointer red ml-2"
							onClick={e => this.clearAllFields()}> { text['button_clear'] }
						</button>
						
						<button 
							className="card-container p-3 pr-5 pl-5 pointer green ml-2"
							onClick={e => this.submit()}> { text['button_ok'] }
						</button>
						
					</div>
				</div>
			</div>	
		);
	}
}



