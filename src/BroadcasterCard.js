import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {BACKFROMSEARCH} from "./actions";

class BroadcasterCard extends Component {
  constructor(){
    super();
  }

  backFromSearch = event => {
      this.props.dispatch(BACKFROMSEARCH);
  };

render(){
if (this.props.showStreamCard == false) {
    return null;
  } else if (this.props.streamInfo.length !== 0) {
    //stream online
    const streamDetails = this.props.streamInfo[0];
    var imgUrl = streamDetails.thumbnail_url;
    imgUrl = imgUrl.replace("{width}", "640");
    imgUrl = imgUrl.replace("{height}", "360");
    return (
      <div className="result-stream">
        <button onClick={this.backFromSearch} className="nav-button">
          Back
        </button>
        <p className="nomt">{streamDetails.user_name}</p>
        <a
          href={"https://www.twitch.tv/" + streamDetails.user_name}
          target="blank"
          className="result-stream-link"
        >
          <img src={imgUrl} alt="thumbnail" />
        </a>
        <p>Category: {this.props.game}</p>
        <p className="title">{streamDetails.title}</p>
        <p>{streamDetails.viewer_count} viewers</p>
      </div>
    );
  } else if (this.props.profileInfo.length !== 0) {
    return (
      <div className="result-profile">
        <button onClick={this.backFromSearch} className="nav-button">
          Back
        </button>
        <a
          href={"https://www.twitch.tv/" + this.props.profileInfo[0].display_name}
          target="blank"
        >
          <img src={this.props.profileInfo[0].profile_image_url} alt="profile-pic" />
          <p>{this.props.profileInfo[0].display_name}</p>
        </a>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={this.backFromSearch} className="nav-button">
          Back
        </button>
        <p>User not found</p>
      </div>
    );
  }
}
}

const mapStateToProps = state=>({
  showStreamCard: state.showStreamCard,
  game: state.gameName,
  streamInfo: state.resultStream,
  profileInfo: state.resultProfile
})
export default connect(mapStateToProps)(BroadcasterCard);
