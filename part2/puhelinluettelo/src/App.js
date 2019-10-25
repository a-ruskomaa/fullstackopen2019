import React, { useState, useEffect } from 'react'
import personService from './services/personService'
import PersonList from './components/PersonList'
import PersonForm from './components/PersonForm'
import PersonFilter from './components/PersonFilter'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  const formData = {
    newName,
    setNewName,
    newNumber,
    setNewNumber
  }

  const hook = () => {
    personService
      .getAll()
      .then(fetchedPersons => {
        setPersons(fetchedPersons)
      })
  }

  useEffect(hook, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.map(person => person.name).includes(newName)) {
      if (window.confirm(`${newName} is already added to the phonebook, do you want to update ${newName}'s phone number?`)) {
        const id = persons.find(p => p.name === newName).id
        const updatedPerson = {
          name: newName,
          number: newNumber,
          id: id
        }

        /*TODO: varmista että muutetaan oikeaa entryä*/
        personService
          .update(id, updatedPerson)
          .then(response => {
            const updatedPersons = persons.map(person => person.id !== id ? person : updatedPerson)
            setPersons(updatedPersons)
            setNewName('')
            setNewNumber('')
            showInfo(`${updatedPerson.name}'s number has been updated`)
          })
          .catch(error => {
            showError(`${updatedPerson.name} has already been removed from the server`)
          })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      console.log(newPerson)
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showInfo(`${returnedPerson.name} has been added to the Phonebook`)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      /*TODO: varmista että muutetaan oikeaa entryä*/
      personService
        .remove(id)
        .then(setPersons(persons.filter(p => p.id !== id)))
        .catch(error => {
          showError(`${name} has already been removed from the server`)
        })
    }

  }

  const showError = (message) => {
    setNotification({ message: message, type: 'error' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const showInfo = (message) => {
    setNotification({ message: message, type: 'info' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <h3>PersonFilter</h3>
      <PersonFilter value={filter} setFilter={setFilter} />
      <h3>Add new</h3>
      <PersonForm addPerson={addPerson} formData={formData} />
      <h3>Numbers</h3>
      <PersonList persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  )

}

export default App