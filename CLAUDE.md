# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Tabletop Exercise Generator** web application designed specifically for nonprofits and mission-driven organizations. The application creates discussion-based cybersecurity and crisis response training scenarios to help organizations prepare for various threats and test their incident response capabilities.

## Architecture

**Frontend-only application**: Single HTML file (`index.html`) with embedded CSS and JavaScript - no backend or build system required.

**Key Components:**
- **Form interface**: Multi-step form for capturing organization profile, threat themes, and exercise objectives
- **Style system**: MTM (Meet the Moment) brand implementation using CSS custom properties
- **Content generation**: Placeholder system ready for LLM integration to generate full tabletop scenarios
- **Progressive enhancement**: Form validation, dynamic interactions, and loading states

## Style Guide Implementation

The application implements the MTM Style Guide (`mtm-style-guide.md`) with strict brand requirements:

**Brand Colors** (CSS custom properties in `:root`):
- Primary: `#1ab1d2` (light blue)
- Accent: `#f18f38` (orange) 
- Navy: `#1c487b` (dark blue)
- Backgrounds: `#fef4e3` (cream), `#fafdfe` (white)

**Typography**: Roboto font stack with specific sizing (H1: 40px, H2: 32px, H3: 24px)

**Required Elements**:
- Header logo at 60px height
- Footer with logo at 40px height and "Prototype by Meet the Moment" text
- Card-based layout with specific shadow and border radius values

## Domain Knowledge

**Exercise Types** (based on `/Samples/` content):
- **Single-incident scenarios**: Focused cybersecurity threats (phishing, ransomware, data breaches)
- **Multi-phase crisis simulations**: Complex scenarios with progressive injects and stakeholder involvement
- **Discussion-based format**: Not hands-on technical exercises, but strategic response planning

**Target Scenarios**:
- Funding crises and grant freezes
- Government investigations and subpoenas  
- Cybersecurity breaches (ransomware, data leaks)
- Reputational damage and disinformation
- Digital/physical safety threats
- Third-party vendor compromises
- Insider threats

**Exercise Structure**:
- **Scenario setup**: Organization context, named personas, initial situation
- **Progressive injects**: Complications introduced over time phases
- **Discussion questions**: Grouped by response phase (immediate, tactical, strategic)
- **Learning objectives**: Communication protocols, decision authority, legal coordination

## Development Notes

**No build process**: Application runs directly by opening `index.html` in a browser

**Form handling**: Currently generates placeholder content; LLM integration point is in the form submission handler (line 253-284)

**Validation**: 3-objective limit enforced via JavaScript, custom theme input disables dropdown selection

**Responsive design**: Uses Tailwind CSS classes with custom MTM styling overrides

## Content Generation Requirements

When implementing LLM integration, generated exercises should follow patterns from sample files:

**Required elements**:
- Named organizational personas with defined roles
- Phased timeline progression (immediate response → tactical decisions → strategic recovery)
- Specific inject scenarios that complicate the initial situation
- Discussion questions grouped by response phase
- Realistic constraints based on nonprofit/educational context
- After-action review framework for organizational improvement

**Output format**: HTML content that fits the existing card-based styling system