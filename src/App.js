import React, { useEffect, useState } from "react";
import './App.css';
import Login from './Login/Login';
import Player from './Player/Player';
import {getTokenFromUrl} from './spotify';
import SpotifWebApi from 'spotify-web-api-js';
import {useDataLayerValue} from './DataLayer';

const spotify = new SpotifWebApi();

function App() {

  const [{ token }, dispatch] = useDataLayerValue();

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    let _token = hash.access_token;
    //console.log("I have token = ", token);

    if(_token){
      
      spotify.setAccessToken(_token);
      dispatch({
        type: "SET_TOKEN",
        token: _token
      });
      
      spotify.getMe().then(user => {
        dispatch({
          type: 'SET_USER',
          user: user
        });
      });
      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists
        });
      });
      spotify.getPlaylist('0IVGwR8XlOCcooMAaNsBLL').then(response => {
        dispatch({
          type: "SET_DISCOVER_WEEKLY",
          discover_weekly: response
        });
      });
      spotify.getMyTopArtists().then((response) =>
        dispatch({
          type: "SET_TOP_ARTISTS",
          top_artists: response,
        })
      );
      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify,
      });


    }

  }, [token, dispatch]);

  return (
    <div className="App">
      {!token && <Login />}
      {token && <Player spotify={spotify} />}
      
      
    </div>
  );
}

export default App;
