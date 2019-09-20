import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import FriendDisplay from '../components/FriendDisplay';
import InputTextField from '../components/InputTextField';
import InputSelectList from '../components/InputSelectList';

import Friend from '../mongo_schema/Friend';


import './ViewFriends.css';



export default class ViewFriends extends Component {


	constructor(props){
		super(props); 

		// bind input handler 
		this.handleInput = this.handleInput.bind(this);
	}

	state = { 
		translations: {
			'EN': {
				'headline': 'My friends',
				'more_options': 'More options',
				'less_options': 'Hide options',
				'filter_on_name': 'Filter on name',
				'time_filter': 'Filter on local time',
				'time_from': 'From',
				'time_to': 'To'
			},
			'SE': {
				'headline': 'Mina vänner',
				'more_options': 'Fler alternativ',
				'less_options': 'Dölj alternativ',
				'filter_on_name': 'Filtrera på namn',
				'time_filter': 'Filtrera på lokal tid', 
				'time_from': 'Från',
				'time_to': 'Till'
			}
		},
		timeSpan: [],
		friends: [],
		optionsExpanded: false,
		filters: {
			'nameFilter': '',
			'from_time': '',
			'to_time': ''
		},
		sorters: {
			'nameOrder': 'firstName'
		}
	};

	async componentDidMount(){
		// Get all friens
		let friends = await Friend.find({}, {populate: ['timeZone']}); 
		this.setState({ friends });

		this.buildTimeSpan(); 

		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
	}

	buildTimeSpan(){
		let timeSpan = []; 
		for(let i = 0; i < 24; i++){
			let hour = (i === 0 ? 12 : (i > 12 ? i%12 : i)), end = (i < 12 ? 'AM':'PM');
			timeSpan.push({ '24HOUR': `${i}`.padStart(2,0).concat(":00"), '12HOUR': `${hour}:00 ${end}`})
		}
		this.setState({ timeSpan });
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
	}

	handleInput(who, what){
		let filters = this.state.filters; 
		filters[who] = what
		this.setState({ filters })
	}

	toggleExpand(bool = !this.state.optionsExpanded){
		this.setState({optionsExpanded: bool}); 
	}

	friendsManipulated(){
		let o = this.state.friends, sorters = this.state.sorters; 
		o = o.filter(f => { 
			return f.firstName.concat(` ${f.lastName}`).toLowerCase().includes(this.state.filters.nameFilter.toLowerCase())
		});
		if(sorters.nameOrder === 'firstName'){
			o = o.sort((a, b) => (`${a.firstName} | ${a.lastName}`.toLowerCase()).localeCompare(`${b.firstName}  || ${b.lastName}`.toLowerCase()))
		} else if(sorters.nameOrder === 'lastName'){
			o = o.sort((a, b) => (`${a.lastName} | ${a.firstName}`.toLowerCase()).localeCompare(`${b.lastName} | ${b.firstName}`.toLowerCase()))
		} else if(sorters.nameOrder === 'timeZone'){
			o = o.sort((a, b) => (`${a.timeZone.name.replace(/ /g, '_')} | ${a.firstName} | ${a.lastName}`.toLowerCase()).localeCompare(`${b.timeZone.name.replace(/ /g, '_')} | ${a.firstName} | ${a.lastName}`.toLowerCase()))
		}
		return o;
	}

	render(){
		let text = this.state.translations[store.lang]; 
		return(
			<div>
				<div className="text-300 mb-3">{text['headline']}</div>
				
				<InputTextField 
					onInput={this.handleInput} 
					fieldName="nameFilter"
					placeHolder={ text['filter_on_name'] } />

				<div className={ this.state.optionsExpanded ? 'flex flex-dir-row justify-center mb-3' : 'hidden' }>
					<div className="flex-1 flex flex-dir-col"> 
						
						<div className="mb-3"> {text['time_filter']} </div>

						<div className="flex flex-1 flex-dir-col justify-center">
							<div>
								<InputSelectList 
									onInput={this.handleInput}
									fieldname="from_time"
									placeHolder={ text['time_from'] }
									displayField={store.timeFormat}
									items={ this.state.timeSpan } 
								/>
							</div>

							<div>
								<InputSelectList 
									onInput={this.handleInput}
									fieldname="to_time"
									placeHolder={ text['time_to'] }
									displayField={ store.timeFormat }
									items={ this.state.timeSpan } 
								/>
							</div>
						</div>

					</div>
				</div>

				<button
					onClick={ e => this.toggleExpand() }
					className="card-container p-2 orange mb-3 pointer">
					{ !this.state.optionsExpanded ? text['more_options'] : text['less_options'] }
				</button>

				{ this.friendsManipulated().map((item, index) => {
					return <FriendDisplay friend={item} key={item._id} /> 
				}) }
			</div>	
		);
	}
}


