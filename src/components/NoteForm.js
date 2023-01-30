import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }
  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      // important: Math.random() > 0.5,
      important: false,
    }
    createNote(noteObject)
    setNewNote('')
  }
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input id="new_note" value={newNote} onChange={handleChange} placeholder='write note content here' />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
