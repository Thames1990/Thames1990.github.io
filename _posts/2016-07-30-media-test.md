---
layout: post
title: Multimedia Test
tags: [Mutlimedia, Test, football-data]
---

<script src="/js/jquery-1.11.2.min.js"></script>

<script>
    var competition_ids = [424, 426, 427, 428, 430, 431, 432, 433, 434, 435, 436, 437, 438]
    $.each(competition_ids, function(index, item) {
        $.ajax({
        		headers: { 'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365' },
        		url: '//api.football-data.org/v1/competitions/' + index + '/teams',
        		dataType: 'json',
        		type: 'GET',
        	}).done(function(response) {
        		console.log(response);
        		$('.image_grid').prepend('<h2>' + response.teams[index].crestUrl + '</h2>');
        		$.each(response.teams, function(index, item) {
        			$('.image_grid').prepend(
        			    '<a href="' + response.teams[index].crestUrl + '"><figure><img src="' + response.teams[index].crestUrl + '" width="100%"/><figcaption>' + response.teams[index].name + '</figcaption></figure></a>'
                    );
        		});
        	});
    }
</script>

<div class="image_grid"></div>
