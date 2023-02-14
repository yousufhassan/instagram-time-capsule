import React from 'react';
import '.././styles/Header.css';

interface Button {
    label: string,
    className: string
}

function HeaderButton(props:Button) {
    return (
        <div>
            <button className={props.className}>{props.label}</button>
        </div>
    )
}

export default HeaderButton;
