import React, { Component } from "react";
import { observer } from "mobx-react";
import TextareaAutosize from 'react-autosize-textarea';
import electron from 'electron';
const BrowserWindow = electron.remote.BrowserWindow;

import 'normalize.css';
import styles from './styles.css';

import Feed from './feed';
import { API_HOST } from '../model';

import HackerStatus from './HackerStatus';


@observer
export default class App extends React.Component {
  render() {
    return <div className={styles.app}>
      <div className={styles.appWrap}>
        {store.isLoggedIn ? 
        
        <div className={styles.feed}>
          <header className={styles.title}>Who’s hacking?</header>
          <Feed/>
          <FooterPane/>
        </div> : 
      
        <LoginView/>}
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
    win.loadURL(`${API_HOST}/auth/github`)
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

@observer
class FooterPane extends React.Component {
  render() {
    let avatar;
    let store = window.store;
    let user = store.getUser();
    if(user.profile.photos.length) {
        avatar = user.profile.photos[0].value;
    }

    let status = store.getStatus();

    return <div className={styles.updatePaneWrap}><div className={styles.updatePane}>
      <div className={styles.updatePaneAvatar} style={{
            backgroundImage: `url(${avatar})`
        }}></div>
        
      <div className={styles.status}><HackerStatus status={status}/></div>
    </div></div>
  }
}


// class UpdateFeed extends React.Component {
//   state = {
//     transition: 'height 250ms'
//   }

//   focusInput() {
//     this.textarea.focus()
//   }

//   render() {
//     return <div onClick={this.focusInput} className={styles.updateFeed}>
//       <TextareaAutosize onClick={this.focusInput} ref={ref => this.textarea = ref} style={this.state.resizeStyles} onResize={this.checkResize}  className={styles.input} placeholder="Type something… "></TextareaAutosize>
//     </div>
//   }
// }