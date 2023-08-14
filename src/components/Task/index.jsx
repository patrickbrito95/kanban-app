import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import './style.css';
import Icon from '../Icons';
import Modal from '../Modal';
import moment from 'moment';

const TaskItem = ({ task, index, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const currentDate = moment();
    const dueDate = moment(task.dueDate, 'DD-MM-YYYY');
    const notLateDeadline = dueDate.isBefore(currentDate, 'day');

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <>
                    <div
                        className="wrapper-task-card"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        onClick={handleOpenModal}
                    >
                        <div className={`${task.priority === "low" ? "card-low-priority" : task.priority === "high" ? "card-high-priority" : "card-critical-priority"}`}>
                            {task.name}
                        </div>
                        <div className='detail-item'>
                            {task.location}
                        </div>
                        <div className='detail-item'>
                            {task.priority === "low" ? "Prioridade Baixa" : task.priority === "high" ? "Prioridade Alta" : "Prioridade Crítica"}
                        </div>
                        <div className={notLateDeadline ? 'deadline-date-late' : 'deadline-date'}>
                            {`Finalizar até ${moment(task.dueDate).format('DD/MM/YYYY')}`}
                        </div>
                        <button className="delete-button" onClick={() => onDelete(task.id)}>
                            <div className='delete-icon'>
                                <Icon name='x-mark' />
                            </div>
                        </button>
                    </div>
                    {isModalOpen && (
                        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                            <div className='wrapper-modal-details'>
                                <div>
                                    <h1>
                                        {task.name}
                                    </h1>
                                </div>
                                <div className='wrapper-detail'>
                                    {task.description}
                                </div>
                                <div className='wrapper-bottom-details'>
                                    <div className={'wrapper-detail'}>
                                        <span>
                                            Finalizar até&nbsp;
                                        </span>
                                        <div>
                                            {moment(task.dueDate).format('DD/MM/YYYY')}
                                        </div>
                                    </div>
                                    <div className='wrapper-detail'>
                                        <span>Local:</span>
                                        <div>

                                            {task.location}
                                        </div>
                                    </div>
                                    <div className='wrapper-detail'>
                                        <span>Prioridade: </span>
                                        <div>
                                            {task.priority === "low" ? "Baixa" : task.priority === "high" ? "Alta" : "Crítico"}
                                        </div>
                                    </div>
                                </div>
                                {notLateDeadline && (<div className='late-task'>Tarefa Atrasada</div>)}
                                {task.hasAttachment && (
                                    <div onClick={() => { }} className='wrapper-has-attachment'>
                                        Visualizar Anexo Disponível
                                    </div>
                                )}
                            </div>

                        </Modal>
                    )}
                </>
            )}
        </Draggable>
    );
};

export default TaskItem;
