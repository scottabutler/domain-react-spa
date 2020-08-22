import React from 'react';

function NumericSearchField(props: any) {
    const { label, id, defaultValue, updateHandler, interval, icon } = props;

    const decrement = function() {
        if (defaultValue - interval >= 0) {
            updateHandler(defaultValue - interval);
        }
    }

    const increment = function() {
        updateHandler(defaultValue + interval);
    }

    return (
        <>
            <div className="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 numeric-search-field mb-2 align-bottom controls mt-2">
                <button className="down bg-light text-dark p-1 border border-secondary rounded-left d-inline-block" onClick={decrement}>-</button>
                <span className="value px-2 py-1 border-top border-bottom border-secondary d-inline-block"><i className={`${icon} float-left`} />{defaultValue.toLocaleString()}+</span>
                <button className="up bg-light text-dark p-1 border border-secondary rounded-right d-inline-block" onClick={increment}>+</button>
            </div>
        </>
    );
}

export default NumericSearchField;