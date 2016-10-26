'use strict';
var http = require('http')
	, request = require('request')
	, fs = require('fs')
	, path = require('path')
	, prompt = require('prompt-sync')()
	, Curl = require( 'node-libcurl' ).Curl;

// Setup basic curl
var curl = new Curl();
curl.setOpt('FOLLOWLOCATION', true);
curl.setOpt('TIMEOUT', 10);

// Instansiate variables
var username, playlistName, playlistId, playToken, proxy;
var mainCallback;

curl.on( 'error', function (err) {
	curl.close.bind(curl);
	request('http://gimmeproxy.com/api/getProxy?country=US', function (error, response, body) {
		var proxy = JSON.parse(body)["curl"];
		curl.setOpt('PROXY', proxy);
		curl.perform();
	});
});

curl.on( 'end', function( statusCode, body, headers ) {
	var data = JSON.parse(body);

	mainCallback(null, data);
});

function setPlaylist(user, playlist) {
	username = user;
  	playlistName = playlist;
}

function getTrack(callback) {
	mainCallback = callback;
	if(!proxy) {
		request('http://gimmeproxy.com/api/getProxy?country=US', proxyCallback);
	}else{
		var playlistUrl = 'http://8tracks.com/' + username + '/' + playlistName
		request(playlistUrl, playlistCallback);
	}
}

function proxyCallback (error, response, body) {
	proxy = JSON.parse(body)["curl"];
	curl.setOpt('PROXY', proxy);

	var playlistUrl = 'http://8tracks.com/' + username + '/' + playlistName

	request(playlistUrl, playlistCallback);
}

function playlistCallback(error, response, body) {
    playlistId = body.match(/mixes\/([0-9]+)\//)[1]

    request('http://8tracks.com/sets/new?format=jsonh', playTokenCallback);
}

function playTokenCallback(error, response, body) {
    playToken = JSON.parse(body)["play_token"]

    curl.setOpt('URL', 'http://8tracks.com/sets/' + playToken + '/play?mix_id=' + playlistId + '&format=jsonh');
    curl.perform();
}

module.exports = {
  	setPlaylist: setPlaylist,
  	getTrack: getTrack,
};