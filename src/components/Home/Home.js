import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Search from '../Search';

import { matchUrl } from '../../utils/urlUtils';

import './styles.scss';

export function Home({ search }) {
    const { pathname } = useLocation();

    const childProps = {
        default: () => ({
            firstValue: '',
            secondValue: '',
            details: false,
        }),
        search: () => ({
            ...matchUrl(pathname),
            details: false,
        }),
        searchDetails: () => ({
            ...matchUrl(pathname),
            details: true,
        }),
    };

    return (
        <div className="home">
            <Search />
        </div>
    );
}

Home.propTypes = {
    search: PropTypes.string.isRequired,
};
