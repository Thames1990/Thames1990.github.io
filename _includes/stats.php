<?php
	$uri = 'http://api.football-data.org/v1/fixtures/152258';
	$reqPrefs['http']['method'] = 'GET';
	$reqPrefs['http']['header'] = 'X-Auth-Token: bf0513ea0ba6457fb4ae6d380cca8365';
	$stream_context = stream_context_create($reqPrefs);
	$response = file_get_contents($uri, false, $stream_context);
	$fixtures = json_decode($response);
	echo $fixtures;
?>
