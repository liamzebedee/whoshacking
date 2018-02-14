import { ExternalLink } from './util';
import React from 'react';
import _ from 'underscore'
import styles from '../styles/item.css';

export default class HackerStatus extends React.Component {
    render() {
        let str = "";
        let projects = this.props.status.currentProjects;
        
        if(projects && projects.length) {
            // sort desc time
            projects = _.sortBy(projects, function(project) {
                return -(new Date(project.lastUpdated).getTime());
            });
            str = <span>
                Hacking on {
                    projects
                    .map((p, i) => <ProjectDesc key={i} {...p}/>)
                    .map((el, i, arr) => {
                        // Humanise comma's between items
                        if(i == arr.length-1) return <span key={i}>{el}</span>;
                        else return <span className={styles.project} key={i}>{el}, </span>
                    })
                }
            </span>
        } else {
            str = <span>Not hacking on anything</span>
        }
        return str;
    }
}



const ProjectDesc = (props) => {
    if(props.url) {
        return <ExternalLink href={props.url}>{props.name}</ExternalLink>
    } else {
        return `${props.name} (top secret!)`;
    }
}