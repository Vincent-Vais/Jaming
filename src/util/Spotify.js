let token;
let expiresIn;
const redirectURL = "http://localhost:3000/";
const clientID = process.env.REACT_APP_CLIENT_ID;

const Spotify = {
    getAccessToken: function(){
        if(token){
            return token;
        }
        let url = window.location.href;
        let tokenArr = url.match(/access_token=([^&]*)/);
        let expiresInArr = url.match(/expires_in=([^&]*)/);
        if(tokenArr && expiresInArr){
            token = tokenArr[1];
            expiresIn = parseInt(expiresInArr[1]);
            window.setTimeout(() => token = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
        }else{
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
        }
        return token;
    },
    search: async function(term){
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        return data.tracks.items.map(item => {
            const track = {
                id: item.id,
                name: item.name,
                artist: item.artists[0].name,
                album: item.album.name,
                uri: item.uri
            };
            return track;
        });
    },
    savePlaylist: async function(name, uris){
        if(!name || !uris){
            return ;
        }
        let accessToken = Spotify.getAccessToken();
        let headers = {Authorization: `Bearer ${accessToken}`}
        let userID;
        let playlistID;
        const userResp = await fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        });
        const userData = await userResp.json();
        userID = userData.id;
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({name: name})
        });
        const data = await response.json();
        playlistID = data.id;
        console.log(uris);
        const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({"uris": uris})
        })
    }
}

export default Spotify;