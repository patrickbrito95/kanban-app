import React from 'react';
import './style.css';
import Icon from '../Icons';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
                <button className="modal-close-button" onClick={onClose}><Icon name="x-mark" /></button>
            </div>
        </div>
    );
};

export default Modal;
