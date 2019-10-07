import React, { Component } from "react";
import { connect } from "react-redux";
import { setSearchAction, runSearchThunk } from "./actions";

class Search extends Component {
	constructor(props) {
		super(props);
	}

	setSearch = event => {
		this.props.dispatch(setSearchAction(event.target.value));
	};

	runSearch = event => {
		event.preventDefault();
		this.props.dispatch(runSearchThunk());
	};

	render() {
		return (
			<form onSubmit={this.runSearch} className="search-form">
				<input
					type="text"
					placeholder="Search"
					onChange={this.setSearch}
					value={this.props.search}
					className="search-field"
				/>
			</form>
		);
	}
}

const mapStateToProps = state => ({
	search: state.search
});
export default connect(mapStateToProps)(Search);
