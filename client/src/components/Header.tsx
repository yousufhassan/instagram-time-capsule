import React from 'react';
import '.././styles/general.css';
import '.././styles/Header.css';
import HeaderButton from './HeaderButton';

function Header() {
    return (
        <div id='header' className='flex-row container'>
            <div id='app-name'>Instagram Time Capsule</div>
            <div className='flex-row'>
                <HeaderButton label='Sign up' className='primary-btn regular-h-spacing' />
                <HeaderButton label='Log in' className='secondary-btn regular-h-spacing' />
            </div>
        </div>
    )
}

export default Header;