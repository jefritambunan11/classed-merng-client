import React, { useState, useContext } from 'react'
import {Link} from 'react-router-dom'
import {Menu} from 'semantic-ui-react'

import { AuthContext } from '../context/auth'

export default function MenuBar() {
    let context = useContext(AuthContext)

    let pathname = window.location.pathname
    let path = pathname === '/' ? 'home' : pathname.substr(1)
    
    let [activeItem, setActiveItem] = useState(path)

    let handleItemClick = (e, {name}) => setActiveItem(name)   

        
    let menuBar = context.user ? (
        <Menu pointing secondary size="massive" color="teal">
        <Menu.Item
            name={context.user.username}
            active            
            as={Link}
            to="/"
        />

        <Menu.Menu position="right">
            <Menu.Item
                name="logout"                
                onClick={context.logout}
            />
        </Menu.Menu>
    </Menu>

    ): (
        <Menu pointing secondary size="massive" color="teal">
            <Menu.Item
                name="home"
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to="/"
            />
    
            <Menu.Menu position="right">
                <Menu.Item
                    name="login"
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/login"
                />
                <Menu.Item
                    name="register"
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to="/register"
                />
            </Menu.Menu>
        </Menu>
    )


    return menuBar
}

MenuBar.propTypes = {}

