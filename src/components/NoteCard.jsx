import { useRef, useEffect, useState } from "react";
import DeleteButton from "./DeleteButton";
import Spinner from "../icons/Spinner";
import { setNewOffset, setZIndex, bodyParser } from "../utils";
import { db } from "../appwrite/databases";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";

const NoteCard = ({ note }) => {

    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);

    const { setSelectedNote } = useContext(NoteContext);

    const [position, setPositon] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = bodyParser(note.body);

    let mouseStartPos = { x: 0, y: 0 };
 
    const cardRef = useRef(null);

    const textAreaRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef.current);
        setZIndex(cardRef.current);
    }
    , [textAreaRef.current]);



    const autoGrow = (textarea) => {
        const { current } = textAreaRef;
        current.style.height = "auto";
        current.style.height = current.scrollHeight + "px";
    }

    const mouseDown = (e) => {
        if (e.target.className === "card-header") {
     
     
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;
     
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);

            setZIndex(cardRef.current);
            setSelectedNote(note);
        }
    };

    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
     
        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);

        setPositon(newPosition);
        
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);

        const newPosition = setNewOffset(cardRef.current);
        saveData("position", newPosition);
    };
 
    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };
        try {
            await db.notes.update(note.$id, payload);
        } catch (error) {
            console.error(error);
        }
        setSaving(false);
    };

    const handleKeyUp = async () => {
        setSaving(true);
     
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    return (
        <div
            ref={cardRef}
            className="card" 
            style={{ 
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            
            }}

        >

            <div 
                
                className="card-header"
                onMouseDown = { mouseDown }
                style={{backgroundColor: colors.colorHeader}}
            >

                <DeleteButton noteId={note.$id}  />

                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>Saving...</span>
                    </div>
                )}

            
            </div>
            <div className="card-body">
                <textarea
                    onKeyUp={handleKeyUp}
                    ref={textAreaRef}
                    style={{color: colors.colorText}}
                    defaultValue={body}
                    onInput={() => autoGrow(textAreaRef.current)}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                >

                </textarea>
            </div>

        </div>
    );
};

export default NoteCard;