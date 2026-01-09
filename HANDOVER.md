# Project Handover: Tabletop Exercise Generator

**Last Updated:** January 2026
**Maintained By:** Meet the Moment (MTM)
**Repository:** https://github.com/ksnyder-mtm/tabletop-writer
**Live URL:** https://tabletop-writer.netlify.app

---

## Project Overview

This is a web application that generates discussion-based cybersecurity and crisis response training scenarios (tabletop exercises) for nonprofit organizations. Users select their organization sector, threat scenario, and learning objectives, and the application uses Claude AI to generate a complete, facilitator-ready exercise.

### Key Features
- Scenario-specific role assignment based on threat type
- Multiple threat themes (funding crisis, cyber breach, safety threats, etc.)
- Customizable objectives and themes
- PDF export via browser print
- 60 or 90-minute exercise durations

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

## Key Files Explained

### `index.html`
The entire frontend application in a single file:
- **Lines 1-265**: CSS styling (MTM brand colors, form elements, animations)
- **Lines 267-430**: HTML structure (form, output area, header/footer)
- **Lines 436-970**: JavaScript `TabletopExerciseApp` class

Key JavaScript methods:
- `generateExercise()` - Calls the Netlify function
- `displayGeneratedResults()` - Renders the AI output
- `downloadExercise()` - Opens print dialog for PDF export
- `updateProgressBar()` - Tracks form completion
- `showLoading()` - Displays progress messages during generation

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

**Lines 97-158**: Helper functions:
- `identifyThemeKey()` - Maps user input to role configuration
- `buildRoleSection()` - Generates role instructions for the prompt

**Lines 160-260**: Main handler:
- Validates input
- Builds scenario-specific prompt
- Calls Anthropic API
- Returns generated exercise

**Lines 294-388**: `createTabletopPrompt()` - Constructs the AI prompt with:
- Organization context
- Scenario-specific roles
- Phase structure requirements
- HTML formatting instructions

### `netlify.toml`
```toml
[build]
  publish = "."
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[functions."generate-exercise"]
  timeout = 60  # Requires Netlify Pro for >10s
```

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

Note: The Netlify function requires the `ANTHROPIC_API_KEY` environment variable. For local development, create a `.env` file or set it in Netlify CLI.

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

1. **User fills form** → Selects sector, threat theme, objectives, duration
2. **Form submission** → JavaScript validates and calls `/.netlify/functions/generate-exercise`
3. **Function processes** → Identifies theme type, builds role-specific prompt
4. **API call** → Sends prompt to Claude 3.5 Haiku
5. **Response** → Returns HTML-formatted exercise content
6. **Display** → Frontend renders content with success animation
7. **Export** → User can print/save as PDF via browser

---

## Recent Changes (January 2026)

### Scenario-Specific Role Mapping
- Added `SCENARIO_ROLE_MAPPINGS` object with 7 threat types
- Each threat type has critical roles (must include) and optional roles
- Roles are embedded in the AI prompt with specific focus areas
- Discussion questions now reference specific role responsibilities

### UX Improvements
- Added loading progress messages during generation
- Made progress bar functional (tracks form completion)
- Added request timeout handling (90 seconds)
- Fixed memory leak in download button event listener

### Performance Optimization
- Switched from Claude Sonnet to Claude 3.5 Haiku for faster response
- Disabled validation pass to stay within Netlify timeout limits
- Function completes in ~25 seconds

---

## Known Limitations

1. **Timeout Constraints**: Netlify functions timeout at ~30 seconds even with Pro plan. Using Haiku model to stay within limits.

2. **No Validation Pass**: Originally had a two-pass system (generate + validate), but disabled due to timeout. The improved prompt produces good results without it.

3. **No User Accounts**: Exercises are not saved. Users must print/export immediately.

4. **Single-Session**: No exercise history or regeneration of sections.

---

## Future Improvements (if needed)

| Priority | Improvement | Notes |
|----------|-------------|-------|
| Medium | Re-enable validation pass | Use Netlify Background Functions for async processing |
| Medium | Export to Word (.docx) | Many nonprofits prefer Word format |
| Low | Exercise history | Store in localStorage or add user accounts |
| Low | Facilitator guide | Separate tips document for running exercises |
| Low | Streaming responses | Show content as it generates |

---

## Troubleshooting

### "Failed to generate exercise" error
1. Check Netlify function logs: `netlify logs:function generate-exercise`
2. Verify `ANTHROPIC_API_KEY` is set in Netlify environment variables
3. Check API key is valid at console.anthropic.com

### Timeout errors
- Function takes ~25 seconds with Haiku model
- If consistently timing out, check Netlify plan (Pro required for >10s)
- Consider simplifying prompt or reducing max_tokens

### 404 on function
- Ensure function is deployed: `netlify functions:list`
- Redeploy: `netlify deploy --prod`

---

## API Reference

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
  "duration": 60
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
    "generatedAt": "2026-01-09T17:58:51.567Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "Failed to generate exercise scenario",
  "details": "API returned 401: ..."
}
```

---

## Contacts

- **Project Owner:** Kim Snyder (kim@mtm.now)
- **Organization:** Meet the Moment (www.mtm.now)
- **GitHub:** ksnyder-mtm

---

## License

Proprietary - Meet the Moment. All rights reserved.
