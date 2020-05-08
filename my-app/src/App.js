import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    console.log(params);
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getPlaylists() {
    spotifyApi.getUserPlaylists().then(
        function (data) {
          console.log(data)
        },
        function (err) {
          console.error(err);
        }
    );
}

  render() {
    return (
      <div className='App'>
        <a href='http://localhost:8888'> Login to Spotify </a>
        {this.getPlaylists()}
      </div>

    );
  }
}

export default App;
