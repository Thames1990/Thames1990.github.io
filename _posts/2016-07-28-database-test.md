---
layout: post
title: Datenbank Test
tags:
  - Datenbank
  - football-data
  - sport-open-data
js: js/jquery-1.11.2.min.js
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
			tr += '<tr>';
			tr += '<td>' + response.data.leagues[index].identifier + '</td>';
			tr += '<td>' + response.data.leagues[index].league_slug + '</td>';
			tr += '<td>' + response.data.leagues[index].name + '</td>';
			tr += '<td>' + response.data.leagues[index].nation + '</td>';
			tr += '<td>' + response.data.leagues[index].level + '</td>';
			tr += '<td>' + response.data.leagues[index].federation + '</td>';
			tr += '<td>' + response.data.leagues[index].cup + '</td>';
			tr += '</tr>';
		});
		$('#sports_open_data').append(tr);
	});
	
	$.ajax({
		headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
		url: '//api.football-data.org/v1/competitions/?season=2016',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		console.log(response);
		var tr = '';
		$.each(response, function(index, item) {
			tr += '<tr>';
			tr += '<td>' + response[index].id + '</td>';
			tr += '<td>' + response[index].caption + '</td>';
			tr += '<td>' + response[index].league + '</td>';
			tr += '<td>' + response[index].year + '</td>';
			tr += '<td>' + response[index].currentMatchday + '</td>';
			tr += '<td>' + response[index].numberOfMatchdays + '</td>';
			tr += '<td>' + response[index].numberOfTeams + '</td>';
			tr += '<td>' + response[index].numberOfGames + '</td>';
			tr += '<td>' + response[index].lastUpdated + '</td>';
			tr += '</tr>';
		});
		$('#football_data').append(tr);
	}); 
</script>

## Sport Open Data
### Verfügbare Ligen:
<table id="sports_open_data" border="1">
	<tr>
		<th>Id</th>
		<th>Abkürzung</th>
		<th>Name</th>
		<th>Nation</th>
		<th>Ligaklasse</th>
		<th>Verband</th>
		<th>Pokal?</th>
	</tr>
</table>

## Football-Data
### Verfügbare Ligen:
<table id="football_data" border="1">
	<tr>
		<th>Id</th>
		<th>Name</th>
		<th>Abkürzung</th>
		<th>Jahr</th>
		<th>Aktueller Spieltag</th>
		<th>Spieltage</th>
		<th>Mannschaften</th>
		<th>Spiele</th>
		<th>Zuletzt aktualisiert</th>
	</tr>
</table>
