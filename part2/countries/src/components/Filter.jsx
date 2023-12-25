const Filter = (props) => {
    return(
      <form>
      <div>
        find countries <input value = {props.filterName} onChange={props.handleFilterName} />
      </div>
    </form>
    )
  }

export default Filter