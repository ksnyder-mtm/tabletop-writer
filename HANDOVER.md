# Project Handover: Tabletop Exercise Generator

**Last Updated:** January 2026
**Maintained By:** Meet the Moment (MTM)
**Repository:** https://github.com/ksnyder-mtm/tabletop-writer
**Live URL:** https://tabletop-writer.netlify.app

---

## Project Overview

This is a web application that generates discussion-based cybersecurity and crisis response training scenarios (tabletop exercises) for nonprofit organizations. Users provide their organization profile, select threat scenarios, choose participants, and define learning objectives. The application uses Claude AI to generate a complete, facilitator-ready exercise tailored to the organization's size and context.

### Key Features
- **Organization-size-aware scenarios**: Adjusts roles and complexity based on staff count and budget
- **Scenario-specific role assignment**: Critical roles selected based on threat type
- **Manual participant selection**: Users can specify who's attending; missing critical roles create learning moments
- **Diverse character generation**: Unique, varied names for each exercise
- **Multiple threat themes**: Funding crisis, cyber breach, safety threats, etc.
- **Customizable objectives and themes**
- **PDF export via browser print**
- **60 or 90-minute exercise durations**

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Single HTML file with embedded CSS/JS |
| CSS Framework | Tailwind CSS (via CDN) |
| Backend | Netlify Functions (serverless) |
| AI Model | Claude 3.5 Haiku (Anthropic API) |
| Hosting | Netlify |
| Version Control | GitHub |

---

## Project Structure

```
tabletop-writer/
├── index.html                          # Main application (frontend)
├── netlify/
│   └── functions/
│       └── generate-exercise.js        # Serverless function (AI generation)
├── netlify.toml                        # Netlify configuration
├── Assets/
│   ├── MTM - 200 x 200px.png          # Logo
│   └── favicon.ico                     # Favicon
├── Samples/                            # Reference tabletop exercises
├── CLAUDE.md                           # AI assistant instructions
├── README.md                           # Project readme
└── HANDOVER.md                         # This document
```

---

## Form Sections

The application has a 4-step form:

### Step 1: Organization Profile
- **Sector**: Education, Human & Civil Rights, Environmental, etc.
- **Staff Count**: Number input for FTE employees
- **Annual Revenue**: Dropdown with 5 bands (Under $500K through $25M+)

### Step 2: Scenario Design
- **Duration**: 60 or 90 minutes
- **Threat Theme**: 7 predefined options or custom theme
- Custom theme input disables dropdown when filled

### Step 3: Exercise Participants
- **Auto-select**: AI chooses appropriate roles based on scenario type (default)
- **Manual selection**: User specifies which roles will attend from 10 options:
  - Executive Director, Operations, Finance, Development, Communications
  - Programs, IT, HR, Legal, Board Member
- If critical roles are missing, the exercise includes moments where participants must engage those functions

### Step 4: Exercise Objectives
- 12 predefined objectives (select up to 3)
- Custom objective input option

---

## Key Files Explained

### `index.html`
The entire frontend application in a single file:
- **Lines 1-265**: CSS styling (MTM brand colors, form elements, animations)
- **Lines 286-470**: HTML structure (4-step form with participant selection)
- **Lines 475-1100**: JavaScript `TabletopExerciseApp` class

Key JavaScript methods:
- `generateExercise()` - Calls the Netlify function
- `extractFormData()` - Gathers all form inputs including participant mode
- `validateForm()` - Validates objectives and participant selection
- `displayGeneratedResults()` - Renders the AI output
- `downloadExercise()` - Opens print dialog for PDF export

### `netlify/functions/generate-exercise.js`
Serverless function that calls the Anthropic API:

**Lines 1-95**: `SCENARIO_ROLE_MAPPINGS` - Defines critical and optional roles for each threat type:
- `funding` - CFO, Development Director, Board Chair
- `gov` - Legal Counsel, Data Governance Lead
- `cyber_breach` - IT Lead, Data Governance Lead, Legal
- `reputation` - Communications Lead, Legal
- `safety` - HR Director, IT Lead, Legal
- `vendor_compromise` - IT Lead, Data Governance, CFO
- `insider_threat` - HR Director, Legal, IT Lead

**Lines 97-160**: Helper functions:
- `identifyThemeKey()` - Maps user input to role configuration
- `buildRoleSection()` - Generates role instructions for auto-select mode

**Lines 160-267**: Main handler:
- Parses request including `staffCount`, `revenueBand`, `participantMode`, `selectedRoles`
- Validates input
- Builds scenario-specific prompt
- Calls Anthropic API
- Returns generated exercise with metadata

**Lines 269-312**: `buildOrgContext()` - Adjusts prompt based on organization size:
- Very small (≤10 staff): ED-centric, combined roles, no specialists assumed
- Small (11-25 staff): Limited specialists, overlapping responsibilities
- Medium (26-75 staff): Some dedicated roles but lean operations
- Large (75+ staff): Dedicated departments, formal structures

**Lines 314-367**: `identifyMissingRoles()` - Compares selected roles against critical roles for the scenario type

**Lines 369-520**: `createTabletopPrompt()` - Constructs the AI prompt with:
- Organization context (size, budget, sector)
- Participant mode handling (auto vs manual)
- Missing roles guidance (if manual mode with gaps)
- Name diversity instructions
- Phase structure requirements
- HTML formatting instructions

---

## Request/Response Format

### POST `/.netlify/functions/generate-exercise`

