$(document).ready(function () {
    var input = $('.form-control');
    var button = $('#search');
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
                var pages = json.query.pages;
                $.map(pages, function (page) {
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

    input.autocomplete({
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

    input.on('keypress', function (event) {
        if (event.which === 13) {
            button.trigger('click');
        }
    });

    button.click(function () {
        searchWikimediaImage(input.val());
        input.val('');
    });
});