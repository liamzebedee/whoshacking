import React, { Component } from "react";
import styles from '../styles/item.css';
import { observer } from "mobx-react";
import _ from 'underscore';

import moment from 'moment';
import HackerStatus from './HackerStatus';
import FlipMove from 'react-flip-move';


@observer
export default class Feed extends React.Component {
    render() {
        // sort descending of online
        let users = store.users;
        var userActivity = _.sortBy(users, function(user) {
            return -(new Date(user.statuses[0].time).getTime());
        });

        return <div>
            <FlipMove duration={500} easing="ease-out">
                {userActivity.map((item, i) => <Item key={item.id} {...item}/>)}
            </FlipMove>
        </div>
    }
}

function spotifyStyleTime(time) {
    let ago = moment.duration(moment().diff(time));
    
    let times = [ago.years(), ago.weeks(), ago.days(), ago.hours(), ago.minutes()]
    let fmts = ['y', 'w', 'd', 'h', 'm']
    let biggestTime;
    let i = _.findIndex(times, x => x != 0)

    return `${times[i]}${fmts[i]}`;
}

function isOnline(time) {
    return moment(time).isAfter(moment().subtract(15, 'minutes'));
}

class Item extends React.Component {
    render() {
        let props = this.props;
        
        let avatar;
        if(props.profile.photos.length) {
            avatar = props.profile.photos[0].value;
        }

        let latestStatus = props.statuses[0];
        
        return <div className={styles.item}>
            <div className={styles.avatar} style={{
                backgroundImage: `url(${avatar})`
            }}></div>
            <div className={styles.body}>
                <div className={styles.username}>{props.profile.username}</div>
                <div className={styles.status}>
                    <HackerStatus status={latestStatus}/>
                </div>
            </div>
            <div className={styles.timeIndicator}>
                <TimeIndicator time={latestStatus.time}/>
            </div>
        </div>
    }
}

class TimeIndicator extends React.Component {
    componentDidMount() {
        setTimeout(() => {
            this.forceUpdate()
        }, 1000 * 60) // update once every minute
    }

    render() {
        let timeIndicator;
        if(isOnline(this.props.time)) {
            return <img src="static/online.png"/>
        } else {
            return spotifyStyleTime(this.props.time)
        }
    }
}