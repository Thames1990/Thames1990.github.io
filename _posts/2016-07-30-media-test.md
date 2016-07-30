---
layout: default
title: Multimedia Test
---
<script>
	$.ajax({
		headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
		url: '//api.football-data.org/v1/competitions/430/teams',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		console.log(response);
		var tr = '';
		$.each(response.teams, function(index, item) {
			$('team_logos').prepend('<img src="response.teams[index].cresturl"/>');
		});
		$('#football_data').append(tr);
	});
</script>

<div id="team_logos"></div>
