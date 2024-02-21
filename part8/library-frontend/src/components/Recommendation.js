import { gql, useQuery } from '@apollo/client'

const USER = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

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
}
`

const Recommendation = (props) => {
    const userResult = useQuery(USER)
    const booksResult = useQuery(ALL_BOOKS)

    if (!props.show) {
        return null
    }

    if (userResult.error || booksResult.error) {
      return <div>Error loading data.</div>
    }

    const favoriteGenre = userResult.data.me.favoriteGenre
    const filteredBooks = booksResult.data.allBooks.filter(book => book.genres.includes(favoriteGenre))

    return (
        <div>
          <h2>Recommendations</h2>
          <p>books in your favorite genre {favoriteGenre} </p>
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
        </div> 
    );
};

export default Recommendation
