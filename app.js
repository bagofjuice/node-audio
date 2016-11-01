var PORT = 3000,
	Player = require('player'),
	http = require('http'),
	playingAudio = false,
	player;

var URL_PLAY = '/play',
	URL_STOP = '/stop';

function getAudioFileName() {
	var filename = 'siren1.mp3';
	return './mp3/' + filename;
}

function playAudio(res) {
	if (playingAudio) {
		res.statusCode = 202;
		res.end('Audio in progress');
	} else {
		console.log('Starting audio...');

		var filename = getAudioFileName();

		player = new Player(filename);

		player.on('error', function () {
			console.log('Error from player!');
			playingAudio = false;
		});

		player.on('playend', function () {
			console.log('Audio finished playing.');
			playingAudio = false;
		});

		player.play();
		playingAudio = true;

		res.statusCode = 200;
		res.end('Playing audio ' + filename);
	}
}

function stopAudio(res) {
	if (playingAudio) {
		console.log('Stopping audio...');

		player.stop();
		playingAudio = false;

		res.statusCode = 200;
		res.end('Audio stopped');

	} else {
		res.statusCode = 501;
		res.end('No audio in progress');
	}
}

var server = http.createServer(function (req, res) {
	console.log('Request received for path: %s', req.url);

	switch (req.url) {
		case URL_PLAY:
			playAudio(res);
			break;
		case URL_STOP:
			stopAudio(res);
			break;
		default:
			res.statusCode = 404;
			res.end();
			break;
	}
});

server.listen(PORT, function () {
	console.log('Server listening on %s', PORT);
});
