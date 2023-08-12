import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './style.css';

const TaskItem = ({ task, index }) => {
    console.log(task)
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task-item"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div>{task.name}</div>
                    <div>Data final: {task.dueDate}</div>
                    <div>Prioridade: {task.priority === "low" ? "Baixa" : task.priority === "medium" ? "Média" : "Alta"}</div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskItem;
