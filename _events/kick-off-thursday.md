---
# See https://schema.org/Event
name: Kick Off Thursday
image: 'https://imgur.com/ssQ7EVV'
description: Food and drink specials at the Kernville Saloon
tags:
- saloon
- kernville
- football
startDate: 2018-09-13 17:00
endDate: 2018-09-13 21:00
location:
  name: Kernville Saloon
  streetAddress: 20 Tobias Street
  addressLocality: Kernville
  addressRegion: CA
  postalCode: 93238
  url: 'https://goo.gl/maps/VaKJjy2Bmt32'
organizer:
  '@type': 'Organization'
  name: Kernville Saloon
  url: 'https://www.facebook.com/Kernville-Saloon-185002471557497/'
---
## Ravens vs. Bengals
<time class="event-begin" itemprop="startDate" datetime="{{ include.event.startDate | date_to_xmlschema }}">
  {% include icon.html icon='events' %}
  {{ page.startDate | date: '%a %b %-d, %Y %l:%M %p' }}
</time>
<br />
<div class="event-location" itemprop="location" itemtype="http://schema.org/Place" itemscope="">
  {% include address.html address=page.location itemprop='address' %}
</div>
<hr />
> {{ page.description }}

**$10 pitchers and football on TV**

### Main course: Italian Beef Subs (made by Ashley)

<h5>
  <span>Organized by</span>
  <span itemprop="name">
    {% if page.organizer.url %}
      <a href="{{ page.organizer.url  }}" class="event-organizer-url underline" target="_blank" rel="noopener external">
        {{ page.organizer.name }}
      </a>
    {% else %}
      {{ page.organizer.name }}
    {% endif %}
  </span>
</h5>
