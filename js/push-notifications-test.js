$(document).ready(function () {
    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
    });

    function notifyMe() {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification('Titel', {
                icon: '/img/avatar-icon.png',
                body: "Nachricht"
            });

            notification.onclick = function () {
                alert('Benachrichtigung geklickt')
            };
        }
    }

    $('body > div > div > div > article').append(
        '<div class="btn-group btn-group-justified">' +
        '<div class="btn-group" role="group">' +
        '<button type="button" class="btn btn-info">Klick mich!</button>' +
        '</div>' +
        '</div>'
    ).click(notifyMe);
});