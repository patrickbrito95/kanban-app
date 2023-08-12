import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import './style.css';
import TaskItem from '../Task';

const Column = ({ column, tasks, onDelete }) => {


    return (
        <div className="column">
            <div className="column-title">
                <h3>
                    {column.title}
                </h3>
            </div>
            <div>

                <Droppable droppableId={column?.id}>
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="task-list"
                        >
                            {tasks?.map((task, index) => (
                                <TaskItem key={task.id} task={task} index={index} onDelete={onDelete} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
};

export default Column;
