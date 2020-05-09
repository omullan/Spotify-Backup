import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function TrackObj(name, artist, length) {
  this.name = name;
  this.artist = artist;
  this.length = length;
}

function PlaylistObj(name, length, tracksURL) {
  this.name = name;
  this.length = length;
  this.tracksURL = tracksURL;
  //this.tracks = tracks;
}

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
          var playlistArray = [];
          for(let i = 0; i < data.items.length; i++) {
            var playlist = new PlaylistObj(data.items[i].name, data.items[i].tracks.total, data.items[i].tracks.href);
            playlistArray[i] = playlist;
            console.log(playlistArray[i]);
          }
          return playlistArray;
        },
        function (err) {
          console.error(err);
        }
    );

  }
  getPlaylistTracks(PlaylistObj) {
    
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
