import React, { Component } from "react";
import "./App.css";
import PropTypes from "prop-types";
import List from "./List";
import Search from "./Search";
import BroadcasterCard from "./BroadcasterCard";
import { connect } from "react-redux";
import {
    getInitialStreams,
    setInitialStreams,
    TOGGLECLIPDISPLAY,
    setClips
} from "./actions";

class App extends Component {
    constructor() {
        super();

        this.state = {
            renderClips: false
        };
    }

    componentDidMount() {
        this.props.dispatch(getInitialStreams());
    }

    showClips = id => {
        fetch(
            "https://api.twitch.tv/helix/clips?broadcaster_id=" +
                id +
                "&first=10",
            {
                headers: { "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2" }
            }
        )
            .then(response => response.json())
            .then(data => {
                this.props.dispatch(setClips(data));
                this.props.dispatch(TOGGLECLIPDISPLAY);
            });
    };

    render() {
        return (
            <div className="App">
                <Search />
                <List showClips={this.showClips}/>
                <BroadcasterCard />
            </div>
        );
    }
}
export default connect()(App);
