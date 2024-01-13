const BlogAdder = (props) => {
    return(
      <form onSubmit={props.addBlog}>
          <div>
            title: <input value={props.newTitle} onChange={props.handleTitleChange} />
          </div>
          <div>
            author: <input value={props.newAuthor} onChange={props.handleAuthorChange}/>
          </div>
          <div>
            url: <input value={props.newUrl} onChange={props.handleUrlChange}/>
          </div>
          <div>
            likes: <input value={props.newLikes} onChange={props.handleLikesChange}/>
          </div>
          <div>
            <button type="submit">
              add
            </button>
          </div>
        </form>
  
    )
  }

export default BlogAdder