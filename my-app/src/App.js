import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi();

class TrackObj{
  constructor (name, artist, length) {
    this.name = name;
    this.artist = artist;
    this.length = length;
  }
}

class PlaylistObj {
  constructor (name, length, tracksURL, tracks) {
    this.name = name;
    this.length = length;
    this.tracksURL = tracksURL;
    this.tracks = tracks;
    
  }
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

  getPlaylists = async() => {
    var data = await spotifyApi.getUserPlaylists();
    console.log(data);
    var playlistArray = [];
    for(let i = 0; i < data.items.length; i++) {
      var tracksURL = data.items[i].tracks.href.slice(37,59);
      var tracks = await this.getPlaylistTracks_2(tracksURL);
      var playlist = new PlaylistObj(data.items[i].name, data.items[i].tracks.total, tracksURL, tracks);
      playlistArray[i] = playlist;
    }
    console.log(playlistArray);
    return playlistArray;
  }

  getPlaylistTracks_2 = async (tracksURL) => {
    var data = await spotifyApi.getPlaylistTracks(tracksURL);
    var tracklist = [];
      if(data.total <= 100) {
        for(let i = 0; i < data.total; i++) {
            var track = new TrackObj(data.items[i].track.name, data.items[i].track.artists[0].name, data.items[i].track.duration_ms);
            tracklist[i] = track;
          }
        } 
      return tracklist;
  }


  render() {
    return (
      <div className='App'>
        <a href='http://localhost:8888'> Login to Spotify </a>
      </div>

    );
  }
}

export default App;
