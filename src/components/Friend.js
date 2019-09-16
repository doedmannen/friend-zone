import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import store from '../util/Store'; 
import Clock from './Clock';

import './Friend.css';



export default class Friend extends Component {

	state = { time: this.calcFriendTime() };

	sleep(ms){
		return new Promise((res,rej) => setTimeout(res, ms));
	};

	async updateClock(){
		while(this._isMounted){
			this.setState({ time: this.calcFriendTime() });
			await this.sleep(500);
		}
	}

	calcFriendTime(){
		let offset = this.props.timeZone.offset, dst = this.props.timeZone.dst, dst_offset = this.props.timeZone.dst_offset, analog, time; 

		time = new Date(Date.now() + offset + (dst ? dst_offset : 0)).toISOString().match(/\d{4}-|\d{2}-|\d{2}T|\d{2}:\d{2}:\d{2}/g).map(s => s.replace(/[^0-9:]/gi, "")).map(s => s.length === 2 ? s.replace(/^0/,""):s);
		time.push(time[time.length-1].match(/^\d{2}/)[0] / 1 > 11 ? `${time[time.length-1].match(/^\d{2}/)[0] - 12 === 0 ? 12 : time[time.length-1].match(/^\d{2}/)[0] - 12}${time[time.length-1].match(/:.*/)[0]} PM` : `${time[time.length-1]} AM`);

		analog = ((time[time.length-1].match(/\d{1,2}:?/g)[0].replace(/[^\d]/g, "").replace(/12/, "0") / 1) * 3600) + ((time[time.length-1].match(/\d{1,2}:?/g)[1].replace(/[^\d]/g, "") / 1) * 60) + (time[time.length-1].match(/\d{1,2}:?/g)[2].replace(/[^\d]/g, "") / 1); 

		return {YEAR: time[0], MONTH: time[1], DAY: time[2], TIME24: time[3], TIME12: time[4], TIMEANALOGDEGREE: {HOUR: ((analog * (360 / 43200))%360), MINUTE: ((analog * (360 / 3600))%360), SECOND: ((analog * (360 / 60))%360)}}
		
	}

	componentDidMount(){
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


	render(){
		let containerSize;
		switch(store.screenSize.name){
			case 'XS': 
				containerSize = 'flex-10';
				break;
			case 'SM': 
				containerSize = 'flex-8';
				break;
			case 'MD': 
				containerSize = 'flex-6';
				break;
			case 'LG': 
				containerSize = 'flex-4';
				break;
			default: 
				containerSize = 'flex-2';
				break;
		}


		return(
			<div className="flex flex-dir-row">
				<div className="flex-1"></div>	
				<div className={containerSize + ' flex flex-dir-row p-3 mr-5 ml-5 friendContainer'}>
					
					<div className="mr-2">
						<Clock key={Math.random()} size="50" timeAnalog={this.state.time.TIMEANALOGDEGREE} />
					</div>
					
					<div className="flex-1">
						<div>{this.props.firstName} {this.props.lastName} { this.props.country } { this.props.city }</div>
						<div className="digital-time">
							{ this.state.time.DAY }/  
							{ this.state.time.YEAR }/  
							{ this.state.time.MONTH + ' '}
							{' ' + this.state.time.TIME24 }
						</div>
					</div>
				
				</div>
				<div className="flex-1"></div>
			</div>	
		);
	}
}




