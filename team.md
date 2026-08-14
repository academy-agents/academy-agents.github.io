---
layout: page
permalink: /team/
title: Team
lead: >-
  Academy is developed by researchers and engineers working on federated
  research infrastructure.
wide: true
---

{%- comment -%}
  Cards degrade cleanly as detail arrives: a name alone renders with an initial
  in a circle; role, affiliation and photo each appear once filled in. There is
  no placeholder state to remove — the page is publishable now and improves as
  _data/team.yml is completed. See that file for the photo spec.
{%- endcomment -%}

<div class="team-grid">
  {%- for person in site.data.team %}
  <div class="person">
    {%- if person.avatar %}
    <img class="person__avatar" src="{{ person.avatar | relative_url }}" alt="" width="72" height="72" loading="lazy" decoding="async">
    {%- else %}
    <div class="person__avatar person__avatar--initial" aria-hidden="true">{{ person.name | slice: 0 }}</div>
    {%- endif %}

    <div class="person__name">
      {%- if person.url %}<a href="{{ person.url }}" rel="noopener">{{ person.name }}</a>
      {%- else %}{{ person.name }}{% endif -%}
    </div>

    {%- if person.role and person.role != '' %}
    <div class="person__role">{{ person.role }}</div>
    {%- endif %}

    {%- if person.affiliation and person.affiliation != '' %}
    <div class="person__affiliation">{{ person.affiliation }}</div>
    {%- endif %}

    {%- if person.github %}
    <a class="person__github" href="https://github.com/{{ person.github }}" rel="noopener">
      <span class="visually-hidden">{{ person.name }} on </span>GitHub
    </a>
    {%- endif %}
  </div>
  {%- endfor %}
</div>

<div class="content-block">
  <h2 class="year-heading">Contributing</h2>
  <p class="measured">
    Academy is developed in the open under the {{ site.project.license }}
    license. The full contributor list is on
    <a href="{{ site.links.github_repo }}/graphs/contributors" rel="noopener">GitHub</a>,
    and the <a href="{{ site.links.contributing }}" rel="noopener">contributing guide</a>
    covers the fork, branch, and pre-commit workflow. Questions are welcome in
    <a href="{{ site.links.slack }}" rel="noopener">Slack</a>.
  </p>
</div>
