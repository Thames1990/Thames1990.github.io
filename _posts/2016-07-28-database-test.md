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
            	$('#test').append(response);
	}); 
</script>

<p id="test"></p>
