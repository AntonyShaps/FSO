import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
query{
  allBooks{
    title
    author
    published
  }
}`

const Books = (props) => {


  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })
  

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!props.show) {
    return null
  }



  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books