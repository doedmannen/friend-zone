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

		// bind functions 
		this.handleInput = this.handleInput.bind(this);
		this.registerHidden = this.registerHidden.bind(this); 
	}

	state = { 
		translations: {
			'EN': {
				'headline': 'My friends',
				'more_options': 'More options',
				'less_options': 'Hide options',
				'filter_on_name': 'Filter on name',
				'sort_on': 'Sorted on...',
				'time_filter': 'Filter on local time',
				'time_from': 'From',
				'time_to': 'To',
				'sorting_options': [
					{ 'key': 'firstName', 'content': 'Sort on first name' },
					{ 'key': 'lastName', 'content': 'Sort on last name' },
					{ 'key': 'timeZone', 'content': 'Sort on time zone' }
				], 
				'no_friends': 'You have no friends added', 
				'no_match': 'No friend matches the filters'
			},
			'SE': {
				'headline': 'Mina vänner',
				'more_options': 'Fler alternativ',
				'less_options': 'Dölj alternativ',
				'filter_on_name': 'Filtrera på namn',
				'sort_on': 'Sortera på...',
				'time_filter': 'Filtrera på lokal tid', 
				'time_from': 'Från',
				'time_to': 'Till',
				'sorting_options': [
					{ 'key': 'firstName', 'content': 'Sortera på förnamn' },
					{ 'key': 'lastName', 'content': 'Sortera på efternamn' },
					{ 'key': 'timeZone', 'content': 'Sortera på tidszon' }
				],
				'no_friends': 'Du har inga vänner tillagda', 
				'no_match': 'Ingen vän matchar dina filter'
			}
		},
		timeSpan: [],
		friends: [],
		friendsCollected: false,
		hiddenFriends: [],
		optionsExpanded: false,
		filterAndSort: {
			'nameFilter': '',
			'fromTime': '',
			'toTime': '',
			'sortOrder': {'key': 'firstName', 'content': 'I have the power'}
		}
	};

	async componentDidMount(){
		// Get all friens
		let friends = await Friend.find({owner: store.user}, {populate: ['timeZone']}); 
		this.setState({ friends, friendsCollected: true });

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
		let filterAndSort = this.state.filterAndSort; 
		filterAndSort[who] = what;
		this.setState({ filterAndSort })
	}

	toggleExpand(bool = !this.state.optionsExpanded){
		this.setState({optionsExpanded: bool}); 
	}

	friendsManipulated(){
		let o = this.state.friends, fas = this.state.filterAndSort;
		o = o.filter(f => { 
			return f.firstName.concat(` ${f.lastName}`).toLowerCase().includes(fas.nameFilter.toLowerCase())
		});
		if(fas.sortOrder.key === 'firstName'){
			o = o.sort((a, b) => (`${a.firstName} | ${a.lastName}`.toLowerCase()).localeCompare(`${b.firstName}  || ${b.lastName}`.toLowerCase()))
		} else if(fas.sortOrder.key === 'lastName'){
			o = o.sort((a, b) => (`${a.lastName} | ${a.firstName}`.toLowerCase()).localeCompare(`${b.lastName} | ${b.firstName}`.toLowerCase()))
		} else if(fas.sortOrder.key === 'timeZone'){
			o = o.sort((a, b) => (`${a.timeZone.name.replace(/ /g, '_')} | ${a.firstName} | ${a.lastName}`.toLowerCase()).localeCompare(`${b.timeZone.name.replace(/ /g, '_')} | ${a.firstName} | ${a.lastName}`.toLowerCase()))
		}
		return o;
	}

	getStartLimit(){
		let time = this.state.filterAndSort.fromTime; 
		return time ? (time['24HOUR'].replace(/:/gi, "") / 1) : null; 
	}
	getStopLimit(){
		let time = this.state.filterAndSort.toTime;
		return time ? (time['24HOUR'].replace(/:/gi, "") / 1) : null; 
	}


	registerHidden(who, hide){
		let hiddenFriends = this.state.hiddenFriends; 
		if(hide){
			hiddenFriends.push(who); 
		} else {
			hiddenFriends = hiddenFriends.filter(s => s !== who); 
		}
		this.setState({ hiddenFriends }); 
	}

	noResultsFeedback(){
		if(this.state.friendsCollected){
			if(!this.state.friends.length && this.state.friendsCollected) {
				return <div>{ this.state.translations[store.lang].no_friends }</div>
			} else if(!this.friendsManipulated().length || this.friendsManipulated().length === this.state.hiddenFriends.length) {
				return <div>{ this.state.translations[store.lang].no_match }</div>
			}
		}
		return null; 
	}

	render(){
		let text = this.state.translations[store.lang]; 
		return(
			<div>
				<div className="text-300 mb-3">{text['headline']}</div>
				
				<InputTextField 
					onInput={ this.handleInput } 
					fieldName="nameFilter"
					placeHolder={ text['filter_on_name'] } />


				<div className={ this.state.optionsExpanded ? 'flex flex-dir-row justify-center mb-3' : 'hidden' }>
					<div className="flex-1 flex flex-dir-col"> 




						<div className="flex flex-1 flex-dir-col justify-center">

						<div>
							<InputSelectList 
								onInput={ this.handleInput }
								fieldName="sortOrder"
								placeHolder={ this.state.translations[store.lang]['sort_on'] } 
								displayField="content" 
								items={ this.state.translations[store.lang].sorting_options } />
						</div>
						

						<div className="mb-3"> {text['time_filter']} </div>


							<div>
								<InputSelectList 
									onInput={ this.handleInput }
									fieldName="fromTime"
									placeHolder={ text['time_from'] }
									displayField={ store.timeFormat }
									items={ this.state.timeSpan } 
								/>
							</div>

							<div>
								<InputSelectList 
									onInput={ this.handleInput }
									fieldName="toTime"
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
					className="card-container p-3 orange mb-3 pointer">
					{ (!this.state.optionsExpanded ? text['more_options'] : text['less_options']).toUpperCase() }
				</button>

				{ this.friendsManipulated().map((item, index) => {
					return <FriendDisplay 
										friend={ item } 
										limitStart={ this.getStartLimit() } 
										limitStop={ this.getStopLimit() } 
										key={ item._id }
										onTimeHide={ this.registerHidden } /> 
				}) }

				{
					this.noResultsFeedback() 
				}
			</div>	
		);
	}
}


