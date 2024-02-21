import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'

const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author {
      name
    }
    published
    genres
  }
}`

const Books = (props) => {
  const [filter, setFilter] = useState('all genres')
  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  });

  if (result.loading) {
    return <div>loading...</div>;
  }

  if (!props.show) {
    return null;
  }

  const uniqueGenres = new Set()
  result.data.allBooks.forEach(book => {
    book.genres.forEach(genre => {
      uniqueGenres.add(genre)
    })
  })


  const filteredBooks = filter === 'all genres' ? result.data.allBooks : result.data.allBooks.filter(book => book.genres.includes(filter))

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
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from(uniqueGenres).map((g) => (
          <button key={g} onClick={() => setFilter(g)}>{g}</button>
        ))}
      </div>
    </div>
  )
}

export default Books
