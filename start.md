---
layout: page
permalink: /start/
title: Get started
lead: >-
  From installing Academy to running agents across distributed resources, in
  five steps.
wide: true
---

{%- comment -%}
  Snippets are taken from the academy-agents/academy README and
  docs.academy-agents.org/latest/get-started — then compiled. Run
  `python3 bin/check-code-samples.py` after touching any of them.

  This page was previously /examples/. It is a quickstart, not a gallery, and
  the old label sent readers looking for applications.
{%- endcomment -%}

<div class="requirements">
  <h2 class="step-heading">Requirements</h2>
  <dl class="dl-list">
    <div class="dl-list__row">
      <dt>Python</dt>
      <dd>{{ site.project.python }}</dd>
    </div>
    <div class="dl-list__row">
      <dt>License</dt>
      <dd><a href="{{ site.links.license }}" rel="noopener">{{ site.project.license }}</a></dd>
    </div>
    <div class="dl-list__row">
      <dt>Current version</dt>
      <dd>
        {{ site.project.version }} —
        <a href="{{ site.links.releases }}" rel="noopener">release history</a>.
        Academy is pre-1.0, so minor releases may contain breaking changes.
      </dd>
    </div>
  </dl>
</div>

<div class="content-block">
  <h2 class="step-heading"><span class="step-heading__num">1</span> Install</h2>
  <p class="measured">Academy is published on PyPI as <code>academy-py</code>.</p>

  <div class="code-block code-block--narrow">
    <div class="code-block__header">
      <span>Install command</span>
    </div>
    <pre><code>{{ site.install_command }}</code></pre>
  </div>
</div>

<div class="content-block">
  <h2 class="step-heading"><span class="step-heading__num">2</span> Write a first program</h2>
  <p class="measured">
    An agent is a class with <code>@action</code>-decorated methods. A manager
    launches it against an exchange and returns a handle you call actions on.
    The whole example runs in one process and needs no external services.
  </p>

  <div class="code-block">
    <div class="code-block__header">
      <span>A first Academy program</span>
    </div>
{% highlight python %}
import asyncio
from concurrent.futures import ThreadPoolExecutor

from academy.agent import Agent, action
from academy.exchange import LocalExchangeFactory
from academy.logging.recommended import recommended_logging
from academy.manager import Manager


class ExampleAgent(Agent):
    @action
    async def square(self, value: float) -> float:
        return value * value


async def main() -> None:
    async with await Manager.from_exchange_factory(
        factory=LocalExchangeFactory(),
        executors=ThreadPoolExecutor(),
        log_config=recommended_logging(),
    ) as manager:
        agent_handle = await manager.launch(ExampleAgent())
        result = await agent_handle.square(2)
        assert result == 4
        await agent_handle.shutdown()


if __name__ == '__main__':
    asyncio.run(main())
{% endhighlight %}
  </div>
</div>

<div class="content-block">
  <h2 class="step-heading"><span class="step-heading__num">3</span> Add a control loop</h2>
  <p class="measured">
    <code>@loop</code>-decorated methods run continuously alongside the agent's
    actions until shutdown is signaled. An agent with a loop keeps working when
    nothing is calling it.
  </p>
  <p class="measured note">
    Shown on its own for clarity — combine the <code>@action</code> and
    <code>@loop</code> methods in a single class rather than redefining it.
  </p>

  <div class="code-block">
    <div class="code-block__header">
      <span>A control loop</span>
    </div>
{% highlight python %}
import asyncio

from academy.agent import Agent, action, loop


class CountingAgent(Agent):
    def __init__(self) -> None:
        super().__init__()
        self.count = 0

    @action
    async def get_count(self) -> int:
        return self.count

    @loop
    async def counter(self, shutdown: asyncio.Event) -> None:
        while not shutdown.is_set():
            self.count += 1
            await asyncio.sleep(1)
{% endhighlight %}
  </div>
</div>

