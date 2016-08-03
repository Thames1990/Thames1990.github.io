var competition_ids = [424, 426, 427, 428, 430, 431, 432, 433, 434, 435, 436, 437, 438];
// var competition_ids = [424];
$('body > div > div > div > article').append('<div class="image_grid"></div>');
$.each(competition_ids, function (competition_index, competition) {
    $('.image_grid').append('<div class="' + competition + '"></div>');
    $.ajax({
        headers: {'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365'},
        url: '//api.football-data.org/v1/competitions/' + competition + '/teams',
        dataType: 'json',
        type: 'GET'
    }).done(function (response) {
        console.log(response);
        $.ajax({
            headers: {'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365'},
            url: '//api.football-data.org/v1/competitions/' + competition,
            dataType: 'json',
            type: 'GET'
        }).done(function (response) {
            $('.' + competition).before(
                '<h2 class="' + competition + '" onclick="toggle_div(' + competition + ')" style="cursor: crosshair">' + response.caption + '</h2>'
            ).hide();
        });
        $.each(response.teams, function (team_index, team_item) {
            $('.' + competition).append(
                '<a href="' + response.teams[team_index].crestUrl + '">' +
                '<figure>' +
                '<img src="' + response.teams[team_index].crestUrl + '"/>' +
                '<figcaption>' + response.teams[team_index].name + '</figcaption>' +
                '</figure>' +
                '</a>'
            );
        });
    });
});

var toggle_div = function (competition_item) {
    $('div.' + competition_item).toggle();
};