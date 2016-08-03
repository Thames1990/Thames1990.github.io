$.ajax({
    headers: {
        'X-Mashape-Key': '5CGnz2QM4GmshiIEb9jmizhrwEzAp1Kzby3jsney4KRPUEAFiJ',
        'Accept': 'application/json'
    },
    url: 'https://sportsop-soccer-sports-open-data-v1.p.mashape.com/v1/leagues',
    dataType: 'json',
    type: 'GET'
}).done(function (response) {
    console.log(response);
    var tr = '';
    $.each(response.data.leagues, function (key, value) {
        tr += '<tr>';
        tr += '<td>' + response.data.leagues[key].identifier + '</td>';
        tr += '<td>' + response.data.leagues[key].league_slug + '</td>';
        tr += '<td>' + response.data.leagues[key].name + '</td>';
        tr += '<td>' + response.data.leagues[key].nation + '</td>';
        tr += '<td>' + response.data.leagues[key].level + '</td>';
        tr += '<td>' + response.data.leagues[key].federation + '</td>';
        tr += '<td>' + response.data.leagues[key].cup + '</td>';
        tr += '</tr>';
    });
    $('.sports_open_data').find('tbody').append(tr);
});

$.ajax({
    headers: {'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365'},
    url: '//api.football-data.org/v1/competitions/?season=2016',
    dataType: 'json',
    type: 'GET'
}).done(function (response) {
    console.log(response);
    var tr = '';
    $.each(response, function (key, value) {
        tr += '<tr>';
        tr += '<td>' + response[key].id + '</td>';
        tr += '<td>' + response[key].caption + '</td>';
        tr += '<td>' + response[key].league + '</td>';
        tr += '<td>' + response[key].year + '</td>';
        tr += '<td>' + response[key].currentMatchday + '</td>';
        tr += '<td>' + response[key].numberOfMatchdays + '</td>';
        tr += '<td>' + response[key].numberOfTeams + '</td>';
        tr += '<td>' + response[key].numberOfGames + '</td>';
        tr += '<td>' + response[key].lastUpdated + '</td>';
        tr += '</tr>';
    });
    $('.football_data').find('tbody').append(tr);
});