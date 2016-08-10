$(document).ready(function () {
    $.ajax({
        headers: {'X-Auth-Token': 'bf0513ea0ba6457fb4ae6d380cca8365'},
        url: '//api.football-data.org/v1/competitions/',
        dataType: 'json',
        type: 'GET'
    }).done(function (response) {
        // Loads all competitions
        $.each(response, function (key, value) {
            $('body > div > div > div > article').append('<div id="competition_' + value.id + '" style="display: none;"></div>');
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
                if (response.teams[team_index].crestUrl != null) {
                    div.append(
                        '<a class="thumbnail" href="' + response.teams[team_index].crestUrl + '">' +
                        '<figure>' +
                        '<img src="' + response.teams[team_index].crestUrl + '"/>' +
                        '<figcaption>' + response.teams[team_index].name + '</figcaption>' +
                        '</figure>' +
                        '</a>'
                    );
                } else {
                    loadLogoViaWikimedia(response, team_index);
                }
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
 * Loads a team logo via Wikimedia as a fallback, if 'cresturl' isn't defined.
 * TODO Fix 404 errors on defined, but not correctly set 'cresturl' parameter
 * @param response JSON response from AJAX call
 * @param team_index The appropriate team index in the JSON response
 */
function loadLogoViaWikimedia(response, team_index) {
    console.log(response.teams[team_index].name + '\'s logo was loaded via Wikimedia');
    $.ajax({
        url: 'https://de.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'query',
            format: 'json',
            generator: 'search',
            gsrsearch: response.teams[team_index].name,
            gsrlimit: 1,
            prop: 'pageimages',
            piprop: 'thumbnail',
            pilimit: 'max',
            pithumbsize: 400
        },
        success: function (json) {
            var pages = json.query.pages;
            $.map(pages, function (page) {
                div.append(
                    '<a class="thumbnail" href="' + page.thumbnail.source + '">' +
                    '<figure>' +
                    '<img src="' + page.thumbnail.source + '"/>' +
                    '<figcaption>' + response.teams[team_index].name + '</figcaption>' +
                    '</figure>' +
                    '</a>'
                );
            });
        }
    });
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