exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { sector, theme, objectives, duration } = JSON.parse(event.body);
    
    // Validate required fields
    if (!sector || !theme || !objectives || objectives.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: sector, theme, and objectives' })
      };
    }

    // Get API key from environment variable
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API configuration error' })
      };
    }

    // Create the prompt based on sample exercises
    const prompt = createTabletopPrompt(sector, theme, objectives, duration || 60);
    
    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307', // Using Haiku for faster, cost-effective generation
        max_tokens: 2000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API Error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to generate exercise scenario' })
      };
    }

    const data = await response.json();
    const generatedContent = data.content[0].text;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        content: generatedContent,
        metadata: {
          sector,
          theme,
          objectives,
          duration,
          generatedAt: new Date().toISOString()
        }
      })
    };

  } catch (error) {
    console.error('Error generating exercise:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

function createTabletopPrompt(sector, theme, objectives, duration) {
  const objectivesList = objectives.map(obj => `• ${obj}`).join('\n');
  const numPhases = duration === 90 ? 6 : 4;
  const phaseExamples = duration === 90 
    ? '"Phase 1 (Minutes 1-10)", "Phase 2 (Minutes 12-22)", "Phase 3 (Minutes 24-34)", "Phase 4 (Minutes 36-46)", "Phase 5 (Minutes 48-58)", "Phase 6 (Minutes 60-70)"'
    : '"Phase 1 (Minutes 1-10)", "Phase 2 (Minutes 12-22)", "Phase 3 (Minutes 24-34)", "Phase 4 (Minutes 36-46)"';
  
  return `Create a comprehensive tabletop exercise scenario for a nonprofit organization. Use this specification:

**ORGANIZATION CONTEXT:**
- Sector: ${sector}
- Primary threat: ${theme}
- Exercise duration: ${duration} minutes
- Learning objectives to address:
${objectivesList}

**REQUIRED STRUCTURE:**

**1. SCENARIO OVERVIEW**
Write 2-3 sentences describing the crisis situation. Make it realistic and relevant to ${sector} organizations.

**2. ORGANIZATION PROFILE**
Create a fictional nonprofit with:
- Realistic name appropriate for ${sector} sector
- Staff size (50-300 people)
- Brief mission statement
- Key operational details that matter for the crisis

**3. INCIDENT RESPONSE TEAM**
Note: These are the key roles that need to be covered in the simulation. Not all positions may be available, so some individuals may need to cover multiple roles.

List 5-6 key roles from these categories:
- Executive leadership (CEO/Executive Director)
- COO/Operations lead
- CFO/Finance lead  
- IT/Technical lead
- Communications lead
- Development/Fundraising lead
- Data governance lead
- Legal counsel
- HR lead (if relevant to scenario)

**4. EXERCISE PHASES (exactly ${numPhases} phases)**
This is a ${duration}-minute executive-level tabletop (not technical). Create exactly ${numPhases} phases.

CRITICAL: Format each phase EXACTLY like this example:
<h4>Phase 1 (Minutes 1-10): Initial Detection</h4>
<p>The IT director reports unusual network activity and several employees report their computers are running slowly. Initial investigation suggests possible malware infection affecting multiple departments.</p>
<div style="margin-bottom: 1rem;"></div>
<p><strong>Key Inject:</strong> The finance team discovers they cannot access critical donor database systems, and payroll processing for 200+ staff members is scheduled for tomorrow.</p>
<div style="margin-bottom: 1rem;"></div>
<p><strong>Discussion Questions:</strong></p>
<ul>
<li>Who should be on the immediate response team and what are their roles?</li>
<li>What external parties need to be notified at this stage?</li>
<li>How do we maintain operations while investigating the issue?</li>
</ul>
<div style="margin-bottom: 1.5rem;"></div>

Important: Each phase MUST follow this exact format with proper HTML tags and spacing divs.

**5. WRAP-UP SECTION**
Add a final section titled "Next Steps and Improvements (Minutes ${duration - 5}-${duration})" with:
- Key takeaways from the exercise
- 2-3 actionable next steps for the organization
- Areas for improvement identified during the simulation

**FORMATTING REQUIREMENTS:**
- Use HTML headings: <h3> for main sections (Scenario Overview, Organization Profile, etc.)
- Add <div style="margin-bottom: 2rem;"></div> after each major section for spacing
- Follow the EXACT phase format shown in the example above
- Use <ul> and <li> for all lists
- Use <p> tags for all paragraphs
- Use <strong> for emphasis on key points like "Key Inject:" and "Discussion Questions:"
- Keep tone professional but accessible for busy executives
- Focus discussion questions on strategic decisions, not technical implementation

**REALISM REQUIREMENTS:**
- Base on actual nonprofit challenges
- Include realistic operational constraints (budget, staffing, partnerships)
- Reference appropriate regulations/compliance for the sector
- Include modern technology and communication challenges
- Consider multi-stakeholder coordination (board, partners, donors, media)

Generate a complete, ready-to-use tabletop exercise that could be facilitated immediately.`;
}