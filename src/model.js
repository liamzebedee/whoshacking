import {
    observable,
    computed,
    ObservableMap
} from 'mobx';

import store2 from 'store2';

const d3req = require('d3-request')





// ObservableMap
export default class Model {
    @observable isLoggedIn = false;

    constructor() {
        this.userSession = store2('userSession')
    }

    loadSession() {
        this.userSession = store2('userSession')
        if(this.userSession != null) {
            this.isLoggedIn = true;
        }
    }

    checkLogin() {
        d3req.json('http://localhost:3000/user', (err, res) => {
            let success = res['id']
            if(success) {
                store2('userSession', res)
                this.loadSession()
            }
        })
    }

    @observable user;
    @observable feedItems = [
        {
            user: {
                avatar: "https://avatars1.githubusercontent.com/u/584141?s=460&v=4",
                username: "liamzebedee",
                online: true
            },
            stuff: "Hacking on graphparse",
            time: new Date
        },
        {
            user: {
                avatar: "https://avatars1.githubusercontent.com/u/6328589?s=460&v=4",
                username: "twitchyliquid64",
                online: true
            },
            stuff: "Hacking on subnet",
            time: new Date
        },
        {
            user: {
                avatar: "https://avatars1.githubusercontent.com/u/6328589?s=460&v=4",
                username: "twitchyliquid64",
                online: false
            },
            stuff: "Hacking on subnet",
            time: new Date
        }
    ];

    get isLoggedIn() {
        return this.userSession;
    }
}