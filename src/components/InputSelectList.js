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

	toggleExpand(e, bool){
		if(typeof bool === 'boolean' && this.state.expand !== bool){
			this.setState({ expand: bool })
		} else {
			this.setState({ expand: !this.state.expand });
		}
		if(bool){
			// Scroll down on expand
			setTimeout(() =>{
				window.scrollTo(0, window.scrollY+(window.innerHeight*0.20))	
			}, 1);
		} else {
			setTimeout(() => {
				window.scrollTo(0, window.scrollY-(window.innerHeight*0.20))
			}, 1);
		}
	}

	state = {
		'input': '',
		'display': '',
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
		return 	}; 


	errors = []; 

	reactOnInput(item){
		// Clear errors 
		this.errors.length = 0; 
		let input = item, display = this.props.displayField ? item[this.props.displayField] : item;
		this.setState( { input, display } ); 
		if(this.validateInput){
			this.props.onInput(this.props.fieldName, item);
		}
	}	

	clearInput(){
		this.errors.lengt = 0; 
		let input = '', display = '';
		this.setState( { input, display } ); 
		this.props.onInput(this.props.fieldName, '');
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
						defaultValue={ this.state.display }
						style={this.state.expand ? { 'zIndex': '-100', position: 'absolute' } : {} }
						placeholder={ this.props.placeHolder }
						onBlur={ e => setTimeout(() => {this.toggleExpand(e, false)}, 500) }
						onFocus={ e => this.toggleExpand(e, true) }
						onClick={ e => this.toggleExpand(e, true) } />	
						<div className={ "pt-1 input-error-text text-100 " + (this.errors.length ? 'block' : 'hidden') }>{ errorText }</div>

					{ !this.state.expand ?
							null 
						: 
						<>
							<div 
								className={ "pointer list-drop-noeffect flex-1 flex flex-dir-col " + (this.errors.length ? 'has-errors-input' : '') } >
								<div 
									className="p-3 flex-1"
									onClick={ e => this.clearInput() } >{ this.props.placeHolder }</div>

									{ this.props.items.map((item, index) => {
									return <div className="p-3 flex-1 listing-item" onClick={ e => this.reactOnInput(item) } key={index}> 
										{ ( this.props.displayField ? item[this.props.displayField] : item ) } 
										</div>
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

