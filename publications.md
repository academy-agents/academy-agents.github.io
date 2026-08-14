---
layout: page
permalink: /publications/
title: Publications
lead: >-
  Papers describing Academy's design and its application to scientific
  workflows.
wide: true
---

{%- assign years = site.data.publications | map: 'year' | uniq | sort | reverse %}
{%- for year in years %}
<h2 class="year-heading">{{ year }}</h2>
<ul class="pub-list">
  {%- assign pubs = site.data.publications | where: 'year', year %}
  {%- for pub in pubs %}
  <li class="pub{% if pub.placeholder %} is-placeholder{% endif %}">
    <div class="pub__title">{{ pub.title }}</div>
    {%- if pub.authors and pub.authors != '' %}
    <div class="pub__authors">{{ pub.authors }}</div>
    {%- endif %}
    {%- if pub.venue and pub.venue != '' %}
    <div class="pub__venue">{{ pub.venue }}</div>
    {%- endif %}
    {%- if pub.placeholder %}
    <div class="pub__venue">Placeholder entry — replace in <code>_data/publications.yml</code>.</div>
    {%- endif %}
    {%- if pub.links %}
    <div class="pub__links">
      {%- for link in pub.links %}
      <a href="{{ link.url }}" rel="noopener">{{ link.title }}</a>
      {%- endfor %}
    </div>
    {%- endif %}
  </li>
  {%- endfor %}
</ul>
{%- endfor %}

<div class="content-block">
  <h2 class="year-heading">How to cite Academy</h2>

  {%- assign primary = site.data.publications | where: 'cite', true | first %}
  {%- if primary.bibtex and primary.bibtex != '' %}
  <div class="code-block">
    {%- comment -%}
      No copy button here: site.js injects one into every .code-block that has a
      header, so a hand-written one would duplicate it — and would sit there
      looking interactive when JS or the Clipboard API is unavailable.
    {%- endcomment -%}
    <div class="code-block__header">
      <span>BibTeX for the Academy paper</span>
    </div>
    <pre><code>{{ primary.bibtex }}</code></pre>
  </div>
  {%- else %}
  <div class="placeholder-note">
    <span>
      <strong>BibTeX pending.</strong>
      Paste the canonical entry into the <code>bibtex</code> field of the first
      publication in <code>_data/publications.yml</code> and it will render here
      with a copy button.
    </span>
  </div>
  {%- endif %}

  <p style="color: var(--text-muted);">
    A preprint is also available on
    <a href="{{ site.links.paper }}" rel="noopener">arXiv</a>.
  </p>
</div>
