---
layout: post
title: "SoccerStats Datenbank Test"
date: 2016-07-28
---
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
