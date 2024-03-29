import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

const LOGIN = gql`
  mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
      value
    }
  }
`

const Login = ({ setError, setToken, show , setPage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        },
        
    })

    useEffect(() => {
        if( result.data ){
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
            setPage('add')
        }
    }, [result.data, setPage])

    if (!show) {
        return null
      }

    const submit = async (event) => {
        event.preventDefault()

        login({ variables: { username, password } })

        setUsername('')
        setPassword('')
    }

    return(
        <div>
            <form onSubmit={submit}>
                <div>
                    name
                    <input
                         value={username}
                         onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input 
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Login