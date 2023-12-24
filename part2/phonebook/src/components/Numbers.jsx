


const Numbers = ({ persons, filterName }) => {
    return (
      <div>
        {persons
          .filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
          .map(person => (
            <div key={person.id}>{person.name} {person.number}</div>
          ))
        }
      </div>
    );
  }

export default Numbers