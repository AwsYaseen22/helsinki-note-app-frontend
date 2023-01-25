import { useState, useEffect } from "react";
// import axios from "axios";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import Login from "./components/Login";
import NoteForm from "./components/NoteForm";

import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(()=>{
    const loggedUserJSON = localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const obj = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5, // random true false
    };
    noteService.create(obj).then((noteObject) => {
      setNotes(notes.concat(noteObject));
      setNewNote("");
    });
  };

  const toggleImportance = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };
    noteService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((n) => (n.id === id ? returnedNote : n)))
      )
      .catch((error) => {
        setErrorMessage(
          `the note: '${note.content}' was already deleted from the server`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const handleLogin = async(event)=>{
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUser(user)
      noteService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }

 
  const notesToShow = showAll ? notes : notes.filter((note) => note.important);
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      { user === null ? 
          <Login  handleLogin={handleLogin} username={username} password={password} setUsername={setUsername} setPassword={setPassword}  /> : 
          <div>
            <p>{user.name} logged-in</p>
            <NoteForm addNote={addNote} newNote={newNote} handleNoteChange={handleNoteChange}/>
          </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={toggleImportance} />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
