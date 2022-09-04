import React, {useState, useContext} from 'react'
import {Form, Button} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/react-hooks'

import {useForm} from '../util/hooks'
import {AuthContext} from '../context/auth'

export default function Register(props) {
    let context = useContext(AuthContext)
    
    let [errors, setErrors] = useState({})
  
    let { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    
    let [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(
            _, 
            {
                data: {
                    register: _user_data_
                }
            }
            ) {
                        
            context.login(_user_data_)
            props.history.push('/')
        },
        onError(err) {            
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values      
    })   
    

    function registerUser() {
        addUser()
    }
   

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} >
                <h1>Register</h1>

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
                    type="email"
                    label='Email'
                    placeholder='Email'
                    name='email'
                    value={values.email}
                    onChange={onChange}
                    error={errors.email ? true : false}
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

                <Form.Input
                    type="password"
                    label='Confirm Password'
                    placeholder='Confirm Password'
                    name='confirmPassword'
                    value={values.confirmPassword}
                    onChange={onChange}                    
                    error={errors.confirmPassword ? true : false}
                />

                <Button type="submit" primary>
                    Register
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



let REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`