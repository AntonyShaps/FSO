
const Course = ({ courses }) => {
    return (
      <div>
        {courses.map(course => (
          <div key={course.id}>
            <Header course={course} />
            <Content course={course} />
          </div>
        ))}
      </div>
    )
  }


const Header = ({ course }) => {
  return <h1>{course.name}</h1>
}

const Content = ({ course }) => {
  const totalExercises = course.parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      {course.parts.map(part => (
        <p key={part.id}>{part.name} {part.exercises}</p>
      ))}
      <p><strong>total of {totalExercises} exercises</strong></p>
    </div>
  )
}

export default Course