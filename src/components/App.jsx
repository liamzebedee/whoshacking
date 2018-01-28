import React, { Component } from "react";
import { observer } from "mobx-react";
// import {Editor, EditorState} from 'draft-js';
// import {Input, TextArea, GenericInput} from 'react-text-input'
// var TextArea = require('react-text-input').TextArea; // ES5

import TextareaAutosize from 'react-autosize-textarea';
// const {BrowserWindow} = require('electron')
import electron from 'electron';
const BrowserWindow = electron.remote.BrowserWindow;




import 'normalize.css';
import styles from './styles.css';


import Feed from './feed';

@observer
export default class App extends React.Component {
  render() {
    return <div className={styles.app}>
      <div className={styles.appWrap}>
        {this.props.store.isLoggedIn ? 
        
        <div className={styles.feed}>
          <Feed items={this.props.store.feedItems}/>
          <UpdateFeed/>
        </div> : 
      
        <LoginView/>}
        <footer className={styles.footer}>>hackfeed</footer>
      </div>
    </div>
  }
}

class LoginView extends React.Component {
  startLogin() {
    let win = new BrowserWindow({
      width: 800, 
      height: 600,
      partition: 'persist:main',
    })
    win.on('close', () => {
      store.checkLogin()
    })
    win.loadURL("http://localhost:3000/auth/github")
  }

  render() {
    return <div className={styles.loginView}>
      <p className={styles.text}>You’re one OAuth flow away…</p>
      <button className={styles.button} onClick={this.startLogin}>
        Connect using GitHub
      </button>
    </div>
  }
}

class UpdateFeed extends React.Component {
  constructor() {
    super()
  }
  render() {
    return <div className={styles.updateFeed}>
      <TextareaAutosize className={styles.input} placeholder="Type something… "></TextareaAutosize>
    </div>
  }
}