---
title: Javascript localstorage Test
date: 2016-08-03 22:23:00 +02:00
tags:
- Javascript
- localstorage
layout: post
js:
- "/js/framework/jquery-3.1.0.min.js"
- "/js/local-storage-test.js"
---

## localstorage

Mit **localStorage** können Sie Daten im Cache des Browsers speichern. Die Daten werden beim Verlassen der Seite nicht gelöscht und bleiben verfügbar. 

Tippen Sie Text in das Feld ein und bestätigen anschließend, indem Sie den Knopf _Speichern_ drücken. Danach wird der Text dem Dokument hinzugefügt. Auch nachdem Sie die Seite verlassen haben bleiben die eingegebenen Werte gespeichert.

<div class="input-group">
    <input type="text" class="form-control">
    <span class="input-group-btn">
        <button class="btn btn-primary" id="save" type="button">Speichern</button>
    </span>
</div>

<ul class="list-group" id="text"></ul>