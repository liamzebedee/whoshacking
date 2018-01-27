import React, { Component } from "react";
import { observer } from "mobx-react";

import styles from './styles.css';
import 'normalize.css';

import Feed from './feed';

@observer
export default class App extends React.Component {
  render() {
    return <div className={styles.app}>
      <div className={styles.appWrap}>
        <div className={styles.feed}>
          <Feed items={this.props.store.feedItems}/>
        </div>
        <footer className={styles.footer}>>hackfeed</footer>
      </div>
    </div>
  }
}