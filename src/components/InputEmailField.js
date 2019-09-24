import React, {Component} from 'react';
import store from '../util/Store'; 

export default class InputEmailField extends Component {

	componentDidMount(){
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);

		if(this.props.preSetItems && Array.isArray(this.props.preSetItems)){
			let input = this.props.preSetItems; 
			input.push(""); 
			this.setState({ input })
		}
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	state = {
		'input': [''],
		'translations': {
			'EN': {
				'required': 'This field is required', 
				'min': 'Can\'t be shorter than', 
				'max': 'Can\'t be longer than', 
				'invalid': 'Must be a valid email adress'
			},
			'SE': {
				'required': 'Detta fält måste fyllas i',
				'min': 'Får inte vara kortare än',
				'max': 'Får inte vara längre än',
				'invalid': 'Måste vara en giltig epostadress'
			}
		}
	}


	errors = []; 

	reactOnInput(e){
		// Save input since e seems to be fragile, also strip any whitespaces we dont need
		let input = this.state.input; 
		input[input.length-1] = e.target.value.replace(/ */gi, '');
	
		// Set state
		this.setState({ input })
		
	}

	reactOnCompletedInput(e){
		let input = this.state.input.filter(s => s.length); 
		if(this.validateInput(input)){
			this.props.onInput(this.props.fieldName, input);
		} else {
			this.props.onInput(this.props.fieldName, undefined); 
		}
	}

	componentDidUpdate(){
		if(this.props.clear){
			setTimeout(() =>{
				this.errors.length = 0; 
				this.setState({input: ['']});
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
		this.errors.length = 0; 
		if(!input.length && input.length === 1 && input[0].length === 0){
			this.errors.push(this.state.translations[store.lang].required)	
		}
		if(input.length){
			if(input[input.length-1].length && input[input.length-1].search(/^\w{3,}@\w{2,}\.\w{2,12}$/) !== 0){
				this.errors.push(this.state.translations[store.lang].invalid);
			}
			if(this.props.min && typeof this.props.min === 'number' && input[input.length-1].length < this.props.min){
				this.errors.push(`${this.state.translations[store.lang].min} ${this.props.min}`)
			}
			if(this.props.max && typeof this.props.max === 'number' && input[input.length-1].length > this.props.max){
				this.errors.push(`${this.state.translations[store.lang].max} ${this.props.max}`)
			}
		}
		this.setState({});

		return !this.errors.length; 
	}

	pushItem(){
		if(this.validateInput()){
			let input = this.state.input; 
			input.push('');
			this.setState({input})
		}
	}

	removeItem(index){
		let input = this.state.input; 
		input.splice(index, 1); 
		this.setState({input})
	}
	keyUpCheck(e){
		if(e.key === 'Enter'){
			this.pushItem(); 
		}
	}

	render(){
		let errorText = this.errors[0] || 'No errors', input = this.state.input; 
		return(
			<div className="flex flex-dir-row mb-3">
				<div className="flex-1"></div>
				<div className="flex-3 flex flex-dir-col">
					{ input.slice(0,input.length-1).map((item, index) => <div className="p-3 mb-3 card-container" key={index}> {item}</div> ) }
					<div className="flex-1 flex flex-dir-row align-items-center">
						<input type="text"
							className={ "card-container input-text-field p-3 flex-1 " + (this.errors.length ? 'has-errors-input' : '') }
							onChange={ e => this.reactOnInput(e) }
							placeholder={ this.props.placeHolder }
							onKeyUp={ e => this.keyUpCheck(e)}
							onBlur={ e => this.reactOnCompletedInput(e) }
							value={ input[input.length-1] } />
					</div>
					<div className={ "pt-1 input-error-text text-100 " + (this.errors.length ? 'block' : 'hidden') }>{ errorText }</div>
				</div>
				<div className="flex-1 flex flex-dir-col">
					{ input.slice(0,input.length-1).map((item, index) => <div className="p-3 mb-3 pointer text-left" onClick={e => this.removeItem(index)} key={'remover'+index}> <i className="fas fa-times-circle text-200 ml-3"> </i> </div> ) }

					<div className="pointer p-3 text-left" onClick={e => this.pushItem()}>
							<i className="fas fa-plus-circle text-200 ml-3"></i>
					</div>
				</div>
			</div>
		)
	}
}


