import React, {Component} from 'react';
import store from '../util/Store'; 

export default class InputTextField extends Component {

	componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	state = {
		'input': '',
		'translations': {
			'EN': {
				'required': 'This field is required', 
				'min': 'Can\'t be shorter than', 
				'max': 'Can\'t be longer than'
			},
			'SE': {
				'required': 'Detta fält måste fyllas i',
				'min': 'Får inte vara kortare än',
				'max': 'Får inte vara längre än'
			}
		}
	}


	errors = []; 

	reactOnInput(e){
		// Clear errors 
		this.errors.length = 0; 


		let input = e.target.value; 

		if(!this.props.password){
			input = input.replace(/^[ ]*([^ ]?)|([^ ]? )[ ]*$|( )[ ]*/gi, '$1$2$3');
		}

		if(this.props.noWhiteSpace){
			input = input.replace(/\s/gi, ''); 
		}

		// Set state
		this.setState({ input })
		
		if(this.validateInput(input)){
			this.props.onInput(this.props.fieldName, this.props.password ? input : input.trim());
		} else {
			this.props.onInput(this.props.fieldName, undefined); 
		}
	}

	componentDidUpdate(){
		if(this.props.clear){
			setTimeout(() =>{
				this.errors.length = 0; 
				this.setState({input: ''});
				this.props.onInput(this.props.fieldName, this.state.input); 
			}, 1);
		}
		if(this.props.validate){
			setTimeout(() =>{
				this.validateInput(); 
			}, 1);
		}
	}

	validateInput(input = this.state.input){
		if(!input.length && this.props.requiredField){
			this.errors.push(`${this.state.translations[store.lang].required}`)
		}
		if(this.props.min && typeof this.props.min === 'number' && input.length < this.props.min){
			this.errors.push(`${this.state.translations[store.lang].min} ${this.props.min}`)
		}
		if(this.props.max && typeof this.props.max === 'number' && input.length > this.props.max){
			this.errors.push(`${this.state.translations[store.lang].max} ${this.props.max}`)
		}
		this.setState({}); 
		return !this.errors.length;
	}

	render(){
		let errorText = this.errors[0] || 'No errors'; 
		return(
			<div className="flex flex-dir-row mb-3">
				<div className="flex-1"></div>
				<div className="flex-3 flex flex-dir-col">
					<input type={ this.props.password ? 'password' : 'text' }
						className={ "card-container input-text-field p-3 flex-1 " + (this.errors.length ? 'has-errors-input' : '') }
						onChange={ e => this.reactOnInput(e) }
						placeholder={ this.props.placeHolder }
						value={this.state.input}/>	
					<div className={ "pt-1 input-error-text text-100 " + (this.errors.length ? 'block' : 'hidden') }>{ errorText }</div>
				</div>
				<div className="flex-1"></div>
			</div>
		)
	}
}
