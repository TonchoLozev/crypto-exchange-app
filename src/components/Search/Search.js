import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { searchFetch } from '../../store/actions/searchActions';

import './styles.scss';

export const Search = ({
    dispatchSearchFetch,
    details,
    firstValue,
    secondValue,
}) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (firstValue && secondValue) {
            const urlValue = `${firstValue}/${secondValue}`;

            dispatchSearchFetch(urlValue);
            setInputValue(urlValue);
        }
    }, []);

    return (
        <div className="search">
            <h3 className="search__title">Type your cryptocurrency pair of interest.</h3>
            <input
                className="search__input"
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="BTC/USD, BTC/USDT, ETH/USD, etc."
                value={inputValue}
            />
            <button
              className="search__button"
              onClick={() => dispatchSearchFetch(inputValue)}
              type="button"
            >
                Search
            </button>
        </div>
    );
};

const SearchMemo = React.memo(Search);

const mapDispatchToProps = { dispatchSearchFetch: searchFetch };

export const SearchWith = connect(
    null, mapDispatchToProps,
)(SearchMemo);

Search.propTypes = {
    dispatchSearchFetch: PropTypes.func.isRequired,
    details: PropTypes.bool.isRequired,
    firstValue: PropTypes.string.isRequired,
    secondValue: PropTypes.string.isRequired,
};
