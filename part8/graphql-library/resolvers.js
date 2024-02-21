const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()


const resolvers = {
  Query: {
    bookCount: async () =>await Book.collection.countDocuments(),
    authorCount: async ()=>await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          return []
        }
        return await Book.find({ author: author._id }).populate('author')
      } else if (args.genres) {
        return await Book.find({ genres: { $in: args.genres } }).populate('author')
      } else {
        return await Book.find({}).populate('author')
      }
    },
    allAuthors:async () => await Author.find({}),
    me: async (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async(root) =>{
      const foundAuthor = await Author.findOne({ name: root.name })
      const foundBooks = await Book.find({ author : foundAuthor.id })
      return foundBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated')
      }
    
      let author = await Author.findOne({ name: args.author })
    

      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          console.error("Error saving new author:", error)
          throw new GraphQLError(`Error saving author: ${error.message}`)
        }
      }
    

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
        return book
      } catch (error) {
        console.error("Error saving book:", error);
        throw new GraphQLError(`Error saving book: ${error.message}`)
      }
    },
    
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated')
      }
      if (!author) {
        return null
      } else {
        author.born = args.setBornTo
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('saving born failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
        return author
      }
    },
    createUser: async (root, args) => {
      const user = new User({ 
        username: args.username,
        favoriteGenre: args.favoriteGenre
       })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if( !user || args.password != 'root' ){
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  }
}
module.exports = resolvers