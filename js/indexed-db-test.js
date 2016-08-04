// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// Open (or create) the database
var open = indexedDB.open("MyDatabase", 1);

// Create the schema
open.onupgradeneeded = function () {
    var db = open.result;
    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
    var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
};

open.onsuccess = function () {
    // Start a new transaction
    var db = open.result;
    var tx = db.transaction("MyObjectStore", "readwrite");
    var store = tx.objectStore("MyObjectStore");
    var index = store.index("NameIndex");

    // Add some data
    store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
    store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});

    // Query the data
    var getJohn = store.get(12345);
    var getBob = index.get(["Smith", "Bob"]);

    getJohn.onsuccess = function () {
        var tr = '';
        tr += '<tr>';
        $.each(getJohn.result, function (key, value) {
            if (typeof value == 'object') {
                $.each(value, function (object_key, object_value) {
                    tr += '<td>' + object_value + '</td>';
                });
            } else {
                tr += '<td>' + value + '</td>';
            }
        });
        tr += '</tr>';
        $('.indexed_db_table').find('tbody').append(tr);
    };

    getBob.onsuccess = function () {
        var tr = '';
        tr += '<tr>';
        $.each(getBob.result, function (key, value) {
            if (typeof value == 'object') {
                $.each(value, function (object_key, object_value) {
                    tr += '<td>' + object_value + '</td>';
                });
            } else {
                tr += '<td>' + value + '</td>';
            }
        });
        tr += '</tr>';
        $('.indexed_db_table').find('tbody').append(tr);
    };

    // Close the db when the transaction is done
    tx.oncomplete = function () {
        db.close();
    };
};