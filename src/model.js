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

export const API_HOST = "http://0.0.0.0:3000";
// export const API_HOST = "http://whoshacking.liamz.co";
const MINUTE = 1000 * 60;

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

        this.users = [
            {
                id: 1,
                profile: {
                    username: "twitchyliquid64",
                    photos: [
                        { value: "https://avatars1.githubusercontent.com/u/6328589?s=460&v=4" }
                    ]
                },
                statuses: [
                    {
                        time: new Date,
                        currentProjects: []
                    }
                ]
            },
            {
                id: 1,
                profile: {
                    username: "squishykid",
                    photos: [
                        { value: "https://avatars2.githubusercontent.com/u/2177912?s=460&v=4" }
                    ]
                },
                statuses: [
                    {
                        time: moment().subtract(15, 'm').subtract(30, 's').toDate(),
                        currentProjects: [{
                            name: "swag",
                            url: "https://liamz.co"
                        }]
                    }
                ]
            }
        ]
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
        this.socket.send('current status', this.status)
    }

    handleUserHacking(msg) {
        // let myNotification = new Notification('Hacker online', {
        //     body: `Your friend ${msg.username} started hacking`
        // })
        
        // myNotification.onclick = () => {
        //     console.log('Notification clicked')
        // }
    }

    handleUserNotHacking(msg) {
        // let myNotification = new Notification('Hacker online', {
        //     body: `Your friend ${msg.username} started hacking`
        // })
        
        // myNotification.onclick = () => {
        //     console.log('Notification clicked')
        // }
    }

    connectRealtime() {
        this.socket = io(`${API_HOST}/?id=${this.userSession.id}&clientPassword=${this.userSession.clientPassword}`);

        this.socket.on('status updated', function(msg) {
            console.log(msg)
        });
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