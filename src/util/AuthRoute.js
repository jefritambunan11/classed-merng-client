import React, {  useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import {AuthContext} from '../context/auth'

export default function AuthRoute(    
    {
        component: Component, 
        ...rest
    }
) {

    let context = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={
                props => context.user ? <Redirect to='/'/> : <Component {...props} />
            }
        >

        </Route>
    )

}