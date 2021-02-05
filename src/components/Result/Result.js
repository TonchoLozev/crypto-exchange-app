import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { getHistory } from '../../store/actions/historyActions';

import Modal from '../Modal';

import Loading from '../../assets/loading.svg';

import './styles.scss';

const renderListItem = (
    provider,
    price,
    dispatchGetHistory,
    setModalData,
) => (
    <li className="data-list__item" key={provider}>
        <div className="data-list__container">
            <span>{provider}</span>
            <span>{price || 'No price found'}</span>
        </div>
        {price && (
            <button
              className="data-list__button"
              onClick={() => {
                    dispatchGetHistory(provider);
                    setModalData({ isOpened: true, providerToUse: provider });
                }}
              type="button"
            >
                History
            </button>
        )}
    </li>
);

export function Result({
    search: { isLoading, data, error },
    dispatchGetHistory,
}) {
    const [isSorted, setIsSorted] = useState(false);
    const [modalData, setModalData] = useState({
        isOpened: false,
        providerToUse: '',
    });

    return (
        <div className="result">
            {data && !error
            && (
                <ul className="data-list">
                    { isSorted
                        ? Object.keys(data)
                            .sort((a, b) => Number(data[b]) - Number(data[a]))
                            .map(
                                (provider) => renderListItem(
                                    provider,
                                    data[provider],
                                    dispatchGetHistory,
                                    setModalData,
                                ),
                            )
                        : Object.keys(data)
                            .map(
                                (provider) => renderListItem(
                                    provider,
                                    data[provider],
                                    dispatchGetHistory,
                                    setModalData,
                                ),
                            )}
                </ul>
            )}
            {isLoading && <img className="loading-icon" src={Loading} alt="Loading" />}
            {error && !isLoading && <p className="result__eror">{error}</p>}
            <button
                className="result__sort-button"
                onClick={() => setIsSorted(!isSorted)}
                type="button"
            >
                Sort by price
            </button>
            {modalData.isOpened && <Modal setModalData={setModalData} provider={modalData.providerToUse} />}
        </div>
    );
}

const ResultMemo = React.memo(Result);

const mapDispatchToProps = { dispatchGetHistory: getHistory };

const mapStateToProps = createStructuredSelector({
    search: (state) => state.search,
});

export const ResultWith = connect(
    mapStateToProps, mapDispatchToProps,
)(ResultMemo);

Result.propTypes = {
    search: PropTypes.string.isRequired,
    dispatchGetHistory: PropTypes.func.isRequired,
};
