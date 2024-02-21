import { gql, useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'

export const ALL_AUTHORS = gql`
query{
  allAuthors{
    name
    born
    bookCount
  }
}`
const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!){
    editAuthor(name: $name, setBornTo: $setBornTo){
       name
       born
       bookCount
       id 
    }
  }
`


const Authors = (props) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')
  const [ changeAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })
  console.log({ name: name, setBornTo: parseInt(born, 10) })
  const submit = async (event) => {
    event.preventDefault()
    await changeAuthor({
      variables: {
        name: name.value,
        setBornTo: parseInt(born, 10)
      }
    })
    console.log('edit author...')
    setName(null)
    setBorn(0)
  }
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })
  if (result.loading) {
    return <div>loading...</div>
  }
  if (!props.show) {
    return null
  }
  const authors = result.data.allAuthors.map(author => ({
    value: author.name,
    label: author.name,
  }));

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            value={name}
            onChange={setName}
            options={authors}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update author</button>
        </form>
    </div>
  )
}

export default Authors
