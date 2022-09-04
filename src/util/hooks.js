import { useState } from 'react'

export let useForm = (callback, initialState = {}) => {
    let [values, setValues] = useState(initialState)

    let onChange = (event) => {
        setValues({ 
            ...values, 
            [event.target.name]: event.target.value 
        })
    }

    let onSubmit = (event) => {
        event.preventDefault()
        callback()
    }

    return {
        onChange,
        onSubmit,
        values
    }
}