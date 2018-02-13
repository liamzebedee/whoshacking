const shell = require('electron').shell;
import React from 'react'

export const ExternalLink = (props) => {
    const handleClick = (ev) => {
        ev.preventDefault();
        shell.openExternal(ev.target.href);
    }
    return <a {...props} onClick={handleClick}>{props.children}</a>
}
