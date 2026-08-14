# Spec v3: "Where agents live" figure

Revision of a figure that already exists on the site. **Read §1 before anything
else — the core abstraction has changed and the current implementation is wrong
in a way that cannot be patched.**

Repo: `/Users/gusellerm/Projects/websites/academy-website`
Current implementation: `index.html` `#architecture`, CSS section "9b", the
"Vision figure" block in `assets/js/site.js`.

---

## 0. What changed in v3 — read this first

v2 got the abstraction right. Three things about its *behaviour and framing* are
wrong, and two of them are my fault, not the previous implementer's.

1. **The instrument bubbles must be dynamic and visibly connected.** v2 rendered
   them as a static vertical column labelled "INSTRUMENT KINDS", which reads as a
   list beside the figure. They should orbit/drift around the instrument entity
   with **visible connectors forming and fading**, showing that the instrument
   slot can take any number of capabilities. Movement and connection are the
   content, not decoration.

2. **The two animations run SIMULTANEOUSLY and CONTINUOUSLY.** v1's spec told you
   to sequence them and run one pass then rest. That was wrong: it reads as the
   figure getting stuck. The bubble drift and the message loop now run at the
   same time, and the message loop **loops continuously** rather than stopping
   after one pass. Keep the pause control — continuous motion makes WCAG 2.2.2
   mandatory rather than optional.

3. **Delete all text to the right of the figure, and the visible figcaption.**
   The legend, the numbered step list and the explanatory note all go. The
   drawing must carry its own meaning alongside the surrounding page.

   Two consequences you must handle, because deleting that text removes things
   that were doing real work:

   - **The sequence has to move into the drawing.** Number the hops on the paths
     themselves — small numbered markers, legible when nothing is moving. The
     reduced-motion state must still convey the order, and it no longer has a
     step list to lean on.
   - **The sourcing moves out of the caption.** The lines "Design intent, not a
     deployment record", "Instrument types are named as categories only; no
     specific integration is claimed", and the paper's title must survive in the
     **text alternative**, and a short clause goes into the section prose above
     the figure in `index.html`. They must not simply disappear — they are the
     site's accuracy guardrail for this figure.

   With the right-hand column gone the figure can be **full width**. Use it: the
   drawing should be larger and the bubble icons properly legible, which they
   were not at 620px.

Everything below still applies unless §0 overrides it.

---

## 1. The abstraction (unchanged — v2 got this right)

v1 drew four differently-shaped boxes for four different places. That was wrong.
It made the *places* the subject, when the point is the opposite: **Academy puts
the same component into every place.**

The correct unit, from the client's own sketch:

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   ← dashed: a resource Academy does NOT own.
│                         │      Someone else's facility, instrument, trust
│   some federated        │      domain, network policy, uptime.
│   scientific compute    │
│                         │
│   ┌─────────────────┐   │   ← solid: the Academy component. IDENTICAL in
│   │                 │   │      every entity. This is the whole argument.
│   │   some agent    │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

Read it as: *dashed = theirs, solid = ours, and ours is the same everywhere.*

### Requirements that follow

- **All four entities are the same size.** Identical outer dimensions, identical
  inner agent box. No entity is special — including the instrument, which v1
  wrongly enlarged and decorated.
- **The Academy component must read as one recurring component**, not four
  bespoke boxes. Same shape, same size, same treatment.
- **The micro-service / LLM distinction lives *inside* the agent box**, as a
  small internal difference, not as a different box. Three agents are
  micro-service-like; one, in the cloud entity, is LLM-driven. The reader should
  see "same component, different fill" — never "different components".
- **The exchange connects the agent boxes, not the containers.** Messages cross
  the dashed boundaries. That is the federation claim, drawn.

---

## 2. Everything is sourced — do not invent beyond it

The site has a hard rule: no claim ships that isn't traceable. Two quotations
from the project's experiences paper justify the whole figure.

**The four placements:**

