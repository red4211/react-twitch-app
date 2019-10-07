import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {TOGGLECLIPDISPLAY, showNextThunk, showPrevThunk} from "./actions";

class List extends Component {
constructor(){
    super();
}
    returnToList = () => {
        this.props.dispatch(TOGGLECLIPDISPLAY);
    };

    showNext = event => {
        this.props.dispatch(showNextThunk());
    };

    showPrev = event => {
       this.props.dispatch(showPrevThunk()) 
    };

    render(){
    const renderList = () => {
        var list = [];

        list = this.props.list.map((current, index) => {
            var imgUrl = current.thumbnail_url;
            imgUrl = imgUrl.replace("{width}", "480");
            imgUrl = imgUrl.replace("{height}", "270");

            return (
                <li key={index}>
                    <a
                        href={"https://www.twitch.tv/" + current.user_name}
                        className="stream-link"
                        target="blank"
                    >
                        <img src={imgUrl} alt="thumbnail" />
                    </a>
                    <p className="title">{current.title}</p>
                    <p>{current.user_name}</p>
                    <p>{current.viewer_count} viewers</p>
                    <button
                        className="nav-button"
                        onClick={e => {
                            this.props.showClips(current.user_id);
                        }}
                    >
                        Top clips
                    </button>
                </li>
            );
        });

        return (
            <div>
                <button className="nav-button marg1" onClick={this.showPrev}>
                    Previous
                </button>
                <button className="nav-button marg1" onClick={this.showNext}>
                    Next
                </button>
                <ul className="streams-list">{list}</ul>
            </div>
        );
    };

    const renderClipsFunc = () => {
        const clipsList = this.props.clips.data.map((current, index) => {
            return (
                <li key={index}>
                    <iframe
                        src={current.embed_url + "&autoplay=false"}
                        height="270"
                        width="480"
                        scrolling="no"
                        allowfullscreen="true"
                    ></iframe>
                </li>
            );
        });

        return (
            <div>
                <button className="nav-button" onClick={this.returnToList}>
                    Back
                </button>
                <ul className="clips-list">{clipsList} </ul>
            </div>
        );
    };

    if (this.props.showList) {
        return renderList();
    } else if (this.props.renderClips) {
        //clips
        return renderClipsFunc();
    } else {
        return null;
    }
    }
}

List.propTypes = {
    list: PropTypes.array,
    showClips: PropTypes.func,
    showList: PropTypes.bool,
    renderClips: PropTypes.bool
};

List.defaultProps = {
    list: []
};

const mapStateToProps = state => ({
    showList: state.showList,
    renderClips: state.renderClips,
    list: state.activeStreams.data,
    clips: state.clips
})

export default connect(mapStateToProps)(List);
