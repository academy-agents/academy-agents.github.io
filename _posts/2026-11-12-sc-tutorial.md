---
title: "Academy Tutorial: SC 2026"
date: 2026-11-12
# Date the event actually happens, shown on /blog/ instead of the post date.
event_date: 2026-11-15
kind: Tutorial
icon: "🎓"
author: Alok Kamatar, Greg Pauloski, Ian Foster and Kyle Chard
location: "1:30 pm – 5:00 pm, November 15, Chicago, Illinois"
# Pins this post to the featured slot on /blog/. Move the flag to whichever post
# should lead; with no post flagged, the most recent one with a body is used.
featured: true
summary: >-
  The Academy tutorial at SC 2026 in Chicago. The tutorial repository branch
  is linked from the page.
---

## Introduction

Agentic systems, in which autonomous agents collaborate to solve complex
problems, are emerging as a transformative methodology in AI. However, adapting
agentic architectures to scientific cyberinfrastructure — spanning HPC systems,
experimental facilities, and federated data repositories — introduces new
technical challenges. Join us at [SC 2026](https://sc26.supercomputing.org) for a half-day
tutorial, where we will introduce participants to the design, deployment, and
management of scalable agentic systems for scientific discovery. We will present
Academy, a Python-based middleware platform built to support agentic workflows
across heterogeneous research environments. Participants will learn core agentic
system concepts, including asynchronous execution models, stateful agent
orchestration, and dynamic resource management. A guided hands-on session will
help attendees build and launch their own agentic workflows. We will integrate Academy with Claude Code to build a materials assistant that can leverage remote resources.
We will then explore building different multi-agent patterns with the Academy framework.
This tutorial is
designed for researchers, developers, and cyberinfrastructure professionals
interested in advancing AI-driven science with next-generation autonomous
systems. To attend the tutorial, you need to
[register](https://sc26.supercomputing.org) to attend SC.

## Tutorial materials

### Code

The code for the tutorial is available in the
[GitHub repository]({{ site.links.tutorial_repo }}). Clone the repository and
check out the `sc26` branch for the environment specific to this tutorial.

## Participant requirements

Participants need intermediate knowledge of coding in Python, and a laptop where
they can write and run Python code. A test Linux environment for remote
computing and access to an inference service will be provided to attendees of
the tutorial. (If completing the tutorial independently, instructions for
setting up the test environment will be provided, and a different inference
service can be used.)

## Schedule (tentative)

<div class="table-wrap">
<table class="schedule-table">
  <thead>
    <tr>
      <th>Time</th>
      <th>Topic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1:30 &ndash; 2:00</td>
      <td>Introduction</td>
    </tr>
    <tr>
      <td>2:00 &ndash; 2:15</td>
      <td>Academy Overview</td>
    </tr>
    <tr class="hands-on">
      <td>2:15 &ndash; 3:00</td>
      <td>Hands-on: Getting Started</td>
    </tr>
    <tr class="break">
      <td>3:00 &ndash; 3:30</td>
      <td>Break</td>
    </tr>
    <tr>
      <td>3:30 &ndash; 3:45</td>
      <td>Patterns in Agentic Applications</td>
    </tr>
    <tr class="hands-on">
      <td>3:45 &ndash; 4:30</td>
      <td>Hands-on: Multi-Agent Patterns</td>
    </tr>
    <tr class="hands-on">
      <td>4:30 &ndash; 4:45</td>
      <td>Hands-on: Dashboard</td>
    </tr>
    <tr>
      <td>4:45 &ndash; 5:00</td>
      <td>Wrap Up</td>
    </tr>
  </tbody>
</table>
</div>
