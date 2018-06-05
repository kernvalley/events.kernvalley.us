---
# See https://schema.org/Event
name: "31st Annual Kid's Fishing Derby"
image: 'https://imgur.com/HTI8sJd'
# url:
description: Free to kids 4 To 15 years. trophies, prizes, free kids lunch & free drawing
startDate: 2018-06-05 06:00
endDate: 2018-06-05 15:00
location:
  name: Freear Park
  addressLocality: Wofford Heights
  addressRegion: CA
  postalCode: 93285
  url: 'https://goo.gl/maps/3o3ZVqjq1rv'
organizer:
  '@type': 'Organization'
  name: Fish and Game Habitat Club
#  url:
---
# {{ page.name }}

{% include imgur.html url=page.image %}

{{ page.description }}
