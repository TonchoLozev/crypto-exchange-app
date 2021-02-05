import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import Search from '../Search';
import Result from '../Result';

import { matchUrl } from '../../utils/urlUtils';

import './styles.scss';

export function Home({ searchUrl }) {
    const { pathname } = useLocation();

    const searchProps = {
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

    const {
        details,
        firstValue,
        secondValue,
    } = searchProps[searchUrl]();

    return (
        <div className="home">
            <Search
              details={details}
              firstValue={firstValue}
              secondValue={secondValue}
            />
            <Result />
        </div>
    );
}

Home.propTypes = {
    searchUrl: PropTypes.string.isRequired,
};
