$(document).ready(function () {
    $('body > div > div > div > article').append('<div class="image_grid"></div>');
    $.ajax({
        headers: {'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365'},
        url: '//api.football-data.org/v1/competitions/',
        dataType: 'json',
        type: 'GET'
    }).done(function (response) {
        // Loads all competitions
        $.each(response, function (key, value) {
            $('.image_grid').append('<div id="competition_' + value.id + '" style="display: none;"></div>');
            var div = $('div#competition_' + value.id);

            // Initially set the competition div layout (mobile/desktop)
            if ($(window).width() <= 767) {
                setDivCss(div, "2", "0.5");
            } else {
                setDivCss(div, "3", "1");
            }

            // Dynamically adjust the competition div layout (mobile/desktop)
            $(window).resize(function () {
                if ($(window).width() <= 767) {
                    setDivCss(div, "2", "0.5");
                } else {
                    setDivCss(div, "3", "1");
                }
            });

            div.before(
                '<div class="page-header">' +
                '<button class="btn btn-default pull-right" id="competition_' + value.id + '" onclick="loadCompetitionData(' + value.id + ')">' +
                '<span class="caret" id="competition_' + value.id + '"></span>' +
                '</button>' +
                '<h2>' + value.caption + '</h2>' +
                '</div>'
            );
        });
    });
});

/**
 * Loads competition data if details were requested.
 * @param competition_id Id of the competition on football-data.org
 */
function loadCompetitionData(competition_id) {
    var span = $('span#competition_' + competition_id);
    var div = $('div#competition_' + competition_id);

    // Load competition data only if it hasn't been requested before
    if (!span.hasClass('caret-reversed')) {
        $.ajax({
            headers: {'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365'},
            url: '//api.football-data.org/v1/competitions/' + competition_id + '/teams',
            dataType: 'json',
            type: 'GET'
        }).done(function (response) {
            // Add each team of the competition
            $.each(response.teams, function (team_index, team_item) {
                div.append(
                    '<a class="thumbnail" href="' + response.teams[team_index].crestUrl + '">' +
                    '<figure>' +
                    '<img src="' + response.teams[team_index].crestUrl + '"/>' +
                    '<figcaption>' + response.teams[team_index].name + '</figcaption>' +
                    '</figure>' +
                    '</a>'
                );
                setThumbnailCss($('.thumbnail'));
            });
        });
    } else {
        // Unload competition data if the detail view has been closed to improve performance
        div.empty();
    }

    // Change style of detail indicator and toggle detail view visibility
    span.toggleClass('caret-reversed');
    div.slideToggle();
}

/**
 * Sets CSS parameters for the div of a competition.
 * @param div Competition div
 * @param count Defines the amount of columns
 * @param gap Defines the gap between the columns
 */
function setDivCss(div, count, gap) {
    div.css('-moz-column-count', count);
    div.css('-webkit-column-count', count);
    div.css('column-count', count);
    div.css('-moz-column-gap', gap);
    div.css('-webkit-column-gap', gap);
    div.css('column-gap', gap);
}

/**
 * Sets CSS parameters for a thumbnail.
 * @param thumbnail Team thumbnail
 */
function setThumbnailCss(thumbnail) {
    thumbnail.css('display', 'inline-block');
    thumbnail.css('border', '1px solid black');
    thumbnail.css('text-align', 'center');
    thumbnail.css('width', '100%');
    thumbnail.find('figure').css('width', '100%');
    thumbnail.find('img').css('width', '100%');
    thumbnail.find('img').css('padding', '0.5em');
    thumbnail.find('img').css('border', '1px solid black');
    thumbnail.find('figcaption').css('border', '1px solid black');
}