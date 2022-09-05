import React, {useState, useContext} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'

import {AuthContext} from '../context/auth'
import {useForm} from '../util/hooks'

export default function Login(props) {
    let context = useContext(AuthContext)

    let [errors, setErrors] = useState({})

    let { onChange, onSubmit, values } = useForm(redirectLoginUser, {
        username: '',        
        password: '',        
    })
    
    
    let [loginUser, {loading}] = useMutation(LOGIN_USER, {
        update(
            _, 
            {
                data: {
                    login: _user_data_
                }
            }
            ) {
            console.log("_user_data_")
            console.log(_user_data_)
            context.login(_user_data_)
            props.history.push('/')
        },
        onError(err) {            
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values      
    })   

    
    function redirectLoginUser() {
        loginUser()
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} >
                <h1>Login</h1>

                <Form.Input
                    type="text"
                    label='Username'
                    placeholder='Username'
                    name='username'
                    value={values.username}
                    onChange={onChange}
                    error={errors.username ? true : false}
                />

                <Form.Input
                    type="password"
                    label='Password'
                    placeholder='Password'
                    name='password'
                    value={values.password}
                    onChange={onChange}
                    error={errors.password ? true : false}
                />

                <Button type="submit" primary>
                    Login
                </Button>

            </Form>

            {
                Object.keys(errors).length > 0 && 
                (
                    <div className="ui error message">
                        <ul className="list">
                        {
                            Object.values(errors).map(value => (
                                <li key={value}>{value}</li>
                            ))
                        }
                        </ul>                
                    </div>    
                )
            } 
           
        </div>
    )
}



let LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!    
  ) {
    login(      
        username: $username
        password: $password
    ) {
        id
        email
        token
        username
        createdAt
    }
  }
`