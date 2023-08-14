import moment from 'moment';
import React from 'react';

export const Input = ({ inputSelect, className, value, onChange, type, placeholder, children, label }) => {
    return (
        <>
            {inputSelect ? (
                <>
                    <label>{label}</label>
                    <select
                        className={className}
                        value={value}
                        onChange={onChange}
                    >
                        {children}
                    </select>
                </>
            ) : (
                <>
                    {label && (
                        <label>{label}</label>
                    )}
                    <input
                        className={className}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onChange={onChange}
                    />
                </>
            )}
        </>
    )
}