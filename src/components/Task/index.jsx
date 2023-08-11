import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './style.css';

const TaskItem = ({ task, index }) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task-item"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {task.content}
                </div>
            )}
        </Draggable>
    );
};

export default TaskItem;
