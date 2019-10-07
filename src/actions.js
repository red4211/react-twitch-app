export const TEST = {
	type:"TEST"
}
export function setInitialStreams(streams){
	return {
		type: "SETINITSTREAM",
		streams: streams
	}
}

export function getInitialStreams(){
	return function(dispatch, getState){
        fetch("https://api.twitch.tv/helix/streams", {
            headers: {
                "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
            }
        })
            .then(response => response.json())
            .then(data => {
                dispatch(setInitialStreams(data));
            });		
	}
}

export const TOGGLECLIPDISPLAY = {
	type: "TOGGLECLIPDISPLAY"
}

export function showNextThunk(){
	return function(dispatch, getState){
		if (typeof getState().activeStreams.pagination !== "undefined"){
                   const cursorPos = getState().activeStreams.pagination.cursor;
            fetch("https://api.twitch.tv/helix/streams?after=" + cursorPos, {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
                .then(response => response.json())
                .then(data => {
                    dispatch(setInitialStreams(data));
                });
	}else{
            fetch("https://api.twitch.tv/helix/streams", {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
                .then(response => response.json())
                .then(data => {
                    dispatch(setInitialStreams(data));
                });
		}
		}
}

export function showPrevThunk(){
	return function(dispatch, getState){
if (typeof getState().activeStreams.pagination !== "undefined") {
            const cursorPos = getState().activeStreams.pagination.cursor;
            console.log(getState().activeStreams);
            fetch("https://api.twitch.tv/helix/streams?before=" + cursorPos, {
                headers: {
                    "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                }
            })
                .then(response => response.json())
                .then(data => {
                    dispatch(setInitialStreams(data));
                });
	}else{return}
}
}

export function setSearchAction(text){
	return {
		type: "SETSEARCH",
		search: text
	}
}

export function setGameName(name){
	return {
		type: "GAMENAME",
		gameName: name
	}
}

export const SHOWSEARCHRESULT = {
	type: "SHOWSEARCHRESULT"
}

export function setResultStream(data){
	return {
		type: "SETRESULTSTREAM",
		resultStream: data
	}
}

export function setProfileInfo(data){
	return{
		type: "SETPROFILEINFO",
		resultProfile: data
	}
}

export function runSearchThunk(){
	return function(dispatch, getState){
        fetch(
            "https://api.twitch.tv/helix/streams?user_login=" + getState().search,
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
                                dispatch(setGameName(response.data[0].name));
                            }
                        });
                    
                    	dispatch(SHOWSEARCHRESULT);
                    	dispatch(setResultStream(response.data));
                } else {
                    //stream offline, get profile instead
                    fetch(
                        "https://api.twitch.tv/helix/users?login=" + getState().search,
                        {
                            headers: {
                                "Client-ID": "wzdibt6ncymm2c9nquwlpkn9hg58i2"
                            }
                        }
                    )
                        .then(response => response.json())
                        .then(response => {
                            dispatch(setProfileInfo(response.data));
                        });
                }
            });
	}
}

export const BACKFROMSEARCH = {
	type: "BACKFROMSEARCH"
}

export function setClips(data){
	return {
		type: "SETCLIPS",
		clips: data
	}
}