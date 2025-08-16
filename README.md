# Tabletop Exercise Generator

## Overview

The Tabletop Exercise Generator is a web application designed specifically for nonprofits and mission-driven organizations to create discussion-based cybersecurity and crisis response training scenarios. This tool helps organizations prepare for various threats and test their incident response capabilities through interactive, scenario-based exercises.

## Features

- **Multi-Phase Exercise Generation**: Creates 60 or 90-minute exercises with progressive scenarios
- **Sector-Specific Content**: Tailored scenarios for different nonprofit sectors (Education, Human Rights, Environmental, Health Services, etc.)
- **Diverse Threat Scenarios**: Pre-configured scenarios including:
  - Funding crises and grant freezes
  - Government investigations and subpoenas
  - Cybersecurity breaches (ransomware, data leaks)
  - Reputational damage and disinformation campaigns
  - Digital and physical safety threats
  - Third-party vendor compromises
  - Insider threats
- **Custom Scenarios**: Option to create organization-specific threat scenarios
- **Learning Objectives**: Select from 12+ predefined objectives or create custom ones
- **AI-Powered Content**: Generates detailed, contextual scenarios using Claude AI
- **Print/PDF Export**: Download exercises for offline use and distribution
- **Psychological Safety Focus**: Built-in guidance for creating blame-free learning environments

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS with custom MTM (Meet the Moment) brand styling
- **AI Integration**: Anthropic Claude API for content generation
- **Hosting**: Netlify with serverless functions
- **No Build Process**: Pure static site, no compilation required

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- For deployment: Netlify account and Anthropic API key

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/ksnyder-mtm/tabletop-writer.git
cd tabletop-writer
```

2. For local development with API functionality:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Create .env file for API key
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env

# Start local development server
netlify dev
```

3. For static viewing only:
   - Simply open `index.html` in your browser
   - Note: AI generation features require the Netlify functions to be running

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed Netlify deployment instructions.

## Usage Guide

### Creating an Exercise

1. **Organization Profile**: Select your nonprofit sector from the dropdown
2. **Scenario Design**: 
   - Choose exercise duration (60 or 90 minutes)
   - Select a primary threat theme or create a custom scenario
3. **Exercise Objectives**: Select up to 3 learning objectives (or add a custom objective)
4. **Generate**: Click "Generate Exercise" to create your tabletop scenario

### Running an Exercise

The generated exercise includes:
- **Before You Begin** section with preparation steps and psychological safety guidelines
- **Phased Scenarios**: Time-boxed scenarios that progressively escalate
- **Key Injects**: Critical information introduced at each phase
- **Discussion Questions**: Thought-provoking questions to guide team discussions
- **Print/PDF Option**: Download for offline facilitation

### Best Practices

1. **Preparation**:
   - Review the entire scenario before the exercise
   - Identify all necessary participants
   - Schedule uninterrupted time
   - Assign a facilitator

2. **Facilitation**:
   - Emphasize psychological safety (no blame culture)
   - Focus on learning and improvement
   - Encourage all perspectives
   - Document lessons learned

3. **Follow-up**:
   - Conduct after-action review
   - Update response plans based on findings
   - Share learnings across the organization

## Project Structure

```
tabletop-writer/
├── index.html              # Main application file
├── Assets/                 # Images and branding assets
│   ├── MTM - 200 x 200px.png
│   └── favicon.ico
├── netlify/
│   └── functions/
│       └── generate-exercise.js  # Serverless function for AI generation
├── Samples/                # Example tabletop exercises
├── mtm-style-guide.md     # Brand styling documentation
├── CLAUDE.md              # AI assistant instructions
├── DEPLOYMENT.md          # Deployment guide
├── netlify.toml           # Netlify configuration
└── package.json           # Project metadata
```

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY`: Required for AI content generation (set in Netlify dashboard or .env file)

### Customization

- **Branding**: Update CSS variables in index.html `:root` section
- **Scenarios**: Modify dropdown options in the form
- **Objectives**: Add/edit checkbox options in the objectives section
- **AI Prompts**: Adjust system prompts in `generate-exercise.js`

## Security Features

- API keys never exposed to frontend
- Input validation on all form submissions
- Content sanitization for XSS prevention
- Security headers configured in `netlify.toml`
- HTTPS enforced on production

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact Meet the Moment at www.mtm.now

## License

This project is proprietary software developed by Meet the Moment. All rights reserved.

## Acknowledgments

- Meet the Moment team for design and requirements
- Anthropic for Claude AI API
- Nonprofit partners for scenario insights and testing

---

**Prototype by Meet the Moment**  
Building resilient nonprofits through innovative crisis preparedness tools.