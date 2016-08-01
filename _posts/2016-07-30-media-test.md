---
layout: post
title: Multimedia Test
tags: [Mutlimedia, Test, football-data]
bigimg: /img/404-soutpark.jpg
---

<script src="/js/jquery-1.11.2.min.js"></script>

<script>
	$.ajax({
		headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
		url: '//api.football-data.org/v1/competitions/430/teams',
		dataType: 'json',
		type: 'GET',
	}).done(function(response) {
		console.log(response);
		$.each(response.teams, function(index, item) {
			$('.image_grid').prepend('<a href="' + response.teams[index].crestUrl + '"><figure><img src="' + response.teams[index].crestUrl + '" width="100%"/></figure></a>');
		});
	});
</script>

<div class="image_grid"></div>
