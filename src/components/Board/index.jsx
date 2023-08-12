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
                name: 'Task 1',
                dueDate: '2023-06-01',
                location: 'Office A',
                priority: 'high',
            },
            task2: {
                id: 'task2',
                name: 'Task 2',
                dueDate: '2023-06-05',
                location: 'Office B',
                priority: 'critical',
            },
            task3: {
                id: 'task3',
                name: 'Task 3',
                dueDate: '2023-06-10',
                location: 'Office C',
                priority: 'low',
            },
        },
        columnOrder: ['backlog', 'todo', 'inProgress', 'testing', 'done'],
    };

    const [data, setData] = useState(initialData);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskLocation, setNewTaskLocation] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('low');

    const handleCreateTask = () => {
        const newTaskId = `task${Object.keys(data.tasks).length + 1}`;

        const newTask = {
            id: newTaskId,
            name: newTaskName,
            dueDate: newTaskDueDate,
            location: newTaskLocation,
            priority: newTaskPriority,
        };

        const newColumnOrder = [...data.columns.backlog.taskIds, newTaskId];
        const newColumns = {
            ...data.columns,
            backlog: {
                ...data.columns.backlog,
                taskIds: newColumnOrder,
            },
        };

        const newTasks = {
            ...data.tasks,
            [newTaskId]: newTask,
        };

        const newData = {
            ...data,
            columns: newColumns,
            tasks: newTasks,
        };

        setData(newData);

        setNewTaskName('');
        setNewTaskDueDate('');
        setNewTaskLocation('');
        setNewTaskPriority('low');
        setShowCreateTaskModal(false);
    };

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
                <div className="create-task-button" onClick={() => setShowCreateTaskModal(true)}>
                    Create Task
                </div>
                {data.columnOrder.map((columnId) => {
                    const column = data.columns[columnId];
                    const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                    return (
                        <Column key={column.id} column={column} tasks={tasks} />
                    );
                })}
            </div>
            {showCreateTaskModal && (
                <div className="create-task-modal">
                    <div className="modal-content">
                        <h2>Create New Task</h2>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                        />
                        {/* Other input fields for due date, location, and priority */}
                        {/* ... */}
                        <button onClick={handleCreateTask}>Create Task</button>
                        <button onClick={() => setShowCreateTaskModal(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </DragDropContext>
    );
};

export default Board;
