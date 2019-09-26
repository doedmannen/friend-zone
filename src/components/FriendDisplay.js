import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';                
import store from '../util/Store'; 
import Clock from './Clock';

import './FriendDisplay.css';



export default class FriendDisplay extends Component {

	state = { 
		time: this.calcFriendTime(),
		hideMe: false,
		expanded: false,
		translations: {
			'EN': {
				'phone': 'Phone numbers', 
				'no_phone': 'No phone numbers',
				'email': 'Email',
				'no_email': 'No email addresses',
				'edit_friend': 'Edit friend'
			},
			'SE': {
				'phone': 'Telefonnummer',
				'no_phone': 'Inga telefonnummeri', 
				'email': 'E-post', 
				'no_email': 'Inga e-postadresser',
				'edit_friend': 'Redigera vän'
			}
		}
	};

	sleep(ms){
		return new Promise((res,rej) => setTimeout(res, ms));
	};

	async updateClock(){
		while(this._isMounted){
			this.setState({ time: this.calcFriendTime() });
			this.filterCheck();
			await this.sleep(500);
		}
	}



	calcFriendTime(){
		let o, t = this.props.friend.timeZone, time, analog, dst;

		dst = t.dst && Date.now() > t.dst_from && Date.now() < t.dst_to;

		time = new Date(Date.now() + t.offset + (dst ? t.dst_offset : 0)).toISOString().match(/\d{4}-|\d{2}-|\d{2}T|\d{2}:\d{2}:\d{2}/g).map(s => s.replace(/[^0-9:]/gi, "")).map(s => s.length === 2 ? s.replace(/^0/,""):s);
		
		time.push(time[time.length-1].match(/^\d{2}/)[0] / 1 > 11 ? `${time[time.length-1].match(/^\d{2}/)[0] - 12 === 0 ? 12 : time[time.length-1].match(/^\d{2}/)[0] - 12}${time[time.length-1].match(/:.*/)[0]} PM` : `${time[time.length-1]} AM`);

		analog = ((time[time.length-1].match(/\d{1,2}:?/g)[0].replace(/[^\d]/g, "").replace(/12/, "0") / 1) * 3600) + ((time[time.length-1].match(/\d{1,2}:?/g)[1].replace(/[^\d]/g, "") / 1) * 60) + (time[time.length-1].match(/\d{1,2}:?/g)[2].replace(/[^\d]/g, "") / 1); 

		return {YEAR: time[0], MONTH: time[1], DAY: time[2], TIME24: time[3], TIME12: time[4], RAWHM: (time[3].replace(/:|\d\d$/gi, "") / 1), TIMEANALOGDEGREE: {HOUR: ((analog * (360 / 43200))%360), MINUTE: ((analog * (360 / 3600))%360), SECOND: ((analog * (360 / 60))%360)}};

	}

	filterCheck(){
		let hideMe = false, raw = this.state.time.RAWHM, start = this.props.limitStart, stop = this.props.limitStop; 
		if(start !== null && stop !== null){
			if(start < stop){
				if(raw < start || raw > stop){
					hideMe = true;  
				}
			} else if(stop < start){
				if(raw < start && raw > stop){
					hideMe = true; 
				}	
			}
		}
		if(hideMe !== this.state.hideMe){
			this.props.onTimeHide(this.props.friend._id, hideMe)
			this.setState({ hideMe })
		}		
	
	}


	componentDidMount(){
		this.props.onTimeHide(this.props.friend._id, false)
		this.storeSub = (changes) => {
			this.setState( { } );
		}
		store.subTo(this.storeSub);
		this._isMounted = true; 
		this.updateClock();
	}

	componentWillUnmount(){
		store.unSub(this.storeSub)
		this._isMounted = false;
	}

	toggleFriendExpand(){
		let expanded = !this.state.expanded; 
		this.setState({ expanded })
	}

	printAllPhoneNumbers(){
		if(this.props.friend.phone.length){
			return this.props.friend.phone.map((s, index) => <div key={ this.props.friend._id + index } className="text-50">{ s }</div>)
		} else {
			return <div><em className="text-50">{ this.state.translations[store.lang].no_phone }</em></div>
		}
	}

	printAllEmails(){
		if(this.props.friend.email.length){
			return this.props.friend.email.map((s, index) => <div key={this.props.friend._id + index} className="text-50">{ s }</div>)
		}else {
			return <div><em className="text-50">{ this.state.translations[store.lang].no_email }</em></div>
		}
	}


	render(){
		let containerSize, date = [], formatDate, time = " ", status;
		switch(store.screenSize.name){
			case 'XS': 
				containerSize = 'flex-10';
				break;
			case 'SM': 
				containerSize = 'flex-4';
				break;
			case 'MD': 
				containerSize = 'flex-2';
				break;
			case 'LG': 
				containerSize = 'flex-1';
				break;
			default: 
				containerSize = 'flex-1';
				break;
		}

		formatDate = store.dateFormat.match(/[a-z]+/ig);
		for(let s of formatDate){
			if(s === 'DD'){
				date.push(this.state.time.DAY);
			} else if (s === 'MM'){
				date.push(this.state.time.MONTH);
			} else {
				date.push(this.state.time.YEAR);
			}
		}
		date = date.join("/");
		time += store.timeFormat === '24HOUR' ? this.state.time.TIME24 : this.state.time.TIME12;  
		status = <i className="fas fa-bed"></i> ;


		return(
			<div className={this.state.hideMe ? 'hidden' : 'flex flex-dir-row justify-center mb-3 '}>
				<div className="flex-1"></div>	
				<div
					onClick={e => this.toggleFriendExpand() }
					className={containerSize + ' flex flex-dir-col p-3 card-container pointer'}>
					
					<div className="flex flex-1 flex-dir-row">	
					<div className="flex-1 flex justify-center align-items-center">
						<Clock size="50" timeAnalog={this.state.time.TIMEANALOGDEGREE} />
					</div>
					
					<div className="flex-5">
						<div>
							<div>{status} {this.props.friend.firstName} {this.props.friend.lastName} </div>
							<div>{ this.props.friend.country }, { this.props.friend.city }</div>
							<div className="text-50">{`${this.props.friend.timeZone.name} ${this.props.friend.timeZone.short}`}</div>
						</div>
						<div className="digital-time">
							{ date } 
							{ time } 
						</div>
					</div>
				</div>

				{
					this.state.expanded && 
						<div className="mt-3" onClick={ e => e.stopPropagation() }>
							<div className="mt-2">
									{ this.state.translations[store.lang].phone }
							</div>
							<div>
								{ this.printAllPhoneNumbers() } 
							</div>

							<div className="mt-2">
									{ this.state.translations[store.lang].email }
							</div>
							<div>
								{ this.printAllEmails() }
							</div>

							<div className="pt-3">
								<Link to={ '/editFriend?id=' + this.props.friend._id }>
									<i className="fas fa-cog text-200 pr-3"></i> 
									{ this.state.translations[store.lang].edit_friend }
								</Link>
							</div>
						</div>
				}

				</div>		
				<div className="flex-1"></div>
			</div>	
		);
	}
}




