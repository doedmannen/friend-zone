import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import InputTextField from '../components/InputTextField.js'; 
import Auth from '../util/Auth'; 
import User from '../mongo_schema/User';

import './Register.css';



export default class Register extends Component {


	constructor(props){
		super(props);

		this.handleInput = this.handleInput.bind(this); 
	}

	state = { 
		translations: {
			'EN': {
				'headline': 'Register new account', 
				'goToLogin': 'Go to login',
				'register': 'Register',
				'username': 'Username',
				'password': 'Password', 
				'alreadyExists': 'A user with that username already exists'
			},
			'SE': {
				'headline': 'Registrera nytt konto',
				'goToLogin': 'Gå till inloggningen',
				'register': 'Registrera',
				'username': 'Användarnamn', 
				'password': 'Lösenord', 
				'alreadyExists': 'Det finns redan en användare med det användarnamnet'
			}
		},
		input: {
			username: '',
			password: ''
		}, 
		formValidate: false,
		errorUserExists: false
	};
	
	componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
			// Deny logged in users to reach here
			if(changes.user){
				this.props.history.push('/')
			}
		}
		store.subTo(this.storeSub);
		// Deny logged in users to reach here
		if(store.user){
			this.props.history.push('/')
		}
	}


	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	handleInput(who, what){
		let input = this.state.input; 
		input[who] = what;
		this.setState({ input })
	}

	async submit(){
		this.setState({ formValidate: true, errorUserExists: false })
		setTimeout(() => { this.setState({ formValidate: false }) }, 1); 

		for(let k in this.state.input){
			if(!this.state.input[k]) return;
		} 

		let user, isAvailable = false; 
	
		try{
			isAvailable = (await ( await fetch(`${window.location.origin}/api/checkUserName/${this.state.input.username}`) ).json()).isAvailable; 
		} catch(err){}

		if(isAvailable) {
			user = new User({ username: this.state.input.username, password: this.state.input.password, lang: store.lang, timeFormat: '24HOUR', dateFormat: 'DD/MM/YYYY', friends: [] })
			await user.save();
			localStorage.setItem('user_id', user._id);
			Auth();
			this.props.history.push('/');
		} else {
			this.setState({ errorUserExists: true })
		}
	}

	checkIfEnter(key){
		if(key === 'Enter')
			this.submit(); 
	}

	render(){
		return(
			<div>
				<div className="text-300 mb-3">
					{ this.state.translations[store.lang].headline }
				</div>
				
				<div onKeyUp={ e => this.checkIfEnter(e.key) }>

					<InputTextField 
						onInput={ this.handleInput }
						fieldName="username"
						placeHolder={ this.state.translations[store.lang].username }
						requiredField={ true }
						validate={ this.state.formValidate }
					/>

					<InputTextField 
						password={ true }
						onInput={ this.handleInput }
						fieldName="password"
						placeHolder={ this.state.translations[store.lang].password }
						requiredField={ true }
						validate={ this.state.formValidate }
					/>
				</div>

				<div className={'flex-dir-row mb-3 ' + (this.state.errorUserExists ? 'flex': 'hidden')}>
					<div className="flex-1"></div>
					<div className="flex-1 card-container p-3 red">
						{ this.state.translations[store.lang].alreadyExists }
					</div>
					<div className="flex-1"></div>
				</div>

				<button 
					className="card-container p-3 pointer green"
					onClick={ e => this.submit() } > 
					{ this.state.translations[store.lang].register.toUpperCase() }
				</button>

				<div className="pb-5"></div>

				<button 
					className="card-container p-3 pointer blue "
					onClick={ e => this.props.history.push('/login') } > 
					{ this.state.translations[store.lang].goToLogin.toUpperCase() }
				</button>


			</div>	
		);
	}
}


