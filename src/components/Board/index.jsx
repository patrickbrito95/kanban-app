import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../Column';
import './style.css';
import Icon from '../Icons';
import Modal from '../Modal';
import apiData from '../../api/tasks.json';
import moment from 'moment';
import { Input } from '../Input';

const Board = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('all');
    const [data, setData] = useState(apiData);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState(moment().format('YYYY-MM-DD'));
    const [newTaskLocation, setNewTaskLocation] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('low');
    const [errorMessages, setErrorMessages] = useState({
        newTaskName: '',
        newDescription: '',
        newTaskDueDate: '',
    });


    const handleCreateTask = () => {
        const newTaskId = `task${Object.keys(data.tasks).length + 1}`;

        const newTask = {
            id: newTaskId,
            name: newTaskName,
            dueDate: newTaskDueDate,
            description: newDescription,
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

        const currentDate = moment();

        const dueDate = moment(newTaskDueDate, 'YYYY-MM-DD');

        console.log(dueDate)

        if (!newTaskName.trim() || !newDescription.trim()) {
            setErrorMessages({
                newTaskName: newTaskName.trim() ? '' : 'Campo obrigatório',
                newDescription: newDescription.trim() ? "" : "Campo Obrigatório",
            });
            return;
        }


        if (dueDate.isBefore(currentDate, 'day')) {
            setErrorMessages({
                newTaskDueDate: "Não é possível inserir data anterior a atual."
            })
            return
        }

        setData(newData);

        setErrorMessages({
            newTaskName: '',
            newDescription: '',
            newTaskDueDate: ''
        });

        setNewTaskName('');
        setNewTaskDueDate(moment().format('YYYY-MM-DD'));
        setNewTaskLocation('');
        setNewDescription('');
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

    const handleDelete = (taskId) => {
        const updatedTasks = { ...data.tasks };
        delete updatedTasks[taskId];

        const updatedColumns = { ...data.columns };
        Object.keys(updatedColumns).forEach((columnId) => {
            const taskIndex = updatedColumns[columnId].taskIds.indexOf(taskId);
            if (taskIndex !== -1) {
                updatedColumns[columnId].taskIds.splice(taskIndex, 1);
            }
        });

        const updatedData = {
            ...data,
            tasks: updatedTasks,
            columns: updatedColumns,
        };

        setData(updatedData);
    };

    const cancelCreateTask = () => {
        setNewTaskName('');
        setNewTaskDueDate(moment().format('YYYY-MM-DD'));
        setNewTaskLocation('');
        setNewDescription('');
        setNewTaskPriority('low');
        setErrorMessages({
            newTaskName: '',
            newDescription: '',
            newTaskDueDate: moment().format('YYYY-MM-DD')
        });
        setShowCreateTaskModal(false);
    };


    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="board">
                <div className='wrapper-filters'>
                    <div className="create-task-button" onClick={() => setShowCreateTaskModal(true)}>
                        Nova Tarefa
                        <Icon name="plus-mark" />
                    </div>
                    <div className='wrapper-search-filds'>
                        <Input
                            inputSelect
                            label="Prioridade"
                            className="priority-select"
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                        >
                            <option value="all">Todos</option>
                            <option value="critical">Crítico</option>
                            <option value="high">Alta</option>
                            <option value="low">Baixa</option>
                        </Input>
                    </div>
                    <div className='wrapper-search-filds'>
                        <Input
                            label="Pesquisar"
                            className="input-text"
                            type="text"
                            placeholder="Digite o nome da Task..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className='board-cards'>
                    {data.columnOrder.map((columnId) => {
                        const column = data.columns[columnId];
                        const tasks = column.taskIds
                            .map((taskId) => data.tasks[taskId])
                            .filter((task) =>
                                task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                (selectedPriority === 'all' || task.priority === selectedPriority)
                            );

                        return <Column key={column.id} column={column} tasks={tasks} onDelete={handleDelete} />;
                    })}
                </div>
            </div>
            {showCreateTaskModal && (
                <Modal isOpen={true} onClose={cancelCreateTask}>
                    <div className='wrapper-modal-content'>
                        <h2>Criar Nova Tarefa</h2>
                        <Input
                            className='input-text'
                            type="text"
                            placeholder="Nome da Tarefa"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                        />
                        {errorMessages.newTaskName && <p className="error-message">{errorMessages.newTaskName}</p>}
                        <Input
                            label="Data prevista"
                            className='input-text'
                            type="date"
                            placeholder="Data Limite"
                            defaultValue={moment().format('YYYY-MM-DD')}
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                        />
                        {errorMessages.newTaskDueDate && <p className="error-message">{errorMessages.newTaskDueDate}</p>}

                        <Input
                            className='input-text'
                            type="text"
                            placeholder="Local da Tarefa"
                            value={newTaskLocation}
                            onChange={(e) => setNewTaskLocation(e.target.value)}
                        />
                        <textarea
                            className='input-text'
                            type="text"
                            placeholder="Descrição da Tarefa"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        {errorMessages.newDescription && <p className="error-message">{errorMessages.newDescription}</p>}
                        <Input
                            inputSelect
                            label="Prioridade da Tarefa: "
                            className='priority-select-modal'
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value)}
                        >
                            <option value="critical">Prioridade Crítica</option>
                            <option value="high">Prioridade Alta</option>
                            <option value="low">Prioridade Baixa</option>
                        </Input>
                        <div className='wrapper-buttons-modal'>
                            <button className='create-task-button' onClick={handleCreateTask}>Criar Tarefa</button>
                            <button className='cancel-task-button-modal' onClick={cancelCreateTask}>Cancelar</button>                        </div>
                    </div>
                </Modal>
            )}
        </DragDropContext>
    );
};

export default Board;
