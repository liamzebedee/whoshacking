import {
    observable
} from 'mobx';

export default class Model {
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
}