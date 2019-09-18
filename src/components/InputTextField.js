import React, {Component} from 'react';
import store from '../util/Store'; 

export default class AddFriend extends Component {

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

	timer = null; 

	errors = []; 

	reactOnInput(e){
		// Clear errors 
		this.errors.length = 0; 

		// Validate timer
		if(this.timer !== null) window.clearTimeout(this.timer);
		// Save input since e seems to be fragile, also strip any whitespaces we dont need
		let input = e.target.value.replace(/^[ ]*([^ ]?)|([^ ]?)[ ]*$|( )[ ]*/gi, '$1$2$3');

		// Wait until input is validated
		this.timer = setTimeout(() => {
			if(input !== this.state.input){
				// Clear parent
				this.props.onInput(this.props.fieldName, '');
				// Set state
				this.setState({ input })
				if(this.validateInput()){
					this.props.onInput(this.props.fieldName, this.state.input);
				} else {
					this.setState({});
				}
			}
		}, 200);

	}	

	validateInput(){
		console.log(this.props);
		if(!this.state.input.length && this.props.requiredField){
			this.errors.push(`${this.state.translations[store.lang].required}`)
		}
		if(this.props.min && typeof this.props.min === 'number' && this.state.input.length < this.props.min){
			this.errors.push(`${this.state.translations[store.lang].min} ${this.props.min}`)
		}
		if(this.props.max && typeof this.props.max === 'number' && this.state.input.length > this.props.max){
			this.errors.push(`${this.state.translations[store.lang].max} ${this.props.max}`)
		}
		return !this.errors.length;
	}

	render(){
		let errorText = this.errors[0] || 'No errors'; 
		return(
			<div className="flex flex-dir-row mb-3">
				<div className="flex-1"></div>
				<div className="flex-3 flex flex-dir-col">
					<input type="text" 
						className={ "card-container input-text-field p-3 flex-1 " + (this.errors.length ? 'has-errors-input' : '') }
						onChange={ e => this.reactOnInput(e) }
						placeholder={ this.props.placeHolder } />	
					<div className={ "pt-1 input-error-text text-100 " + (this.errors.length ? 'block' : 'hidden') }>{ errorText }</div>
				</div>
				<div className="flex-1"></div>
			</div>
		)
	}
}
