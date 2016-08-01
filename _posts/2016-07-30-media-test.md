---
layout: post
title: Multimedia Test
tags: [Mutlimedia, Test, football-data]
---

<script src="/js/jquery-1.11.2.min.js"></script>

<script>
    var competition_ids = ["424", "426", "427", "428", "430", "431", "432", "433", "434", "435", "436", "437", "438"]
    $.each(competition_ids, function(index, item) {
        $.ajax({
            headers: { 
                'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365', 
                'Access-Control-Allow-Origin': 'https://thames1990.github.io/' 
            },
            url: '//api.football-data.org/v1/competitions/' + item + '/teams',
            dataType: 'json',
            type: 'GET',
        }).done(function(response) {
            console.log(response);
            $.ajax({
                headers: { 
                    'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365',
                    'Access-Control-Allow-Origin': 'https://thames1990.github.io/' 
                },
                url: '//api.football-data.org/v1/competitions/' + item,
                dataType: 'json',
                type: 'GET',
            }).done(function(response) {
                $('.competitions').prepend('<h2>' + response.caption + '</h2>');
                $('.competitions').prepend('<div class="image_grid">');
                
            });
            $.each(response.teams, function(index, item) {
                $('.competitions').prepend(
                '<a href="' + response.teams[index].crestUrl + '"><figure><img src="' + response.teams[index].crestUrl + '"/><figcaption>' + response.teams[index].name + '</figcaption></figure></a>'
                );
            });
            $('.competitions').prepend('</div>');
        });
    });
</script>

<div id="competitions"></div>
