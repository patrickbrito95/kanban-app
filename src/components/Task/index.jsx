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
                        <div className={`${task.priority === "low" ? "card-low-priority" : task.priority === "high" ? "card-high-priority" : "card-critical-priority"}`}>{task.name}</div>
                        <div className='description'>{task.description}</div>
                        <div className='deadline-date'>Finalizar até&nbsp;{moment(task.dueDate).format('DD/MM/YYYY')}</div>
                        <button className="delete-button" onClick={() => onDelete(task.id)}>
                            <Icon name='x-mark' />
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
                                <div className='wrapper-details-data'>
                                    <span>
                                        Finalizar até&nbsp;
                                    </span>
                                    <div>

                                        {task.dueDate}
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
