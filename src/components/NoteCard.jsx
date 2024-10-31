import { useRef, useEffect, useState } from "react";
import Trash from "../icons/Trash";

const NoteCard = ({ note }) => {
    const [position, setPositon] = useState(JSON.parse(note.position));
    const colors = JSON.parse(note.colors);
    const body = JSON.parse(note.body);

    let mouseStartPos = { x: 0, y: 0 };
 
    const cardRef = useRef(null);

    const textAreaRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef.current);
    }
    , [textAreaRef.current]);



    const autoGrow = (textarea) => {
        const { current } = textAreaRef;
        current.style.height = "auto";
        current.style.height = current.scrollHeight + "px";
    }

    const mouseDown = (e) => {
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
 
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    }

    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };
     
        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
     
        //3 - Update card top and left position.
        setPositon({
            x: cardRef.current.offsetLeft - mouseMoveDir.x,
            y: cardRef.current.offsetTop - mouseMoveDir.y,
        });
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove);
        document.removeEventListener("mouseup", mouseUp);
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
                style={{backgroundColor: colors.colorHeder}}
            >

                <Trash />
            
            </div>
            <div className="card-body">
                <textarea
                ref={textAreaRef}
                    style={{color: colors.colorText}}
                    defaultValue={body}
                    onInput={() => autoGrow(textAreaRef.current)}
                >

                </textarea>
            </div>

        </div>
    );
};

export default NoteCard;