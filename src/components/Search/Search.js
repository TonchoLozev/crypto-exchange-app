import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { searchFetch } from '../../store/actions/searchActions';

import './styles.scss';

export const Search = ({ search, dispatchSearchFetch }) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="search">
            <h3 className="search__title">Type your cryptocurrency pair of interest.</h3>
            <input
              className="search__input"
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="BTC/USD, BTC/USDT, ETH/USD, etc."
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

const mapStateToProps = createStructuredSelector({
    search: (state) => state.search,
});

const SearchMemo = React.memo(Search);

const mapDispatchToProps = { dispatchSearchFetch: searchFetch };

export const SearchWith = connect(
    mapStateToProps, mapDispatchToProps,
)(SearchMemo);

Search.propTypes = {
    search: PropTypes.string.isRequired,
    dispatchSearchFetch: PropTypes.func.isRequired,
};
