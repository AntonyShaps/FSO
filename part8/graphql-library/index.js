const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/



const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
        title: String!
        published: Int!
        author: String!
        id: ID
        genres: [String!]!
    ): Book
    editAuthor(
        name: String!
        setBornTo: Int!
      ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () =>await Book.collection.countDocuments(),
    authorCount: async ()=>await Author.collection.countDocuments(),
    allBooks: async (root, arg) =>{
        if (arg.author && arg.genres) {
            return await Book.find( {author: arg.author, genres:{ $in: arg.genres}} )
        } else if (arg.author) {
            return await Book.find({ author: arg.author })
        } else if (arg.genres) {
            return Book.find({ genres:{ $in: arg.genres }})
        } else {
            return await Book.find({})
        }
    },
    allAuthors:() =>Author.find({})
  },
  Author: {
    bookCount: (root) => Book.find({author : root.name}).countDocuments({})
  },
  Mutation: {
    addBook: async (root, args) => {
      const foundAuthor = await Author.findOne({ name: args.author })

      const book = new Book({ ...args, author: foundAuthor })
      try{
        await book.save()
      } catch (error) {
        throw new GraphQLError('save error', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findone({ name: args.name })
      if(!author){
        return null
      }else{
      author.born = args.born
      try{
         await author.save()
      } catch (error) {
        throw new GraphQLError('born error',{
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})