const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const os = require('os'); 
const path = require('path'); 
const { URL } = require('url');

import { getAppPath } from './util';

import store from './store'; 
  

let activeRepos = {};

function getGitRemoteUrl(projectDir) {
    return new Promise(function(resolve, reject) {
        exec('git remote', { cwd: projectDir }, (error, stdout, stderr) => {
            let remotes = stdout.split('\n');  
    
            if(stdout.length && remotes.length) {
                exec(`git remote get-url ${remotes[0]}`, { cwd: projectDir }, (err, stdout, stderr) => {
                    if(stdout.length) {
                        return resolve(stdout);
                    } else {
                        return reject();
                    }
                });
            } else {
                return reject()
            }
        });
    })
}

function onRepoUpdate(gitDir) {
    let projectDir = path.dirname(gitDir);
    let projectDirName = path.basename(projectDir);
    getGitRemoteUrl(projectDir)
    .then(url => {
        store.notifyHacking(projectDir, projectDirName, url);
    }) 
    .catch(() => {
        store.notifyHacking(projectDir, projectDirName, '');
    })
    
    // git --git-dir /Users/liamz/Documents/electron-quick-start/.git --work-tree /Users/liamz/Documents/electron-quick-start
    
 
    // if no remotes, then use the parent dir name.
    // Remote.list(repo).then(function(remotes) {
    //     let url = remotes.length ? remotes.filter(remote => remote.name() == 'origin').url() : '';
    //     let name = path.basename(repo.path());
    //     console.log(name, url)
    // });
}

export function runGitWatcher() {
    let arch = getGOARCH();
    let os = getGOOS();

    let cmdPath = path.join(getAppPath(), `/vendor/gitmon-${os}-${arch}`);

    console.log(`Spawning git watcher: ${cmdPath}`)
    var ls    = spawn(cmdPath);
    
    ls.on('error', (ev) => {
        console.error(ev)
    })
    ls.stdout.on('data', function (data) {   
        // console.log('stdout : ' + data.toString());
    });

    ls.stderr.on('data', function (data) {
        let output = data.toString();

        // parse output in the format of:
        // 2018/01/30 17:30:42 Done
        // 2018/01/30 17:30:45 event: "/Users/liamz/Documents/electron-quick-start/.git/index": CHMOD

        let type = output.split(' ')[2];
        if(type === 'event:') {
            // /Users/liamz/Documents/electron-quick-start/.git/index
            let eventPath = output.split('"')[1];
            let gitDir = path.dirname(eventPath);

            onRepoUpdate(gitDir)
            // let repo = activeRepos[gitDir];

            // if(!repo) {
            //     Repository.open(gitDir).then(function(repo) {
            //         activeRepos[gitDir] = repo;
            //         onRepoUpdate(repo)
            //     })
            // } else {
            //     onRepoUpdate(repo)
            // }
            
        } else if(type === 'Done') {
            return
        }
    });

    ls.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
    });
}



function getGOARCH() {
    switch(require('arch')()) {
    case 'x86':
        return '386';
    case 'x64':
        return 'amd64';
    }
    throw new Error("couldnt get arch")
}

function getGOOS() {
    switch(os.type()) {
    case 'Windows_NT':
        return 'windows';
    case 'Darwin':
        return 'darwin';
    case 'Linux':
        return 'linux';
    }
    throw new Error("couldnt get os")
}