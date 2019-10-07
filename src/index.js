import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {TEST, TOGGLECLIPDISPLAY, setSearchAction, setProfileInfo, BACKFROMSEARCH} from './actions';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';

const initialState = {
	activeStreams: [],
	showList: true,
	renderClips: false,
	search: "",
	gameName: "",
    resultStream: [],
    resultProfile: [],
    showStreamCard: false,
    clips: []
}
function reducer(state = initialState, action){
	switch(action.type){
		case "SETINITSTREAM":
		return {
			...state,
			activeStreams: action.streams
		}

		case "TOGGLECLIPDISPLAY":
		return {
			...state,
			showList: !state.showList,
			renderClips: !state.renderClips
		}

		case "SETSEARCH":
		return {
			...state,
			search: action.search
		}

		case "SHOWSEARCHRESULT":
		return {
			...state,
			renderClips: false,
			showList: false,
			showStreamCard: true
		}

		case "SETRESULTSTREAM":
		return {
			...state,
			resultStream: action.resultStream
		}

		case "BACKFROMSEARCH":
		return {
			...state,
			showStreamCard: false,
			showList: true,
		    resultStream: [],
		    resultProfile: [],
		    gameName: "",
		    search: ""			
		}

		case "GAMENAME":
		return {
			...state,
			gameName: action.gameName
		}

		case "SETPROFILEINFO":
		return {
			...state,
			resultProfile: action.resultProfile,
			resultStream: [],
            showStreamCard: true,
            showList: false,
            renderClips: false
		}

		case "SETCLIPS":
		return {
			...state,
			clips: action.clips
		}

		default:
		return state;
	}
}
const store = createStore(
  reducer,
  applyMiddleware(thunk)
);

const Wrapper = ()=>(
<Provider store={store}><App/></Provider>
)

ReactDOM.render(<Wrapper />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
