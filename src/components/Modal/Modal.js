import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Loading from '../../assets/loading.svg';

import './styles.scss';

export function Modal({
    history: { isLoading, data, error },
    provider,
    setModalData,
}) {
    return (
        <div className="modal">
            <div className="modal__container">
                <button
                    className="modal__close-button"
                    onClick={() => setModalData({ isOpened: false })}
                    type="button"
                >
                    X
                </button>
                <h3>Recent trades</h3>
                {isLoading && <img className="loading-icon" src={Loading} alt="Loading" />}
                {data && !isLoading && !error
                && (
                    <ul className="history-list">
                        {Object.keys(data[provider]).map((key) => (
                            <li className="history-list__item">
                                <div className="history-list__item-container">
                                    <span className="history-list__item-key">Price </span>
                                    <span className="history-list__item-value">{data[provider][key].price}</span>
                                </div>
                                <div className="history-list__item-container">
                                    <span className="history-list__item-key">Date </span>
                                    <span className="history-list__item-value">{data[provider][key].date}</span>
                                </div>
                                <div className="history-list__item-container">
                                    <span className="history-list__item-key">Sell/Buy </span>
                                    <span className="history-list__item-value">{data[provider][key].sell ? 'Sell' : 'Buy'}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

const ModalMemo = React.memo(Modal);

const mapStateToProps = createStructuredSelector({
    history: (state) => state.history,
});

export const ModalWith = connect(
    mapStateToProps,
)(ModalMemo);

Modal.propTypes = {
    provider: PropTypes.string.isRequired,
    history: PropTypes.string.isRequired,
    setModalData: PropTypes.func.isRequired,
};
