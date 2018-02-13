import { ExternalLink } from './util';
import React from 'react';

export default class HackerStatus extends React.Component {
    render() {
        let str = "";
        let projects = this.props.status.currentProjects;
        
        if(projects && projects.length) {
            let project = projects[0];
            if(project.url) {
            str = <span>Hacking on <ExternalLink href={project.url}>{project.name}</ExternalLink></span>
            } else {
            str = <span>Hacking on {project.name} (top secret!)</span>
            }
        } else {
            str = <span>Not hacking on anything</span>
        }
        return str;
    }
}