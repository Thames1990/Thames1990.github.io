---
title: Datenbank Test
date: 2016-07-28 00:00:00 +02:00
tags:
- Datenbank
- football-data
- sport-open-data
layout: post
js:
- "/js/framework/jquery-3.1.0.min.js"
- "/js/framework/sorttable.js"
- "/js/database-test.js"
---

## Sport Open Data

### Verfügbare Ligen:

<div class="table-responsive" markdown="block">
{:.sports_open_data_competitions .table .sortable}
| ID | Abkürzung | Name | Nation | Ligaklasse | Verband | Pokal |

</div>

### Premier League:

#### Mannschaften

<div class="table-responsive" markdown="block">
{:.sports_open_data_premier_league_teams .table .sortable}
| Flag | ID | Name | Notizen | Abkürzung |

</div>

#### Tabelle

<div class="table-responsive" markdown="block">
{:.sports_open_data_premier_league_standings .table .sortable}
| Position | Verein | Spiele | Gewonnen | Unentschieden | Verloren | Tore | Differenz | Punkte

</div>


## Football-Data

### Verfügbare Ligen:

<div class="table-responsive" markdown="block">
{:.football_data .table .sortable}
| ID | Name | Abkürzung | Jahr | Aktueller Spieltag | Spieltage | Mannschaften | Spiele | Zuletzt aktualisiert |

</div>