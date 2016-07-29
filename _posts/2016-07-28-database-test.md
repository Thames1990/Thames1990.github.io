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
		$('#sports_open_data').append(JSON.stringify(response, null, '\t'));
	});
	
	$.ajax({
		headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
		url: '//api.football-data.org/v1/fixtures?timeFrame=n7',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		console.log(response);
		$('#football_data').append(JSON.stringify(response, null, '\t'));
	}); 
</script>

<h2>Sport Open Data</h2>
<h3>Verfügbare Ligen:</h3>
<pre id="sports_open_data"></pre>
<br>
<h2>Football-Data</h2>
<h3>Spiele in den nächsten 7 Tagen:</h3>
<pre id="football_data"></pre>
