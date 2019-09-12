import React, { Component } from 'react';
import PropTypes from 'prop-types';

function Search(props) {
    return (
        <form onSubmit={props.runSearch} className="search-form" >
        <input type="text" placeholder="Search" onChange={props.propSearch} value={props.searchString} className="search-field" />
      </form>
    )
}

Search.propTypes = {
    propSearch: PropTypes.func,
    searchString: PropTypes.string,
    runSearch: PropTypes.func
}

export default Search;