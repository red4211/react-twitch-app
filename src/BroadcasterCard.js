import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
          <a href={"https://www.twitch.tv/"+streamDetails.user_name} target="blank" className="result-stream-link" ><img src={imgUrl} alt="thumbnail"/></a>
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
            <img src={props.profileInfo[0].profile_image_url} alt="profile-pic" />
          <p>{props.profileInfo[0].display_name}</p>
          </a>
        </div>
        )
    } else {
        return <div><button onClick={props.backFromSearch} className="nav-button" >Back</button><p>User not found</p> </div>
    }
}

export default BroadcasterCard;