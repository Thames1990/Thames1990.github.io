var counter = localStorage.getItem('counter');
var input = $('.form-control');
var text = $('#text');
var save_button = $('#save');

$(document).ready(function () {
    if (counter == null) {
        counter = 0;
        localStorage.setItem('counter', counter);
    }

    refreshContent();

    input.on('keypress', function (event) {
        if (event.which === 13) {
            save_button.trigger('click');
        }
    });

    save_button.click(function () {
        var form_control_value = input.val();
        if (form_control_value != "") {
            addItem(form_control_value);
        }
    });
});

/**
 * Refreshes the list
 */
function refreshContent() {
    text.empty();
    input.val('');

    $.each(localStorage, function (key, value) {
        if (key != 'counter' && value != null) {
            text.append(
                '<li class="list-group-item" id="li_' + key + '">' +
                value +
                '<button type="button" class="close" id="remove_' + key + '" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span>' +
                '</button>' +
                '</li>'
            );

            $('#remove_' + key).click(function () {
                removeItem(key);
            });
        }
    });
}

/**
 * Adds an item to the list
 * @param item Item to be added
 */
function addItem(item) {
    localStorage.setItem('counter', counter++);
    localStorage.setItem(counter, item);
    refreshContent();
}


/**
 * Removes an item from the list
 * @param item Item to be removed
 * TODO Fix weird remove last item issue
 */
function removeItem(item) {
    localStorage.setItem('counter', counter--);
    localStorage.removeItem(item);
    refreshContent();
}