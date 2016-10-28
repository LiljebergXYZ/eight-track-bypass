# eight-track-bypass

Eight track bypass is a node module that makes use of free proxies (from http://gimmeproxy.com/) to load playlists and tracks, and as such retrieve all information from all over the world.

Usage:
```Javascript
var eightTrack = require('eight-track-bypass');
eightTrack.setPlaylist('lauraws', 'songs-to-enjoy-fall-to');
eightTrack.getFirstTrack(function(err, data) {
	if(err) {
	  console.error(err);
	  return;
	}

	console.log(data);

	eightTrack.getNextTrack(function(err, data){
		if(err) { console.error(err); }

		console.log(data);
	}
});
```
