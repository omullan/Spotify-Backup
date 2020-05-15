import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

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

  getPlaylists = async () => {
    var data = await spotifyApi.getUserPlaylists();
    var playlistArray = [];
    for(let i = 0; i < data.items.length; i++) {
      var tracksURL = data.items[i].tracks.href.slice(37,59);
      var tracks = await this.getPlaylistTracks(tracksURL);
      var playlist = new PlaylistObj(data.items[i].name, data.items[i].tracks.total, tracksURL, tracks);
      playlistArray[i] = playlist;
    }
    return await playlistArray;
  }

  getPlaylistTracks = async (tracksURL) => {
    var data = await spotifyApi.getPlaylistTracks(tracksURL);
    var tracklist = [];
      if(data.total <= 100) {
        for(let i = 0; i < data.total; i++) {
          var track = new TrackObj(data.items[i].track.name, data.items[i].track.artists[0].name, data.items[i].track.duration_ms);
          tracklist[i] = track;
        }
      } else {
        for(let i = 0; i < data.total; i=i+100) {
          var result = await spotifyApi.getPlaylistTracks(tracksURL, {offset: i});
          for(let j = 0; j < 100 && result.items[j] != null; j++) {
            var track = new TrackObj(result.items[j].track.name, result.items[j].track.artists[0].name, result.items[j].track.duration_ms);
            tracklist[i+j] = track;
          }
        }
      }
      return tracklist;
  }
  callFunctions = async () => {
    var x = await this.getPlaylists();
    var y = this.formatForWrite(x);
    var z = this.writeToFile(y);
  }

  call() {
    this.callFunctions();
  }

  formatForWrite(playlistArray) {
    var formattedData = [];
    var index = 0;
    for(let i = 0; i < playlistArray.length; i++) {
      var data = [playlistArray[i].name, playlistArray[i].length.toString(),playlistArray[i].tracksURL];
      formattedData[index++] = data;
      var space = [" ", " ", " "];
      formattedData[index++] = space;
      for(let j = 0; j < playlistArray[i].tracks.length; j++) {
        var song = [playlistArray[i].tracks[j].name, playlistArray[i].tracks[j].artist, playlistArray[i].tracks[j].length.toString()];
        formattedData[index++] = song;
      }
    }
    console.log(formattedData);
    return formattedData;
  }
  writeToFile(formattedData) {
    var finalVal = '';
    for (var i = 0; i < formattedData.length; i++) {
      var value = formattedData[i];
      for (var j = 0; j < value.length; j++) {
        var innerValue = value[j];
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0)
            result = '"' + result + '"';
        if (j > 0)
            finalVal += ',';
        finalVal += result;
      }
      finalVal += '\n';
    }
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(finalVal));
    pom.setAttribute('download', 'test.csv');
    pom.click();
  }

  render() {
    return (
      <div className='App'>
        <div>
          <a href='http://localhost:8888'> Login to Spotify </a>
          {this.call()}
        </div>
      </div>

    );
  }
}

export default App;
