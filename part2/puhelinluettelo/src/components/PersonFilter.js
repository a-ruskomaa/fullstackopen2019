import React from 'react'

const PersonFilter = ({filter, setFilter}) => {

    return (
        <div>
            filter shown persons by: <input value={filter} onChange={(event) => setFilter(event.target.value)} />
        </div>
    )
}

export default PersonFilter