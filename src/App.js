import React, { Component } from 'react';
import './App.css';
import PropTypes from 'prop-types';

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
        }
    }

    componentDidMount() {
        fetch("https://api.twitch.tv/helix/streams", {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            }).then(response => response.json())
            .then(data => {
                this.setState({ activeStreams: data })
            })
    }

    setSearch = (event) => {
        this.setState({
            search: event.target.value
        })
    }

    runSearch = (event) => {
        event.preventDefault();
        fetch("https://api.twitch.tv/helix/streams?user_login=" + this.state.search, {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
            .then(response => response.json())
            .then(response => {
                if (response.data.length !== 0) { //stream online
                    fetch("https://api.twitch.tv/helix/games?id=" + response.data[0].game_id, { headers: { "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2" } })
                        .then(response => response.json())
                        .then(response => {
                            if (response.data.length) {
                                this.setState({ gameName: response.data[0].name })
                            }
                        })
                    this.setState({ showList: false, showStreamCard: true, resultStream: response.data, resultProfile: [], renderClips: false })
                } else { //stream offline, get profile instead
                    fetch("https://api.twitch.tv/helix/users?login=" + this.state.search, {
                            headers: { "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2" }
                        })
                        .then(response => response.json())
                        .then(response => {
                            if (response.data.length === 0) {
                                this.setState({ resultStream: [], resultProfile: [], showStreamCard: true, showList: false, renderClips: false })
                            } else {
                                this.setState({ resultProfile: response.data, showStreamCard: true, showList: false, resultStream: [], renderClips: false })
                            }
                        })
                }
            })
    }

    backFromSearch = (event) => {
        this.setState({
            showStreamCard: false,
            showList: true,
            resultStream: [],
            resultProfile: [],
            gameName: "",
            search: ""
        })
    }

    showNext = (event) => {
        if (typeof this.state.activeStreams.pagination !== "undefined") {
            const cursorPos = this.state.activeStreams.pagination.cursor;
            fetch("https://api.twitch.tv/helix/streams?after=" + cursorPos, {
                    headers: {
                        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                    }
                }).then(response => response.json())
                .then(data => {
                    this.setState({ activeStreams: data })
                })
        } else {
            fetch("https://api.twitch.tv/helix/streams", {
                    headers: {
                        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                    }
                }).then(response => response.json())
                .then(data => {
                    this.setState({ activeStreams: data })
                })
        }

    }

    showPrev = (event) => {
        if (typeof this.state.activeStreams.pagination !== "undefined") {
            const cursorPos = this.state.activeStreams.pagination.cursor;
            fetch("https://api.twitch.tv/helix/streams?before=" + cursorPos, {
                    headers: {
                        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                    }
                }).then(response => response.json())
                .then(data => {
                    this.setState({ activeStreams: data })
                })
        } else { return }
    }

    showClips = (id) => {
        fetch("https://api.twitch.tv/helix/clips?broadcaster_id=" + id + "&first=10", {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            }).then(response => response.json())
            .then(data => {
                this.setState({ clips: data, showList: false, renderClips: true })
            })
    }

    returnToList = () => {
        this.setState({ showList: true, renderClips: false })
    }

    render() {
        return (
            <div className="App">
      <Search propSearch={this.setSearch} searchString={this.state.search} runSearch={this.runSearch}/>
      <List list={this.state.activeStreams.data} hClick = {this.showNext} showPrev={this.showPrev} showClips={this.showClips} 
        showList={this.state.showList}
        clips = {this.state.clips}
        returnToList = {this.returnToList}
        renderClips = {this.state.renderClips}
      />
      <BroadcasterCard showStreamCard={this.state.showStreamCard} streamInfo={this.state.resultStream} profileInfo={this.state.resultProfile}
      game={this.state.gameName} backFromSearch={this.backFromSearch}/>
    </div>
        );
    }

}

class List extends Component {
    render() {
        if (this.props.showList) {
            var list = [];
            if (typeof this.props.list !== "undefined") {
                list = this.props.list.map((current, index) => {
                    var imgUrl = current.thumbnail_url;
                    imgUrl = imgUrl.replace("{width}", "480");
                    imgUrl = imgUrl.replace("{height}", "270");

                    return (
                        <li key={index}>
            <a href={"https://www.twitch.tv/"+current.user_name} className="stream-link" target="blank"><img src={imgUrl} /></a>
            <p className="title">{current.title}</p>
            <p>{current.user_name}</p>
            <p>{current.viewer_count} viewers</p>
            <button className="nav-button" onClick={(e)=>{this.props.showClips(current.user_id, e)}} >Top clips</button>
          </li>
                    )
                })
            } else {
                list = <li className="center-text">Nothing here</li>
            }

            return (
                <div>
        <button className="nav-button marg1" onClick={this.props.showPrev}>Previous</button>
        <button className="nav-button marg1" onClick={this.props.hClick} >Next</button>
          <ul className="streams-list">{list}</ul>
        </div>
            )
        } else if (this.props.renderClips) { //clips
            const clipsList = this.props.clips.data.map((current, index) => {
                return (
                    <li key={index}>
              <iframe
                  src={current.embed_url+"&autoplay=false"}
                  height="270"
                  width="480"
                  scrolling="no"
                  allowfullscreen="true">
              </iframe>
            </li>
                )
            })

            return (
                <div>
          <button className="nav-button" onClick={this.props.returnToList} >Back</button>
          <ul className="clips-list">{clipsList} </ul>
          </div>
            )
        } else {
            return null;
        }
    }
}

function Search(props) {
    return (
        <form onSubmit={props.runSearch} className="search-form" >
        <input type="text" placeholder="Search" onChange={props.propSearch} value={props.searchString} className="search-field" />
      </form>
    )
}

function BroadcasterCard(props) {

    if (props.showStreamCard == false) {
        return null;
    } else if (props.streamInfo.length !== 0) { //stream online
        const streamDetails = props.streamInfo[0];
        var imgUrl = streamDetails.thumbnail_url;
        imgUrl = imgUrl.replace("{width}", "640");
        imgUrl = imgUrl.replace("{height}", "360");
        return (
            <div className="result-stream" >
          <button onClick={props.backFromSearch} className="nav-button" >Back</button>
          <p className="nomt" >{streamDetails.user_name}</p>
          <a href={"https://www.twitch.tv/"+streamDetails.user_name} target="blank" className="result-stream-link" ><img src={imgUrl} /></a>
          <p>Category: {props.game}</p>
          <p className="title">{streamDetails.title}</p>
          <p>{streamDetails.viewer_count} viewers</p>
        </div>
        )
    } else if (props.profileInfo.length !== 0) {
        return (
            <div className="result-profile">
          <button onClick={props.backFromSearch} className="nav-button" >Back</button>
          <a href={"https://www.twitch.tv/"+props.profileInfo[0].display_name} target="blank">
            <img src={props.profileInfo[0].profile_image_url} />
          <p>{props.profileInfo[0].display_name}</p>
          </a>
        </div>
        )
    } else {
        return <div><button onClick={props.backFromSearch} className="nav-button" >Back</button><p>User not found</p> </div>
    }
}

export default App;