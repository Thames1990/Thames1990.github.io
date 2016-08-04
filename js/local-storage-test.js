var refreshContent = function () {
    $('.text').empty();
    $('.form-control').val('');
    $.each(localStorage, function (key, value) {
        if (key != 'counter' && localStorage.getItem(key) != null) {
            $('.text').append('<li>' + localStorage.getItem(key) + '</li>');
        }
    });
};

$(document).ready(function () {
    refreshContent();
    var counter = localStorage.getItem('counter');
    if (counter == null) {
        counter = 1;
    }

    $(':button').click(function () {
        var form_control_value = $('.form-control').val();
        if (form_control_value != null && form_control_value != "") {
            counter++;
            localStorage.setItem('counter', counter);
            localStorage.setItem(counter, form_control_value);
            refreshContent();
        }
    });
});