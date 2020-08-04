import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

export class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "First Playlist",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){
    if(this.state.playlistTracks.findIndex(item => item.id === track.id) === -1){
      this.state.playlistTracks.push(track)
      this.setState({playlistTracks : this.state.playlistTracks});
    }
  }

  removeTrack(track){
    const newPlaylist = this.state.playlistTracks.filter(item => item.id !== track.id);
    this.setState({playlistTracks: newPlaylist});
  }

  updatePlaylistName(name){
    this.setState({name: name});
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    .then(this.setState({playlistName: 'New Playlist', playlistTracks : []}))
    .catch(err => console.log(err));
  }

  search(term){
    Spotify.search(term)
    .then(res => this.setState({searchResults: Array.from(res)}))
    .catch(err => console.log(err));
  }

  render(){
    Spotify.getAccessToken();
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
            <Playlist onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
