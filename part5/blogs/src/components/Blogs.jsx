import { useState } from 'react'

const Blogs = ({ blogs }) => {
  const [visible, setVisible] = useState({})

  const toggleVisibility = (id) => {

    setVisible({
      ...visible,
      [id]: !visible[id]
    })
  }



  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
    return (
      <div>
      {blogs.map(blog => {
        const isVisible = visible[blog.id]

        return (
          <div key={blog.id} style={blogStyle}>
            {blog.title}
            <button onClick={() => toggleVisibility(blog.id)}>
              {isVisible ? 'hide' : 'show'}
            </button>
            <br />
            {isVisible && (
              <div>
                <div>{blog.author}</div>
                <div>{blog.url}</div>
                <div>{blog.likes}</div>
                <div>{blog.name}</div>
              </div>
            )}
            <p></p>
          </div>
        )
      })}
    </div>
  )
}


export default Blogs