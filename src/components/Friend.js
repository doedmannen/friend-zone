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
		let containerSize, date = [], formatDate, time = " ", status;
		switch(store.screenSize.name){
			case 'XS': 
				containerSize = 'flex-10';
				break;
			case 'SM': 
				containerSize = 'flex-8';
				break;
			case 'MD': 
				containerSize = 'flex-1';
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
		status = <i class="fas fa-bed"></i> ;

		return(
			<div className="flex flex-dir-row" style={{'justify-content': 'center'}}>
				<div className="flex-1"></div>	
				<div className={containerSize + ' flex flex-dir-row p-3 card-container'}>
					
					<div className="mr-2 flex-2 flex" style={{'justify-content': 'space-around'}}>
						<Clock key={Math.random()} size="50" timeAnalog={this.state.time.TIMEANALOGDEGREE} />
					</div>
					
					<div className="flex-5">
						<div>
							<div>{status} {this.props.firstName} {this.props.lastName} </div>
							<div>{ this.props.country } { this.props.city }</div>
						</div>
						<div className="digital-time">
							{ date } 
							{ time } 
						</div>
					</div>
				</div>
				<div className="flex-1"></div>
			</div>	
		);
	}
}




