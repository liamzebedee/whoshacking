import React, { Component } from "react";
import styles from './item.css';
import { observer } from "mobx-react";

import moment from 'moment';

@observer
export default class Feed extends React.Component {
    render() {
        return <div>
            {this.props.items.map((item, i) => <Item key={i} {...item}/>)}
        </div>
    }
}

function spotifyStyleTime(time) {
    let ago = moment(moment(time).diff(new Date));
    if(ago.hour()) {
        return ago.format('H') + 'h'
    } else if(ago.minute()) {
        return ago.format('m') + 'm'
    }
    throw Error()
}

const Item = (props) => {
    let avatar;
    if(props.profile.photos.length) {
        avatar = props.profile.photos[0].value;
    }
    
    return <div className={styles.item}>
        <div className={styles.avatar} style={{
            backgroundImage: `url(${avatar})`
        }}></div>
        <div className={styles.body}>
            <div className={styles.username}>{props.profile.username}</div>
            <div className={styles.stuff}>{props.stuff}</div>
        </div>
        <div className={styles.status}>
            {store.isUserOnline(props.profile) ?
            <img src="static/online.png"/> :
            spotifyStyleTime(props.time)}
        </div>
    </div>
}
