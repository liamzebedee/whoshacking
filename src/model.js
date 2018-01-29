import {
    observable,
    computed,
    ObservableMap
} from 'mobx';
const d3req = require('d3-request')
import store2 from 'store2';
const io = require('socket.io-client')

const $ = require('jquery');


export const API_HOST = "http://localhost:3000";

export default class Model {
    @observable isLoggedIn = false;
    @observable feedItems = [];
    @observable online = new ObservableMap();

    constructor() {
        this.loadSession()
        this.connectRealtime()
        this.loadPosts()
    }

    loadPosts() {
        d3req.json(`${API_HOST}/activity`, (err, res) => {
            this.feedItems = res
        })
    }

    post(stuff) {
        $.post({
            url: `${API_HOST}/activity`,
            data: {
                stuff: stuff 
            },
        })
    }

    connectRealtime() {
        this.socket = io(API_HOST);
        this.socket.on('online', function(msg) {
            this.online.set(msg.id, true);
        });
        this.socket.on('offline', function(msg) {
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
        this.isLoggedIn = true;
        if(this.userSession != null) {
            $.post({
                url: `${API_HOST}/auth/login`,
                data: {
                    username: this.userSession.id,
                    password: this.userSession.clientPassword,
                },
            }).then(res => {
                this.isLoggedIn = true;
            })
        }
    }

    checkLogin() {
        d3req.json(`${API_HOST}/user`, (err, res) => {
            let success = res['id']
            if(success) {
                store2('userSession', res)
                this.loadSession()
            }
        })
    }
}