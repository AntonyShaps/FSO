


const Numbers = ({ persons, filterName, removeName }) => {
    return (
      <div>
        {persons
          .filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
          .map(person => (
            <div key={person.name}>
              {person.name} {person.number}
              <button onClick={()=>removeName(person.id)}>delete</button>
            </div>
          ))
        }
      </div>
    );
  }

export default Numbers