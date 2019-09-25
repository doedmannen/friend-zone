import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import InputTextField from '../components/InputTextField'; 
import InputPhoneNumberField from '../components/InputPhoneNumberField'; 
import InputEmailField from '../components/InputEmailField'; 
import InputSelectList from '../components/InputSelectList';

import TimeZone from '../mongo_schema/TimeZone';
import Friend from '../mongo_schema/Friend';



export default class EditFriend extends Component {

	constructor(props){
		super(props);

		// bind input handler
		this.handleInput = this.handleInput.bind(this);
	}

	state = {
		translations: {
			'EN': {
				'header': 'Edit friend',
				'button_ok': 'SAVE',
				'button_remove': 'REMOVE',
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
				'header': 'Redigera vän',
				'button_ok': 'SPARA',
				'button_remove': 'TA BORT', 
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
		formValidate: false,
		friend: null
	};

	async componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
		await this.loadTimeZones();
		await this.loadFriend(); 
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	async loadTimeZones(){
		let timeZones = await TimeZone.find();
		this.setState({timeZones}); 
	}

	async loadFriend(){
		let _id = this.props.history.location.search.replace(/\?id=(.{12})/gi,"$1");
		let friend = await Friend.findOne({_id}, {populate: ['timeZone']});
		this.setState({ friend }); 
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
			if(!this.state.inputFromFields[k])return; 
		}
		let friend = this.state.friend; 
		Object.assign(friend, this.state.inputFromFields)
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

	async remove(){
		await this.state.friend.delete(); 
		this.props.history.push('/myFriends'); 
	}

	render(){
		let text = this.state.translations[store.lang];
		let inputNames = this.state.translations[store.lang]['input_fields'];
		return(
			<div>
				{ this.state.friend === null ? null : 
				<div>
					<div className="text-300 mb-3">
						{ text['header'] }
					</div>

					<InputTextField 
						onInput={this.handleInput} 
						fieldName="firstName" 
						placeHolder={ inputNames['firstName'] }
						preSetValue={ this.state.friend.firstName }
						max={20}
						validate={ this.state.formValidate }
						requiredField={true} />

					<InputTextField 
						onInput={this.handleInput} 
						fieldName="lastName" 
						placeHolder={ inputNames['lastName'] }
						preSetValue={ this.state.friend.lastName }
						max={30}
						validate={ this.state.formValidate }
						requiredField={true} />

					<InputTextField 
						onInput={this.handleInput} 
						fieldName="country" 
						placeHolder={ inputNames['country'] }
						preSetValue={ this.state.friend.country }
						max={25}
						validate={ this.state.formValidate }
						requiredField={true} />

					<InputTextField 
						onInput={this.handleInput} 
						fieldName="city" 
						placeHolder={ inputNames['city'] }
						preSetValue={ this.state.friend.city }
						max={25}
						validate={ this.state.formValidate }
						requiredField={true} />

					<InputPhoneNumberField 
						onInput={this.handleInput} 
						fieldName="phone" 
						placeHolder={ inputNames['phone'] }
						preSetItems={ this.state.friend.phone }
						max={20}
						validate={ this.state.formValidate }
						requiredField={true} />

					<InputEmailField 
						onInput={this.handleInput} 
						fieldName="email" 
						placeHolder={ inputNames['email'] }
						preSetItems={ this.state.friend.email }
						max={255}
						validate={ this.state.formValidate }
						requiredField={true} />

		
					<InputSelectList 
						onInput={this.handleInput}
						fieldName="timeZone"
						placeHolder={ inputNames['timeZone'] }
						displayField="name"
						preSetItem={ this.state.friend.timeZone }
						validate={ this.state.formValidate }
						requiredField={ true }
						items={ this.state.timeZones } />


					<div className="flex">
						<div className="flex-1">
							
							<button 
								className="card-container p-3 pr-5 pl-5 pointer red ml-2"
								onClick={e => this.remove()}> { text['button_remove'] }
							</button>
							
							<button 
								className="card-container p-3 pr-5 pl-5 pointer green ml-2"
								onClick={e => this.submit()}> { text['button_ok'] }
							</button>
							
						</div>
					</div>
				</div>
				}
			</div>
		);
	}
}








