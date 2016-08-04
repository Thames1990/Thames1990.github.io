function showImage(name) {
    $.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var https = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = https + '//cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    $.get(
        'https://de.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=' + name + '&callback=?',

        function (response) {
            var m;
            var urls = [];
            var regex = /<img.*?src=\\"(.*?)\\"/gmi;

            while (m = regex.exec(response)) {
                urls.push(m[1]);
            }

            $('.image_grid').append('<h2>' + name + '</h2>');
            urls.forEach(function (url) {
                $(".image_grid").append(
                    '<a href="' + window.location.protocol + url + '">' +
                    '<figure>' +
                    '<img src="' + window.location.protocol + url + '"/>' +
                    '<figcaption>' + name + '</figcaption>' +
                    '</figure>' +
                    '</a>'
                );
            });
        });
}

$(document).ready(function () {
    $(".form-control").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://en.wikipedia.org/w/api.php",
                dataType: "jsonp",
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

    $(':button').click(function () {
        var form_control_value = $('.form-control').val();
        $('.form-control').val('');
        if (form_control_value != null && form_control_value != "") {
            showImage(form_control_value);
        }
    });
});