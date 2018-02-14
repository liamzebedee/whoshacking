import {
    observable,
    computed,
    ObservableMap,
} from 'mobx';
import store2 from 'store2';

const d3req = require('d3-request')
const io = require('socket.io-client')
const $ = require('jquery');
import _ from 'underscore'
import moment from 'moment';

const mock = require('./mock')

import { parseIntoDates } from './util';
// console.log(parseIntoDates(mock.status).statusEvent.statuses[0])

export var API_HOST = "http://0.0.0.0:3000";
// API_HOST = "https://whoshacking.liamz.co";

if(process.env.ELECTRON_ENV != 'development') {
    API_HOST = "https://whoshacking.liamz.co";
}

// export const API_HOST = "http://whoshacking.liamz.co";
const MINUTE = 1000 * 30;

class Model {
    @observable isLoggedIn = false;
    @observable feedItems = [];
    @observable users = observable.array();
    @observable status = new ObservableMap();
    projects = {};

    constructor() {
        this.loadSession()

        // Only update status max once per minute.
        // Much better than setTimeout, since this is called reactively, not proactively
        
        this.updateHackingStatus = _.throttle(this._updateHackingStatus, MINUTE)
        if(process.env.ELECTRON_ENV === 'development') {
            this.updateHackingStatus = this._updateHackingStatus;
        }

        if(process.env.ELECTRON_ENV === 'development') {
            this.users = mock.users;
            this.status = mock.myStatus;
            setTimeout(() => {
                this.updateStatusOfUser(mock.status.statusEvent)
            }, 2000)
        }
    }

    getUser() {
        return this.userSession;
    }

    getStatus() {
        return this.status;
    }
    
    notifyHacking(projectDir, name, url) {
        console.log("Hacking on", name, url)

        let project = this.projects[projectDir] || {};
        this.projects[projectDir] = {
            ...project,
            name,
            url,
            lastUpdate: new Date
        }

        this.updateHackingStatus()
    }

    _updateHackingStatus() {
        // Projects worked on within the past 20 mins
        let currentProjects = Object.values(this.projects).filter(project => {
            return moment(project.lastUpdate).isAfter(moment().subtract(20, 'minutes'))
        })
        this.status = {
            currentProjects,
        }

        this.socket.emit('current status', this.status)
    }

    connectRealtime() {
        this.socket = io(`${API_HOST}/?id=${this.userSession.id}&clientPassword=${this.userSession.clientPassword}`);
        this.socket.on('connect', () => {
        })
        this.socket.on('error', (error) => {
            console.error(error)
        });
        this.socket.on('status updated', function(msg) {
            
        });
    }

    updateStatusOfUser(statusEv) {
        let i = _.findIndex(this.users, user => user.id == statusEv.id)
        if(i === -1) {
            return console.error("couldn't find user from status event", statusEv)
        }
        this.users[i] = statusEv
    }

    isUserOnline(user) {
        if(user.id == this.userSession.id) return true;
        user = _.findWhere(this.users, { id: user.id })
        if(user) {
            return moment(user.statuses[0].time).isAfter(moment().subtract(10, 'minutes'))
        } else {
            return false
        }
    }

    loadSession() {
        this.userSession = store2('user')

        // Optimistic. Disable during debugging.
        this.isLoggedIn = false;

        if(this.userSession != null) {
            $.post({
                url: `${API_HOST}/auth/login`,
                data: {
                    username: this.userSession.id,
                    password: this.userSession.clientPassword,
                },
            }).then(res => {
                this.isLoggedIn = true;
                this.connectRealtime()
            })
        }
    }

    checkLogin() {
        d3req.json(`${API_HOST}/user`, (err, res) => {
            let success = res['id']
            if(success) {
                store2('user', {
                    ...res
                })
                this.loadSession()
            }
        })
    }
}

const model = new Model();



export default model;