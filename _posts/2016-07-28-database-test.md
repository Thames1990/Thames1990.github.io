---
layout: post
title: "SoccerStats Datenbank Test"
date: 2016-07-28
---

{::comment}
	Fix mixed content (http/https) warning
	
	<script>
	$.ajax({
	  headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
	  url: 'http://api.football-data.org/v1/fixtures?timeFrame=n1',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
	  // do something with the response, e.g. isolate the id of a linked resource        
	  var regex = /.*?(\d+)$/; // the ? makes the first part non-greedy
	  var res = regex.exec(response.fixtures[0]._links.awayTeam.href);
	  var teamId = res[1];
	  console.log(teamId);
	}); 
</script>
{:/comment}

<script>
	$.ajax({
	  headers: { 'X-Mashape-Key: HwLuc2pw24mshfmxv16rRam5tKQ7p1wQ4Z4jsnKPyo2DsHpSsB' },
	  url: 'https://sportsop-soccer-sports-open-data-v1.p.mashape.com/v1/leagues',
	  dataType: 'json',
	  type: 'GET',
	}).done(function(response) {
	  console.log(response);
	}); 
</script>
