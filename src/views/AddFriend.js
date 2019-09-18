import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import TimeZone from '../mongo_schema/TimeZone';

import './AddFriend.css';



export default class AddFriend extends Component {

	state = {
		translations: {
			'EN': {
				'header': 'Add friend',
				'button_ok': 'ADD',
				'button_clear': 'CLEAR'
			}, 
			'SE': {
				'header': 'Lägg till vän',
				'button_ok': 'LÄGG TILL',
				'button_clear': 'RENSA'
			}
		}, 
		timeZones: []
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

	nameFocus(e){
		console.log("hello")
	}

	printTimeZones(){
		if(this.state.timeZones.length){
			let o = this.state.timeZones.map((item, index) => <option className="flex-1" value={item._id}>{item.name}</option>);
			o.unshift(<option hidden>Select timezone</option>);
			return o; 
		}
		return null; 
	}

	render(){
		let text = this.state.translations[store.lang];
		return(
			<div>
				<div className="text-300 mb-3">
					{ text['header'] }
				</div>

	
				<div className="flex flex-dir-row mb-3">
					<div className="flex-1"></div>
					<div className="flex-3 flex">
						<input type="text" className="card-container input-text-field p-3 flex-1" placeholder="Firstname" />	
					</div>
					<div className="flex-1"></div>
				</div>

				<div className="flex flex-dir-row mb-3">
					<div className="flex-1"></div>
					<div className="flex-3 flex">
						<input type="text" className="card-container input-text-field p-3 flex-1" onFocus={this.nameFocus} placeholder="Lastname" />	
					</div>
					<div className="flex-1"></div>
				</div>

				<div className="flex flex-dir-row mb-3">
					<div className="flex-1"></div>
					<div className="flex-3 flex">
						<select className="card-container input-text-field p-3 flex-1">
							{ this.printTimeZones() }
						</select>
					</div>
					<div className="flex-1"></div>
				</div>



				<div className="flex">
					<div className="flex-1">
						<button className="card-container p-3 pr-5 pl-5 pointer red mr-2">{ text['button_clear'] }</button>
						<button className="card-container p-3 pr-5 pl-5 pointer green ml-2">{ text['button_ok'] }</button>
					</div>
				</div>
			</div>	
		);
	}
}