<div class="content-block">
  <h2 class="step-heading"><span class="step-heading__num">4</span> Let agents call each other</h2>
  <p class="measured">
    Handles to other agents are passed in as constructor arguments, so a
    coordinator can delegate work without knowing where those agents run.
  </p>
  <p class="measured note">
    <code>from __future__ import annotations</code> matters here: without it the
    <code>Handle[Lowerer]</code> annotation is evaluated at class-definition
    time, before <code>Lowerer</code> exists, on Python 3.10–3.13.
  </p>

  <div class="code-block">
    <div class="code-block__header">
      <span>Agent-to-agent calls</span>
    </div>
{% highlight python %}
from __future__ import annotations

from academy.agent import Agent, action
from academy.handle import Handle


class Lowerer(Agent):
    @action
    async def lower(self, text: str) -> str:
        return text.lower()


class Reverser(Agent):
    @action
    async def reverse(self, text: str) -> str:
        return text[::-1]


class Coordinator(Agent):
    def __init__(
        self,
        lowerer: Handle[Lowerer],
        reverser: Handle[Reverser],
    ) -> None:
        super().__init__()
        self.lowerer = lowerer
        self.reverser = reverser

    @action
    async def process(self, text: str) -> str:
        text = await self.lowerer.lower(text)
        text = await self.reverser.reverse(text)
        return text
{% endhighlight %}
  </div>

  <p class="measured">
    Launch them together, passing the dependencies through <code>args</code>.
    This block continues the same file as the one above — it relies on the
    three classes defined there.
  </p>
  <p class="measured note">
    Note the two launch styles: step 2 passed an <em>instance</em>
    (<code>ExampleAgent()</code>) while this passes the <em>class</em> and lets
    the manager construct it with <code>args</code>. Both are supported; pass the
    class when the agent needs constructor arguments.
  </p>

  <div class="code-block">
    <div class="code-block__header">
      <span>Launching a multi-agent system</span>
    </div>
{% highlight python %}
import asyncio
from concurrent.futures import ThreadPoolExecutor

from academy.exchange import LocalExchangeFactory
from academy.manager import Manager


async def main() -> None:
    async with await Manager.from_exchange_factory(
        factory=LocalExchangeFactory(),
        executors=ThreadPoolExecutor(),
    ) as manager:
        lowerer = await manager.launch(Lowerer)
        reverser = await manager.launch(Reverser)
        coordinator = await manager.launch(
            Coordinator,
            args=(lowerer, reverser),
        )

        result = await coordinator.process('DEADBEEF')
        assert result == 'feebdaed'


if __name__ == '__main__':
    asyncio.run(main())
{% endhighlight %}
  </div>
</div>

<div class="content-block">
  <h2 class="step-heading"><span class="step-heading__num">5</span> Distribute it</h2>
  <p class="measured">
    The agent code above does not change. Swap the exchange for one that crosses
    process and node boundaries, and the executor for one that places agents
    where the compute is.
  </p>

  <div class="code-block">
    <div class="code-block__header">
      <span>Distributing across nodes</span>
    </div>
{% highlight python %}
from concurrent.futures import ProcessPoolExecutor

from academy.exchange import RedisExchangeFactory
from academy.manager import Manager


async def main() -> None:
    async with await Manager.from_exchange_factory(
        factory=RedisExchangeFactory('<REDIS HOST>', port=6379),
        executors=ProcessPoolExecutor(max_workers=4),
    ) as manager:
        ...
{% endhighlight %}
  </div>
</div>

