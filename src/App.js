import React, { Component } from "react";
import "./App.css";
import PropTypes from "prop-types";
import List from "./List";
import Search from "./Search";
import BroadcasterCard from "./BroadcasterCard";

class App extends Component {
    constructor() {
        super();

        this.state = {
            activeStreams: {
                data: []
            },
            showList: true,
            clips: false,
            search: "",
            showStreamCard: false,
            renderClips: false,
            resultStream: [],
            resultProfile: [],
            gameName: ""
        };
    }

    componentDidMount() {
        fetch("https://api.twitch.tv/helix/streams", {
            headers: {
                "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ activeStreams: data });
            });
    }

    setSearch = event => {
        this.setState({
            search: event.target.value
        });
    };

    runSearch = event => {
        event.preventDefault();
        fetch(
            "https://api.twitch.tv/helix/streams?user_login=" +
                this.state.search,
            {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            }
        )
            .then(response => response.json())
            .then(response => {
                if (response.data.length !== 0) {
                    //stream online
                    fetch(
                        "https://api.twitch.tv/helix/games?id=" +
                            response.data[0].game_id,
                        {
                            headers: {
                                "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                            }
                        }
                    )
                        .then(response => response.json())
                        .then(response => {
                            if (response.data.length) {
                                this.setState({
                                    gameName: response.data[0].name
                                });
                            }
                        });
                    this.setState({
                        showList: false,
                        showStreamCard: true,
                        resultStream: response.data,
                        resultProfile: [],
                        renderClips: false
                    });
                } else {
                    //stream offline, get profile instead
                    fetch(
                        "https://api.twitch.tv/helix/users?login=" +
                            this.state.search,
                        {
                            headers: {
                                "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                            }
                        }
                    )
                        .then(response => response.json())
                        .then(response => {
                            if (response.data.length === 0) {
                                this.setState({
                                    resultStream: [],
                                    resultProfile: [],
                                    showStreamCard: true,
                                    showList: false,
                                    renderClips: false
                                });
                            } else {
                                this.setState({
                                    resultProfile: response.data,
                                    showStreamCard: true,
                                    showList: false,
                                    resultStream: [],
                                    renderClips: false
                                });
                            }
                        });
                }
            });
    };

    backFromSearch = event => {
        this.setState({
            showStreamCard: false,
            showList: true,
            resultStream: [],
            resultProfile: [],
            gameName: "",
            search: ""
        });
    };

    showNext = event => {
        if (typeof this.state.activeStreams.pagination !== "undefined") {
            const cursorPos = this.state.activeStreams.pagination.cursor;
            fetch("https://api.twitch.tv/helix/streams?after=" + cursorPos, {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ activeStreams: data });
                });
        } else {
            fetch("https://api.twitch.tv/helix/streams", {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ activeStreams: data });
                });
        }
    };

    showPrev = event => {
        if (typeof this.state.activeStreams.pagination !== "undefined") {
            const cursorPos = this.state.activeStreams.pagination.cursor;
            fetch("https://api.twitch.tv/helix/streams?before=" + cursorPos, {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({ activeStreams: data });
                });
        } else {
            return;
        }
    };

    showClips = id => {
        fetch(
            "https://api.twitch.tv/helix/clips?broadcaster_id=" +
                id +
                "&first=10",
            {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            }
        )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    clips: data,
                    showList: false,
                    renderClips: true
                });
            });
    };

    returnToList = () => {
        this.setState({ showList: true, renderClips: false });
    };

    render() {
        return (
            <div className="App">
                <Search
                    propSearch={this.setSearch}
                    searchString={this.state.search}
                    runSearch={this.runSearch}
                />
                <List
                    list={this.state.activeStreams.data}
                    hClick={this.showNext}
                    showPrev={this.showPrev}
                    showClips={this.showClips}
                    showList={this.state.showList}
                    clips={this.state.clips}
                    returnToList={this.returnToList}
                    renderClips={this.state.renderClips}
                />
                <BroadcasterCard
                    showStreamCard={this.state.showStreamCard}
                    streamInfo={this.state.resultStream}
                    profileInfo={this.state.resultProfile}
                    game={this.state.gameName}
                    backFromSearch={this.backFromSearch}
                />
            </div>
        );
    }
}

export default App;
