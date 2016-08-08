$(document).ready(function () {
    var image_grid = $('.image_grid');
    var input = $('.form-control');
    var button = $('#search');
    var toSearch = '';
    var searchUrl = 'https://de.wikipedia.org/w/api.php';

    function searchWiki() {
        $.ajax({
            url: searchUrl,
            dataType: 'jsonp',
            data: {
                action: 'query',
                format: 'json',
                generator: 'search',
                gsrsearch: toSearch,
                gsrlimit: 1,
                prop: 'pageimages',
                piprop: 'thumbnail',
                pilimit: 'max',
                pithumbsize: 400
            },
            success: function (json) {
                var pages = json.query.pages;
                $.map(pages, function (page) {
                    image_grid.append(
                        '<a class="thumbnail" href="' + page.thumbnail.source + '">' +
                        '<figure>' +
                        '<img src="' + page.thumbnail.source + '"/>' +
                        '<figcaption>' + page.title + '</figcaption>' +
                        '</figure>' +
                        '</a>'
                    );
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
        image_grid.empty();
        toSearch = input.val();
        input.val('');
        searchWiki();
    });
});