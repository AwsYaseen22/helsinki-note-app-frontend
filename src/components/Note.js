const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "Make it not important" : "Make it important";
  return (
    <li className="note">
      {note.content}
      <button onClick={() => toggleImportance(note.id)}>{label}</button>
    </li>
  );
};

export default Note;
