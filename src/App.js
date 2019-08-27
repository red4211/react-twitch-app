import React, {Component} from 'react';
import './App.css';
import PropTypes from 'prop-types';

class App extends Component {
  constructor(){
    super();

    this.state = {
      activeStreams: {
        data: []
      },
      showList:true,
      clips:false
    }
  }

  componentDidMount(){
    fetch("https://api.twitch.tv/helix/streams", 
    {
      headers: {
        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
      }
    }).then(response => response.json())
    .then(data => {
      this.setState({activeStreams: data})
    })
    }

    showNext = (event)=>{
      const cursorPos = this.state.activeStreams.pagination.cursor;
      fetch("https://api.twitch.tv/helix/streams?after="+cursorPos, 
    {
      headers: {
        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
      }
    }).then(response => response.json())
    .then(data => {
      this.setState({activeStreams: data})
    })
    }

    showPrev = (event)=>{
      const cursorPos = this.state.activeStreams.pagination.cursor;
      fetch("https://api.twitch.tv/helix/streams?before="+cursorPos, 
    {
      headers: {
        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
      }
    }).then(response => response.json())
    .then(data => {
      this.setState({activeStreams: data})
    })
    }

    showClips = (id)=>{
      fetch("https://api.twitch.tv/helix/clips?broadcaster_id="+id+"&first=10", 
    {
      headers: {
        "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
      }
    }).then(response => response.json())
    .then(data => {
      this.setState({clips: data, showList:false})
    })  
    }

    returnToList = ()=>{
      this.setState({showList:true})
    }

     render(){
    return (
    <div className="App">
      <List list={this.state.activeStreams.data} hClick = {this.showNext} showPrev={this.showPrev} showClips={this.showClips} 
        showList={this.state.showList}
        clips = {this.state.clips}
        returnToList = {this.returnToList}
      />
    </div>
  );
  }

  }

class List extends Component{
  render(){
    if(this.props.showList){
const list = this.props.list.map((current,index)=>{
      var imgUrl = current.thumbnail_url;
      imgUrl = imgUrl.replace("{width}", "480");
      imgUrl = imgUrl.replace("{height}", "270");

      return(
          <li key={index}>
          <p className="title">{current.title}</p>
            <p className="username" >{current.user_name}</p>
            <p className="viewCount">{current.viewer_count} viewers</p>
            <img src={imgUrl} />
            <button className="nav-button" onClick={(e)=>{this.props.showClips(current.user_id, e)}} >Top clips</button>
          </li>
        )
    })

    return(
        <div>
        <button className="nav-button marg1" onClick={this.props.showPrev}>Previous</button>
        <button className="nav-button marg1" onClick={this.props.hClick} >Next</button>
          <ul className="streams-list">{list}</ul>
        </div>
      )
    }else{//clips
      const clipsList = this.props.clips.data.map((current,index)=>{
        return(
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

      return(
          <div>
          <button className="nav-button" onClick={this.props.returnToList} >Back</button>
          <ul className="clips-list">{clipsList} </ul>
          </div>
        )
    }
  }
}

export default App;