> "For instance, adjacent to instrumentation for low-latency control, in HPC
> facilities for large-scale computation, beside data stores for throughput, or
> in the cloud for cross-site coordination and synthesis."

**One reasoning agent among several deterministic ones:**

> "agents span a spectrum from fully LLM-driven to fully deterministic. Only two
> were composed solely of LLM agents; six used LLMs for part of the application
> but built separate microservices for tasks that had to run deterministically;
> and three used no LLM at all."

The paper is **Patterns and Experiences from Deploying Agents in Scientific
Applications**. It is **not yet on arXiv** — cite it by title, never link it, and
do **not** put its "eleven / two / six / three" counts on the page. Those
describe in-progress work the site is deliberately holding back.
(v1 got this right. Keep it.)

---

## 3. Content

### Four entities, identical in size and structure

| Entity label | Reason (from the paper) | Agent kind |
|---|---|---|
| `INSTRUMENT` | low-latency control | micro-service |
| `DATA STORE` | throughput | micro-service |
| `HPC FACILITY` | large-scale computation | micro-service |
| `CLOUD` | cross-site coordination | **LLM** |

Kind is carried by **visible text** inside the agent box, not by colour or shape
alone. This site has already had a WCAG 1.4.1 finding for exactly that.

### Instrument bubbles — this is the part to get right

Next to the instrument entity, five **small circular bubbles, each containing a
line icon**, drift in and out of focus:

```
beamline · telescope · sequencer · imaging station · detector array
```

- **Bubbles are circles with an icon inside**, not text chips. Label on
  hover/focus and in the text alternative.
- Hand-author the icons as simple SVG line glyphs on a 24×24 grid, matching the
  existing nav icons (≈2px stroke, round caps, `currentColor`). No icon library —
  a CDN would be blocked by the artifact CSP.
- They **drift in and out of focus** — opacity and slight scale, all five present
  in the DOM at all times.
- **Under `prefers-reduced-motion`, all five sit at equal, full opacity, with
  every connector drawn.** Do not freeze on one: the meaning of the group is
  plurality, and freezing narrows the figure to a claim about one instrument.
- They attach to the instrument entity **without changing its size**. They orbit
  around it; the entity box stays identical to the other three.
- **Each bubble connects to the instrument entity with a visible tether** that
  forms as it drifts into focus and fades as it drifts out. That connection is
  the point — it says the slot takes any of these.

### The message loop

**Continuous**, running simultaneously with the bubble drift. Every hop visibly
routes through the exchange, and each hop carries a small **numbered marker** on
its path so the order reads when nothing is moving:

1. Instrument agent publishes a reading
2. Data store agent adds historical context
3. **Cloud agent reasons over both and picks what to try next**
4. HPC agent runs the simulation
5. Result returns to the cloud agent; the loop closes

The step list beside the figure is **removed** in v3 (§0.3). The numbers now live
on the paths, which is what keeps the reduced-motion state informative.

---

## 4. Stylisation

The client asked for **more** than v1 delivered. v1 was austere to a fault.
Spend the extra craft on:

- The dashed/solid contrast — make "theirs vs ours" unmistakable at a glance
- The agent component — it recurs four times, so it can carry real detail
- The bubbles and their icons
- The exchange — it is the spine; it can be more than a plain bar
- Depth, layering, considered spacing

Restraint still applies where it always has: no emoji, no gradient-heavy hero
treatment, and motion that serves the explanation rather than decorating it. The
test is unchanged — **if a still frame teaches something the paper figure
doesn't, it works; if the motion is the point, it doesn't.**

---

## 5. Technical

Hand-authored inline SVG, animated in CSS. Not Canvas, not Lottie, no library —
the site bundles into a single-file artifact under a CSP that blocks every
external host.

JS is limited to: scroll-triggering the first pass, the play/pause control, and
gating the ambient bubble animation on visibility. Inject the control from JS so
it never sits there inert with scripting off.

---

