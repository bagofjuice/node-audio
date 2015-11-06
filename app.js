
var PORT = 3000;

var Player = require( 'player' );
var http = require( 'http' );

var playingAudio = false;
var files = [
	'devil_dog',
	'help_me',
	'manic_witches',
	'monster_roar',
	'terror_scream'
];

function getMp3File(){

	var index = Math.floor( Math.random() * files.length );

	return './mp3/' + files[ index ] + '.mp3';
}

var server = http.createServer( function( req, res ){

	console.log( 'Request received for path: %s', req.url );

	if( req.url === '/play/' ){

		if( playingAudio ){

			res.statusCode = 202;
			res.end( 'Audio in progress' );

		} else {

			console.log( 'Starting audio...' );
				
			var mp3File =  getMp3File();

			var player = new Player( mp3File );

			player.on( 'error', function(){

				console.log( 'Error from player!' );
				playingAudio = false;
			} );

			player.on( 'playend', function(){

				console.log( 'Audio finished playing.' );
				playingAudio = false;
			} );

			player.play();
			playingAudio = true;

			res.statusCode = 200;
			res.end( 'Playing audio ' + mp3File );
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
