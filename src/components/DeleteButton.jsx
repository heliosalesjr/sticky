import Trash from "../icons/Trash";
import { db } from "../appwrite/databases";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";

const DeleteButton = ({ noteId }) => {
    const { setNotes } = useContext(NoteContext);
    
    const handleDelete = async () => {
        await db.notes.delete(noteId); // Adicionei await para garantir que a exclusão seja assíncrona
        setNotes((prevState) =>
            prevState.filter((note) => note.$id !== noteId)
        );
    };
 
    return (
        <div onClick={handleDelete}>
            <Trash />
        </div>
    );
};

export default DeleteButton;
