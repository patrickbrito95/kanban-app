import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './style.css';
import TaskItem from '../Task';

const Column = ({ column, tasks }) => {


    return (
        <div className="column">
            <h3 className="column-title">{column.title}</h3>
            <Droppable droppableId={column?.id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="task-list"
                    >
                        {tasks?.map((task, index) => (
                            <TaskItem key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;