import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import InputTextField from '../components/InputTextField.js'; 
import Auth from '../util/Auth'; 
import User from '../mongo_schema/User';




export default class Login extends Component {


	constructor(props){
		super(props);


		this.handleInput = this.handleInput.bind(this); 
	}

	state = { 
		translations: {
			'EN': {
				'headline': 'Login', 
				'goToRegistration': 'Go to registration',
				'login': 'Login',
				'username': 'Username',
				'password': 'Password',
				'failed': 'The username and/or password did not match any user in our system. '
			},
			'SE': {
				'headline': 'Inloggning',
				'goToRegistration': 'Gå till registreringen',
				'login': 'Logga in',
				'username': 'Användarnamn', 
				'password': 'Lösenord', 
				'failed': 'Användarnamnet och/eller lösenordet matchade inte någon användare i vårt system. ' 
			}
		},
		input: {
			username: '',
			password: ''
		}, 
		formValidate: false,
		errorFailedLogin: false
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
		this.setState({ formValidate: true, errorFailedLogin: false })
		setTimeout(() => { this.setState({ formValidate: false }) }, 1); 

		for(let k in this.state.input){
			if(!this.state.input[k]) return;
		} 

		let user_id; 
	
		try{
			user_id = (await ( await fetch(`${window.location.origin}/api/auth`, { method: 'POST', body: JSON.stringify(this.state.input), headers: {'Content-Type': 'Application/JSON'}}) ).json()).user_id; 
		} catch(err){}

		if(user_id) {
			localStorage.setItem('user_id', user_id);
			console.log(user_id); 
			Auth();
			this.props.history.push('/');
		} else {
			this.setState({ errorFailedLogin: true })
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

				<div className={'flex-dir-row mb-3 ' + (this.state.errorFailedLogin ? 'flex': 'hidden')}>
					<div className="flex-1"></div>
					<div className="flex-1 card-container p-3 red">
						{ this.state.translations[store.lang].failed }
					</div>
					<div className="flex-1"></div>
				</div>

				<button 
					className="card-container p-3 pointer green"
					onClick={ e => this.submit() } > 
					{ this.state.translations[store.lang].login.toUpperCase() }
				</button>

				<div className="pb-5"></div>

				<button 
					className="card-container p-3 pointer blue "
					onClick={ e => this.props.history.push('/register') } > 
					{ this.state.translations[store.lang].goToRegistration.toUpperCase() }
				</button>


			</div>	
		);
	}
}


