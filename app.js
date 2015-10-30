
var PORT = 3000;

var Player = require( 'player' );
var http = require( 'http' );

var mp3File =  './mp3/monster_roar.mp3';
var player = new Player( mp3File );
var playingAudio = false;

player.on( 'error', function(){

	console.log( 'Error from player!' );
	playingAudio = false;
} );

player.on( 'playend', function(){

	console.log( 'Audio finished playing.' );
	playingAudio = false;
} );

var server = http.createServer( function( req, res ){

	console.log( 'Request received for path: %s', req.url );

	if( req.url === '/play/' ){

		if( playingAudio ){

			res.statusCode = 202;
			res.end( 'Audio in progress' );

		} else {

			console.log( 'Starting audio...' );

			player.play();
			playingAudio = true;

			res.statusCode = 200;
			res.end( 'Playing audio' );
		}

	} else if( req.url === '/stop/' ){

		if( playingAudio ){

			console.log( 'Stopping audio...' );

			player.stop();
			playingAudio = false;

			res.statusCode = 200;
			res.end( 'Audio stopped' );

		} else {

			res.statusCode = 501;
			res.end( 'No audio in progress' );
		}

	} else {

		res.statusCode = 404;
		res.end();
	}
} );

server.listen( PORT, function(){

	console.log( 'Server listening on %s', PORT );
} );