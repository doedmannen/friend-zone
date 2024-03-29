import React, {Component} from 'react';
import store from '../util/Store'; 

import './InputSelectList.css';

export default class InputSelectList extends Component {

	componentDidMount(){
		this._mounted = true; 
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
		this.checkPreSet(); 
	}

	componentWillUnmount(){
		this._mounted = false; 
		store.unSub(this.storeSub)
	}
	
	componentDidUpdate(){
		if(this.props.clear){
			setTimeout(() =>{
				this.clearInput(); 	
			}, 1);
		}
		if(this.props.validate){
			setTimeout(() =>{
				this.validateInput(); 
			}, 1);
		}
		this.checkPreSet(); 
	}

	checkPreSet(){
		if(!this.props.preSetItem){
			return; 
		}
		setTimeout(() => {
			if(!this._mounted)
				return; 
			if(!this.state.preSet){
				this.setState({ preSet: this.props.preSetItem }); 
				this.reactOnInput(this.props.preSetItem);
			} else {
				if(typeof this.props.items[0] === 'object' && Object.entries(this.state.preSet).flat().join("") !== Object.entries(this.props.preSetItem).flat().join("")){
					this.setState({ preSet: this.props.preSetItem })
					this.reactOnInput(this.props.preSetItem);
				} else if(this.state.preSet !== this.props.preSetItem) {
					this.setState({ preSet: this.props.preSetItem })
					this.reactOnInput(this.props.preSetItem);
				}
			}
		}, 1000)
	}

	toggleExpand(e, bool){
		if(typeof bool === 'boolean' && this.state.expand !== bool){
			this.setState({ expand: bool })
		} else {
			this.setState({ expand: !this.state.expand });
		}
	}

	state = {
		'input': '',
		'display': '',
		'expand': false,
		'value': '',
		'preSet': undefined,
		'translations': {
			'EN': {
				'required': 'This field is required', 
			},
			'SE': {
				'required': 'Detta fält måste fyllas i',
			}
		}
	}

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
		this.errors.length = 0; 
		let input = '', display = '';
		this.setState( { input, display } ); 
		this.props.onInput(this.props.fieldName, '');
	}

	validateInput(){
		if(this.state.input === '' && this.props.requiredField){
			this.errors.push(`${this.state.translations[store.lang].required}`)
		}
		this.setState({})
		return !this.errors.length;
	}

	handleInput(e){
		this.setState({ value: '' })
	}

	render(){
		let errorText = this.errors[0] || 'No errors';
		return(
			<div className="flex flex-dir-row mb-3">
				<div className="flex-1"></div>
				<div className="flex-3 flex flex-dir-col">
					<input type="text" 
						className={ "pointer card-container input-text-field p-3 flex-1 " + (this.errors.length ? 'has-errors-input' : '') }
						value={ this.state.value || this.state.display }
						style={this.state.expand ? { 'zIndex': '-100', position: 'absolute' } : {} }
						placeholder={ this.props.placeHolder }
						onBlur={ e => setTimeout(() => {this.toggleExpand(e, false)}, 200) }
						onFocus={ e => this.toggleExpand(e, true) }
						onClick={ e => this.toggleExpand(e, true) }
						onChange={ e => this.handleInput(e) } />	
						<div className={ "pt-1 input-error-text text-100 " + (this.errors.length && !this.state.expand ? 'block' : 'hidden') }>{ errorText }</div>

							<div 
								className={ "pointer list-drop-noeffect flex-1 flex-dir-col " 
										+ (this.state.expand ? 'flex' : 'hidden')
										+ (this.errors.length ? ' has-errors-input' : '') } >
								<div 
									className="p-3 flex-1"
									onClick={ e => this.clearInput() } >{ this.props.placeHolder }</div>

									{ this.props.items.map((item, index) => {
									return <div className="p-3 flex-1 listing-item" onClick={ e => this.reactOnInput(item) } key={index}> 
										{ ( this.props.displayField ? item[this.props.displayField] : item ) } 
										</div>
								} ) }
							</div>
				</div>
				<div className="flex-1"></div>
			</div>
		)
	}
}

