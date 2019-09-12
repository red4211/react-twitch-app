import React, { Component } from 'react';
import PropTypes from 'prop-types';

function List(props) {
    const renderList = () => {
    var list = [];
    
    list = props.list.map((current, index) => {
        var imgUrl = current.thumbnail_url;
        imgUrl = imgUrl.replace("{width}", "480");
        imgUrl = imgUrl.replace("{height}", "270");

        return (
            <li key={index}>
        <a href={"https://www.twitch.tv/"+current.user_name} className="stream-link" target="blank"><img src={imgUrl} alt="thumbnail" /></a>
        <p className="title">{current.title}</p>
        <p>{current.user_name}</p>
        <p>{current.viewer_count} viewers</p>
        <button className="nav-button" onClick={(e)=>{props.showClips(current.user_id, e)}} >Top clips</button>
        </li>
        )
        })

    return (
    <div>
        <button className="nav-button marg1" onClick={props.showPrev}>Previous</button>
        <button className="nav-button marg1" onClick={props.hClick} >Next</button>
        <ul className="streams-list">{list}</ul>
    </div>)
    }

    const renderClipsFunc = () => {
        const clipsList = props.clips.data.map((current, index) => {
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
          <button className="nav-button" onClick={props.returnToList} >Back</button>
          <ul className="clips-list">{clipsList} </ul>
          </div>
        )
    }

    if (props.showList) {
        return renderList();
    } else if (props.renderClips) { //clips
        return renderClipsFunc();
    } else {
        return null;
    }
}

List.propTypes = {
    list: PropTypes.array,
    hClick: PropTypes.func,
    showPrev: PropTypes.func,
    showClips: PropTypes.func,
    showList: PropTypes.bool,
    returnToList: PropTypes.func,
    renderClips: PropTypes.bool
}

List.defaultProps = {
    list: []
}

export default List;