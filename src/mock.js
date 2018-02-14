import moment from 'moment';


export var myStatus = {
    currentProjects: [
        {
         "lastUpdate": moment().toISOString(),
         "name": "whoshacking-client",
         "url": "https://github.com/electron/electron-quick-start\n"
        },
        {
         "lastUpdate": "2018-02-14T16:32:06.454Z",
         "name": "whoshacking-server",
         "url": "https://git.heroku.com/whoshacking.git\n"
        },
        {
         "lastUpdate": "2018-02-14T16:32:06.454Z",
         "name": "whoshacking-server",
         "url": "https://git.heroku.com/whoshacking.git\n"
        }
    ],
};

export var users = [
    {
        id: "1",
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
        id: "2",
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
];

export var status = { "statusEvent": {
    "id": "2",
    profile: {
        username: "squishykid",
        photos: [
            { value: "https://avatars2.githubusercontent.com/u/2177912?s=460&v=4" }
        ]
    },
    "statuses": [
     {
      "currentProjects": [
       {
        "lastUpdate": moment().toISOString(),
        "name": "whoshacking-client",
        "url": "https://github.com/electron/electron-quick-start\n"
       },
       {
        "lastUpdate": "2018-02-14T16:32:06.454Z",
        "name": "whoshacking-server",
        "url": "https://git.heroku.com/whoshacking.git\n"
       },
       {
        "lastUpdate": "2018-02-14T16:32:06.454Z",
        "name": "whoshacking-server",
        "url": "https://git.heroku.com/whoshacking.git\n"
       }
      ],
      "time": moment().toISOString()
     }
    ]
  }
}