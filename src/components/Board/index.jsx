import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../Column';
import './style.css';

const Board = () => {
    const initialData = {
        columns: {
            backlog: {
                id: 'backlog',
                title: 'Backlog',
                taskIds: ['task1', 'task2', 'task3'],
            },
            todo: {
                id: 'todo',
                title: 'To Do',
                taskIds: [],
            },
            inProgress: {
                id: 'inProgress',
                title: 'In Progress',
                taskIds: [],
            },
            testing: {
                id: 'testing',
                title: 'Testing',
                taskIds: [],
            },
            done: {
                id: 'done',
                title: 'Done',
                taskIds: [],
            },
        },
        tasks: {
            task1: {
                id: 'task1',
                content: 'Task 1',
            },
            task2: {
                id: 'task2',
                content: 'Task 2',
            },
            task3: {
                id: 'task3',
                content: 'Task 3',
            },
        },
        columnOrder: ['backlog', 'todo', 'inProgress', 'testing', 'done'],
    };

    const [data, setData] = useState(initialData);


    const handleDragEnd = (result) => {

        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = data.columns[source.droppableId];
        const finish = data.columns[destination.droppableId];

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newColumn.id]: newColumn,
                },
            };

            setData(newData);
        } else {
            const startTaskIds = Array.from(start.taskIds);
            startTaskIds.splice(source.index, 1);
            const newStart = {
                ...start,
                taskIds: startTaskIds,
            };

            const finishTaskIds = Array.from(finish.taskIds);
            finishTaskIds.splice(destination.index, 0, draggableId);
            const newFinish = {
                ...finish,
                taskIds: finishTaskIds,
            };

            const newData = {
                ...data,
                columns: {
                    ...data.columns,
                    [newStart.id]: newStart,
                    [newFinish.id]: newFinish,
                },
            };

            setData(newData);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="board">
                {data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId];
                    const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                    return (
                        <Column key={column.id} column={column} tasks={tasks} />
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default Board;
