---
layout: post
title: "SoccerStats Datenbank Test"
date: 2016-07-28
---

<script>
	$.ajax({
		headers: {
			'X-Mashape-Key': '5CGnz2QM4GmshiIEb9jmizhrwEzAp1Kzby3jsney4KRPUEAFiJ',
			'Accept': 'application/json'
		},
		url: 'https://sportsop-soccer-sports-open-data-v1.p.mashape.com/v1/leagues',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		console.log(response);
		var tr = '';
		$.each(response.data.leagues, function(index, item) {
			tr += '<tr><td>' + response.data.leagues[i] + '</td></tr>';
		});
		$('#sports_open_data').append(tr);
		// $('#sports_open_data').append(JSON.stringify(response, null, '\t'));
	});
	
	$.ajax({
		headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
		url: '//api.football-data.org/v1/competitions/?season=2016',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		console.log(response);
		$('#football_data').append(JSON.stringify(response, null, '\t'));
	}); 
</script>

<h2>Sport Open Data</h2>
<h3>Verfügbare Ligen:</h3>
<table id="sports_open_data" border="1">
	<tr>
		<th>Identifier</th>
		<th>League slug</th>
		<th>Name</th>
		<th>Caption</th>
		<th>Level</th>
		<th>Federation</th>
		<th>Cup</th>
	</tr>
</table>
<br>
<h2>Football-Data</h2>
<h3>Verfügbare Ligen:</h3>
<pre id="football_data"></pre>