## 6. Accessibility — non-negotiable

1. **`prefers-reduced-motion`**: all five bubbles at equal opacity, full wire
   network drawn, all five loop steps legible, no dots, and **no play button
   injected**. v1 did this correctly.
2. **Text alternative** naming all four entities, their reasons, which agent
   reasons, all five instrument types, the hop order, **and the sourcing lines
   displaced from the deleted caption** (design intent not a deployment record;
   categories only, no specific integration claimed; the paper's title). More
   informative than the animation, never less.
3. **Pause control** for any motion over five seconds (WCAG 2.2.2).
4. **Kind labels are text.** See §3.
5. **Contrast**: compute ratios, don't eyeball. Body text 4.5:1, UI strokes 3:1,
   in both themes. Note v1 found `--border-strong` on `--accent-subtle` is
   **2.92:1** in light and used `--accent` instead — keep that fix.
6. **Dashed borders still need 3:1.** A dashed stroke reads lighter than a solid
   one of the same colour; check it rather than assuming.

---

## 7. Theming

`assets/css/main.css` has a three-state token system: bare `:root` (light),
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`, and
`:root[data-theme="dark"]`.

**Never declare a colour only inside a media or `[data-theme]` block** — it will
not apply in the un-stamped default state, and the page renders one theme's text
on the other theme's ground. v1's approach was right: define local `--wgd-*`
names that resolve through the global tokens, and style through those.

---

## 8. Build and verify

```sh
export PATH=/opt/homebrew/opt/ruby/bin:$PATH
export GEM_HOME=/private/tmp/claude-501/-Users-gusellerm-Projects-websites-academy-website/1b2ac6cc-c341-47ac-aaf8-40863ff56acf/scratchpad/bundler
export PATH=$GEM_HOME/bin:$PATH
bundle exec jekyll build --quiet      # must be clean
python3 bin/check-code-samples.py     # must stay 9/9
```

Dev server may be running on 4321; if not:
`nohup bundle exec jekyll serve --port 4321 --host 127.0.0.1 >/dev/null 2>&1 &`

**Screenshot advice, learned the hard way in v1 — follow it:**

- **Do not trust `--virtual-time-budget` for anything animated.** It
  desynchronises IntersectionObserver, `setTimeout` and the CSS animation clock,
  and produces frames of states that never occur. Fine for static layout only.
- To check motion states, extract the figure to a standalone page with CSS and
  JS inlined, serve it on its own port, and screenshot that.
- Use `--force-prefers-reduced-motion` for the reduced-motion check.
- Stamp `data-theme` explicitly to check light; don't infer from the tokens.
- Measure overflow by loading the real page into fixed-width same-origin iframes
  and comparing `scrollWidth` to `clientWidth`. Note the browser's minimum
  layout viewport is ~500px — a narrower `--window-size` crops rather than
  reflows and has produced false overflow findings.

Check 500, 700, 900, 1440.

---

## 9. Do not

- Make any entity a different size from the others. This is the point of v2.
- Draw the Academy component as four different shapes.
- Special-case the instrument entity's box.
- Use emoji, or an icon library.
- Name real facilities (Frontier, Aurora, Perlmutter). Naming one turns a vision
  diagram into a deployment claim.
- Put the paper's application counts on the page. See §2.
- Freeze the bubbles on one instrument under reduced motion.
- Sequence the two animations, or stop the loop after one pass. Both were v1
  instructions and both were wrong — see §0.2.
- Let the sourcing lines vanish along with the caption. See §0.3.
- Touch `_posts/` bodies, the `#why` blockquote, or any `{% highlight %}` block.

---

## 10. Deliverable

Revised figure replacing the current one, building clean.

Report: what you built, contrast ratios computed, how the reduced-motion state
differs, and anything here you disagreed with. v1's pushback on this spec was
correct twice — it caught a self-contradiction between the bubble animation and
the accessibility rules, and it caught the paper being misnamed. Do the same.
