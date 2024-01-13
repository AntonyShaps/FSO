
const Blogs = ({ blogs }) => {
    return (
      <div>
        {blogs
          .map(blog => (
            <div key={blog.id}>
              {blog.title}<br />
              {blog.author}<br />
              {blog.url}<br />
              {blog.likes}<br />
              <p></p>
            </div>
          ))
        }
      </div>
    );
  }

export default Blogs