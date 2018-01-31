import {
    observable,
    computed,
    ObservableMap
} from 'mobx';
import store2 from 'store2';

const d3req = require('d3-request')
const io = require('socket.io-client')
const $ = require('jquery');
import _ from 'underscore'
import moment from 'moment';

export const API_HOST = "http://0.0.0.0:3000";
// export const API_HOST = "http://whoshacking.liamz.co";
const MINUTE = 1000 * 60;

class Model {
    @observable isLoggedIn = false;
    @observable feedItems = [];
    @observable matesStatus = new ObservableMap();
    @observable status = new ObservableMap();
    projects = {};

    constructor() {
        this.loadSession()

        // Only update status max once per second.
        // Much better than setTimeout, since this is called reactively, not proactively
        this.updateHackingStatus = _.throttle(this._updateHackingStatus, MINUTE)
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
        // Projects worked on within the past 10 mins
        let currentProjects = Object.values(this.projects).filter(project => {
            return moment(project.lastUpdate).isAfter(moment().subtract(10, 'minutes'))
        })
        this.status = {
            currentProjects,
        }
        this.socket.send('set status', this.status)
    }

    handleUserOnlineHacking(msg) {

        // let myNotification = new Notification('Hacker online', {
        //     body: `Your friend ${msg.username} started hacking`
        // })
        
        // myNotification.onclick = () => {
        //     console.log('Notification clicked')
        // }
    }

    connectRealtime() {
        this.socket = io(`${API_HOST}/?id=${this.userSession.id}&clientPassword=${this.userSession.clientPassword}`);

        this.socket.on('hacking', function(msg) {
            this.handleUserOnlineHacking(msg)
        });
        this.socket.on('not hacking', function(msg) {
            this.online.set(msg.id, false);
        });
    }

    isUserOnline(user) {
        if(user.id == this.userSession.id) return true;
        return this.online.get(user.id);
    }

    loadSession() {
        this.userSession = store2('userSession')

        // Optimistic. Disable during debugging.
        // this.isLoggedIn = true;

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
                store2('userSession', {
                    ...res
                })
                this.loadSession()
            }
        })
    }
}

const model = new Model();
export default model;