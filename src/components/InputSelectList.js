import React, {Component} from 'react';
import store from '../util/Store'; 

import './InputSelectList.css';

export default class InputSelectList extends Component {

	componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	toggleExpand(bool){
		if(typeof bool === 'boolean'){
			this.setState({ expand: bool })
		} else {
			this.setState({ expand: !this.state.expand });
		}
		if(!this.state.expand){
			// Scroll down on expand
			setTimeout(() =>{
				window.scrollTo(0, window.scrollY+(window.innerHeight*0.20))	
			},2);
		}
	}

	state = {
		'input': '',
		'expand': false,
		'translations': {
			'EN': {
				'required': 'This field is required', 
			},
			'SE': {
				'required': 'Detta fält måste fyllas i',
			}
		}
	}

	display(){
		return this.props.displayField ? this.state.input[this.props.displayField] : this.state.input;
	}; 

	timer = null; 

	errors = []; 

	reactOnInput(item){
		// Clear errors 
		this.errors.length = 0; 
		this.setState( { input: item } ); 
		if(this.validateInput){
			this.props.onInput(this.props.fieldName, item);
		}
	}	

	validateInput(){
		if(this.state.input === null && this.props.requiredField){
			this.errors.push(`${this.state.translations[store.lang].required}`)
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
						className={ "pointer card-container input-text-field p-3 flex-1 " + (this.errors.length ? 'has-errors-input' : '') }
						value={ this.display() }
						style={this.state.expand ? { 'z-index': '-100', position: 'absolute' } : {} }
						placeholder={ this.props.placeHolder }
						readonly="readonly"
						onBlur={ e => this.toggleExpand(false) }
						onFocus={ e => this.toggleExpand(true) }
						onClick={ e => this.toggleExpand() } />	
						<div className={ "pt-1 input-error-text text-100 " + (this.errors.length ? 'block' : 'hidden') }>{ errorText }</div>

					{ !this.state.expand ?
							null 
						: 
						<>
							<div 
								className={ "pointer list-drop-noeffect flex-1 " + (this.errors.length ? 'has-errors-input' : '') }
								onClick={ e => this.toggleExpand() }>
								<div className="p-3">{ this.props.placeHolder }</div>
								{ this.props.items.map((item, index) => {
									return <div className="p-3 listing-item" onClick={ e => this.reactOnInput(item) } key={index}>{item.name} ({item.short})</div>
								} ) }
							</div>
						</>
					}
				</div>
				<div className="flex-1"></div>
			</div>
		)
	}
}

