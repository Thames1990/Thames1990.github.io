$(document).ready(function () {
    var searchInput = $('.form-control');
    var searchButton = $('#search');
    var searchUrl = 'https://de.wikipedia.org/w/api.php';

    /**
     * Searches for the primary image of a Wikipedia article via the Wikipedia API
     * @param query The search String
     */
    function searchWikimediaImage(query) {
        $.ajax({
            url: searchUrl,
            dataType: 'jsonp',
            data: {
                action: 'query',
                format: 'json',
                generator: 'search',
                gsrsearch: query,
                gsrlimit: 1,
                prop: 'pageimages',
                piprop: 'thumbnail',
                pilimit: 'max',
                pithumbsize: 400
            },
            success: function (json) {
                $.each(json.query.pages, function (page_key, page) {
                    if (typeof  page.thumbnail != 'undefined') {
                        $('.image_grid').append(
                            '<a class="thumbnail" href="' + page.thumbnail.source + '">' +
                            '<figure>' +
                            '<img src="' + page.thumbnail.source + '"/>' +
                            '<figcaption>' + page.title + '</figcaption>' +
                            '</figure>' +
                            '</a>'
                        );
                    } else {
                        // TODO Show modal
                    }
                });
            }
        });
    }

    // Activates autocomplete for search input
    searchInput.autocomplete({
        source: function (request, response) {
            $.ajax({
                url: searchUrl,
                dataType: 'jsonp',
                data: {
                    'action': "opensearch",
                    'format': "json",
                    'search': request.term
                },
                success: function (data) {
                    response(data[1]);
                }
            });
        }
    });

    // Triggers the 'click' event of the search button, if the enter key is pressed in the search input
    searchInput.on('keypress', function (event) {
        if (event.which === 13) {
            searchButton.trigger('click');
        }
    });

    // Starts a new Wikimedia search
    searchButton.click(function () {
        searchWikimediaImage(searchInput.val());
        searchInput.val('');
    });
});