**Request Body:**
```json
{
  "sector": "Education",
  "theme": "Cybersecurity Breach (Ransomware, Data Leak)",
  "objectives": [
    "Test internal communication protocols",
    "Clarify decision-making authority"
  ],
  "duration": 60,
  "staffCount": 25,
  "revenueBand": "$1M - $5M",
  "participantMode": "manual",
  "selectedRoles": ["Executive Director", "Finance Director", "Communications Director"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "content": "<h3>Scenario Overview</h3>...",
  "metadata": {
    "sector": "Education",
    "theme": "Cybersecurity Breach",
    "themeKey": "cyber_breach",
    "objectives": ["..."],
    "duration": 60,
    "staffCount": 25,
    "revenueBand": "$1M - $5M",
    "participantMode": "manual",
    "selectedRoles": ["Executive Director", "Finance Director", "Communications Director"],
    "generatedAt": "2026-01-09T17:58:51.567Z"
  }
}
```

---

## Organization Size Logic

The prompt adapts based on staff count and revenue:

| Staff Count | Revenue Band | Behavior |
|-------------|--------------|----------|
| ≤10 | Under $500K | Very small org: ED handles most things, combined roles, no specialists |
| 11-25 | $500K-$1M | Small org: Limited specialists, ED heavily involved |
| 26-75 | $1M-$5M | Mid-sized: Some dedicated roles but lean operations |
| 75+ | $5M+ | Larger org: Dedicated departments, formal structures |

If staff count is not provided, revenue band is used as a fallback indicator.

---

## Missing Roles Feature

When users select "I'll specify who's attending" and choose roles that don't cover all critical functions for the scenario:

1. **During exercise phases**: Include 1-2 moments where participants realize they need input from a missing role
2. **Discussion questions**: Add prompts like "Legal Counsel isn't present. How do you proceed?"
3. **Wrap-up section**: Recommend adding missing critical roles to future incident response teams

This creates learning moments about team composition without derailing the exercise.

---

## Environment Variables

Set in Netlify Dashboard → Site Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | API key from console.anthropic.com |

---

## Local Development

```bash
# Clone repository
git clone https://github.com/ksnyder-mtm/tabletop-writer.git
cd tabletop-writer

# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Link to Netlify site
netlify link

# Run local development server
netlify dev

# Open http://localhost:8888
```

Note: Local development requires the `ANTHROPIC_API_KEY`. Create a `.env` file with the key or rely on Netlify CLI to inject it from site settings.

---

## Deployment

The site auto-deploys from the `main` branch on GitHub. For manual deployment:

```bash
# Deploy to production
netlify deploy --prod

# Preview deployment (non-production URL)
netlify deploy
```

---

## How It Works

1. **User fills form** → Organization profile, threat theme, participants, objectives
2. **Form submission** → JavaScript validates and calls `/.netlify/functions/generate-exercise`
3. **Function processes**:
   - Identifies theme type and critical roles
   - Builds org-size-aware context
   - If manual mode, identifies missing critical roles
   - Constructs prompt with name diversity instructions
4. **API call** → Sends prompt to Claude 3.5 Haiku
5. **Response** → Returns HTML-formatted exercise content
6. **Display** → Frontend renders content with success animation
7. **Export** → User can print/save as PDF via browser

---

## Recent Changes (January 2026)

### Organization Size Context
- Added staff count (number input) and annual revenue (5-band dropdown)
- `buildOrgContext()` function adjusts prompt based on organization size
- Small orgs get realistic role consolidation; large orgs get formal structures
- Revenue band used as fallback if staff count not provided

### Name Diversity
- Added explicit instructions for unique, diverse character names
- Timestamp-based seed encourages variation between exercises
- Explicit prohibition of common placeholder names (John, Jane, etc.)
- Mix of ethnicities, genders, and cultural backgrounds

### Manual Participant Selection
- New form section for choosing auto vs manual participant mode
- 10 role checkboxes when manual mode selected
- `identifyMissingRoles()` compares selections against critical roles
- Missing roles trigger special prompt instructions for learning moments

### Prompt Improvements
- Added explicit instruction to generate complete exercise without asking questions
- Scenario-specific role mapping with 7 threat types
- Each threat type has critical roles (must include) and optional roles

---

## Known Limitations

1. **Timeout Constraints**: Netlify functions timeout at ~30 seconds. Using Haiku model to stay within limits.

2. **No Validation Pass**: Originally had a two-pass system (generate + validate), but disabled due to timeout.

3. **No User Accounts**: Exercises are not saved. Users must print/export immediately.

4. **Single-Session**: No exercise history or regeneration of sections.

---

## Future Improvements (if needed)

| Priority | Improvement | Notes |
|----------|-------------|-------|
| Medium | Export to Word (.docx) | Many nonprofits prefer Word format |
| Medium | Save/load exercise drafts | localStorage for session persistence |
| Low | Exercise history | Store completed exercises |
| Low | Facilitator guide | Separate tips document for running exercises |
| Low | Streaming responses | Show content as it generates |

---

## Troubleshooting

### "Failed to generate exercise" error
1. Check Netlify function logs: `netlify logs:function generate-exercise`
2. Verify `ANTHROPIC_API_KEY` is set in Netlify environment variables
3. Check API key is valid at console.anthropic.com

### Model asks for confirmation instead of generating
- The prompt includes explicit instruction to generate immediately
- If this recurs, strengthen the instruction at prompt start

### Timeout errors
- Function takes ~25 seconds with Haiku model
- If consistently timing out, check Netlify plan (Pro required for >10s)
- Consider simplifying prompt or reducing max_tokens

### 404 on function
- Ensure function is deployed: `netlify functions:list`
- Redeploy: `netlify deploy --prod`

---

## Contacts

- **Project Owner:** Kim Snyder (kim@mtm.now)
- **Organization:** Meet the Moment (www.mtm.now)
- **GitHub:** ksnyder-mtm

---

## License

Proprietary - Meet the Moment. All rights reserved.