<div class="content-block" id="exchanges">
  <h2 class="step-heading">What each exchange needs from you</h2>
  <p class="measured">
    Swapping the exchange is a one-line change in code, but the exchanges differ
    in what infrastructure you have to provide. Names below are the actual
    factory classes exported from <code>academy.exchange</code>.
  </p>

  <div class="table-wrap" tabindex="0" role="region" aria-labelledby="exchange-caption">
    <table>
      <caption id="exchange-caption" class="visually-hidden">
        Academy exchange implementations and their prerequisites
      </caption>
      <thead>
        <tr>
          <th scope="col">Exchange</th>
          <th scope="col">What you provide</th>
          <th scope="col">Use it when</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>LocalExchangeFactory</code></td>
          <td>Nothing</td>
          <td>Development, tests, a single process</td>
        </tr>
        <tr>
          <td><code>RedisExchangeFactory</code></td>
          <td>A Redis server you run, reachable from every node</td>
          <td>Agents spread across processes or nodes</td>
        </tr>
        <tr>
          <td><code>HybridExchangeFactory</code></td>
          <td>
            A Redis server, <em>and</em> direct TCP between peers. Redis holds
            mailbox state and queues for offline agents; live traffic goes
            peer-to-peer.
          </td>
          <td>Lower-latency messaging between agents that can reach each other</td>
        </tr>
        <tr>
          <td><code>HttpExchangeFactory</code></td>
          <td>An HTTP exchange server</td>
          <td>Agents that can reach a shared endpoint but not each other</td>
        </tr>
        <tr>
          <td><code>GlobusExchangeFactory</code></td>
          <td>A Globus account and an authentication flow</td>
          <td>Crossing institutional and identity boundaries</td>
        </tr>
        <tr>
          <td><code>ProxyStoreExchangeFactory</code></td>
          <td>
            A base exchange factory <em>and</em> a ProxyStore
            <code>Store</code>; install with
            <code>pip install academy-py[proxystore]</code>
          </td>
          <td>Wrapping any of the above to pass large objects by reference</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p class="measured note">
    Prerequisites here were read from the factory signatures and docstrings in
    Academy 0.5.0. The
    <a href="{{ site.links.docs }}" rel="noopener">exchange documentation</a> is
    the authority if the two ever disagree.
  </p>
</div>

<div class="content-block">
  <h2 class="step-heading">Where to go next</h2>
  <div class="card-grid">
    <article class="card card--link">
      <h3><a class="stretched" href="{{ site.links.docs }}" rel="noopener">Documentation</a></h3>
      <p>
        Full API reference, every exchange implementation, and the logging
        configuration options.
      </p>
      <span class="card__more" aria-hidden="true">Read the docs &rarr;</span>
    </article>

    <article class="card card--link">
      <h3><a class="stretched" href="{{ site.links.tutorial_repo }}" rel="noopener">Tutorial repository</a></h3>
      <p>
        Hands-on material from the IPDPS and ISC tutorials, with
        conference-specific branches.
      </p>
      <span class="card__more" aria-hidden="true">Open on GitHub &rarr;</span>
    </article>

    <article class="card card--link">
      <h3><a class="stretched" href="{{ '/blog/2026-05-logging.html' | relative_url }}">Observability walkthrough</a></h3>
      <p>
        Tracing a single agent interaction end to end across processes using
        JSON logs and <code>jq</code>.
      </p>
      <span class="card__more" aria-hidden="true">Read the post &rarr;</span>
    </article>

    <article class="card card--link">
      <h3><a class="stretched" href="{{ site.links.slack }}" rel="noopener">Get help</a></h3>
      <p>
        Questions in Slack, bugs and feature requests in the
        <a href="{{ site.links.issues }}" rel="noopener">issue tracker</a>, and
        common problems in the <a href="{{ site.links.faq }}" rel="noopener">FAQ</a>.
      </p>
      <span class="card__more" aria-hidden="true">Join Slack &rarr;</span>
    </article>

    <article class="card card--link">
      <h3><a class="stretched" href="{{ '/publications/' | relative_url }}">Cite Academy</a></h3>
      <p>
        If Academy supports your work, the BibTeX entry and the papers behind it
        are on the publications page.
      </p>
      <span class="card__more" aria-hidden="true">Publications &rarr;</span>
    </article>
  </div>
</div>
