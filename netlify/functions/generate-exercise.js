// Scenario-to-role mapping: defines which roles are critical vs optional for each threat type
const SCENARIO_ROLE_MAPPINGS = {
  funding: {
    critical: [
      { title: 'Executive Director/CEO', focus: 'Overall crisis leadership and board communication' },
      { title: 'CFO/Finance Director', focus: 'Cash flow analysis, budget reallocation, financial scenario planning' },
      { title: 'Development/Fundraising Director', focus: 'Donor communication, emergency fundraising, grant pivots' },
      { title: 'Board Chair or Treasurer', focus: 'Governance decisions, reserve fund authorization, fiduciary oversight' }
    ],
    optional: [
      { title: 'Program Director', focus: 'Service continuity, program prioritization decisions' },
      { title: 'HR Director', focus: 'Staffing decisions, layoff protocols if needed' },
      { title: 'Communications Lead', focus: 'Stakeholder messaging, public narrative' }
    ]
  },
  gov: {
    critical: [
      { title: 'Executive Director/CEO', focus: 'Organizational response leadership, external representation' },
      { title: 'Legal Counsel', focus: 'Subpoena response, compliance requirements, privilege protection' },
      { title: 'Board Chair', focus: 'Governance oversight, legal strategy approval' },
      { title: 'Data Governance Lead', focus: 'Document preservation, records management, data access controls' }
    ],
    optional: [
      { title: 'CFO/Finance Director', focus: 'Financial records preparation, audit coordination' },
      { title: 'Communications Lead', focus: 'Media response, stakeholder communication' },
      { title: 'HR Director', focus: 'Staff communication, witness coordination' }
    ]
  },
  cyber_breach: {
    critical: [
      { title: 'IT/Technical Lead', focus: 'Incident containment, forensic investigation, system recovery' },
      { title: 'Data Governance Lead', focus: 'Data classification, breach scope assessment, notification requirements' },
      { title: 'Legal Counsel', focus: 'Regulatory compliance, notification obligations, liability management' },
      { title: 'Executive Director/CEO', focus: 'Crisis leadership, board notification, organizational decisions' }
    ],
    optional: [
      { title: 'Communications Lead', focus: 'Stakeholder notification, media response' },
      { title: 'CFO/Finance Director', focus: 'Insurance claims, budget for remediation' },
      { title: 'HR Director', focus: 'Staff whose data was compromised, internal communication' },
      { title: 'Development Director', focus: 'Donor notification if donor data affected' }
    ]
  },
  reputation: {
    critical: [
      { title: 'Communications Lead', focus: 'Crisis messaging, media relations, narrative management' },
      { title: 'Executive Director/CEO', focus: 'Public spokesperson, organizational positioning' },
      { title: 'Board Chair', focus: 'Governance perspective, leadership support/decisions' },
      { title: 'Legal Counsel', focus: 'Defamation assessment, legal response options' }
    ],
    optional: [
      { title: 'HR Director', focus: 'Staff misconduct issues, internal investigations' },
      { title: 'Development Director', focus: 'Donor relationship management, funding impact' },
      { title: 'Program Director', focus: 'Partner and beneficiary communication' }
    ]
  },
  safety: {
    critical: [
      { title: 'HR Director', focus: 'Staff safety protocols, employee support, workplace security' },
      { title: 'Executive Director/CEO', focus: 'Crisis leadership, law enforcement coordination' },
      { title: 'IT/Technical Lead', focus: 'Digital security, account protection, monitoring' },
      { title: 'Legal Counsel', focus: 'Restraining orders, law enforcement coordination, liability' }
    ],
    optional: [
      { title: 'Communications Lead', focus: 'Internal communications, external messaging if needed' },
      { title: 'Operations/Facilities Lead', focus: 'Physical security, building access' },
      { title: 'Board Chair', focus: 'Governance support for major security decisions' }
    ]
  },
  vendor_compromise: {
    critical: [
      { title: 'IT/Technical Lead', focus: 'Vendor access audit, system isolation, technical remediation' },
      { title: 'Data Governance Lead', focus: 'Data exposure assessment, vendor data inventory' },
      { title: 'Legal Counsel', focus: 'Contract review, liability assessment, vendor obligations' },
      { title: 'CFO/Finance Director', focus: 'Vendor management, contract implications, financial exposure' }
    ],
    optional: [
      { title: 'Executive Director/CEO', focus: 'Vendor relationship decisions, organizational response' },
      { title: 'Communications Lead', focus: 'Stakeholder notification if data affected' },
      { title: 'Operations Lead', focus: 'Service continuity, alternative vendor identification' }
    ]
  },
  insider_threat: {
    critical: [
      { title: 'HR Director', focus: 'Employee investigation, disciplinary process, staff communication' },
      { title: 'Legal Counsel', focus: 'Employment law, evidence preservation, potential prosecution' },
      { title: 'IT/Technical Lead', focus: 'Access revocation, forensic investigation, system audit' },
      { title: 'Executive Director/CEO', focus: 'Investigation oversight, organizational decisions' }
    ],
    optional: [
      { title: 'Data Governance Lead', focus: 'Data access audit, exposure assessment' },
      { title: 'CFO/Finance Director', focus: 'Financial audit if funds involved' },
      { title: 'Board Chair', focus: 'Governance oversight, especially if senior staff involved' }
    ]
  }
};

// Helper function to identify theme key from theme text
function identifyThemeKey(themeText) {
  const themeTextLower = themeText.toLowerCase();

  // Direct mapping for dropdown values
  const directMappings = {
    'funding': 'funding',
    'grant': 'funding',
    'gov': 'gov',
    'subpoena': 'gov',
    'investigation': 'gov',
    'cyber': 'cyber_breach',
    'ransomware': 'cyber_breach',
    'breach': 'cyber_breach',
    'data leak': 'cyber_breach',
    'reputation': 'reputation',
    'disinformation': 'reputation',
    'misconduct': 'reputation',
    'safety': 'safety',
    'harassment': 'safety',
    'doxxing': 'safety',
    'threat': 'safety',
    'vendor': 'vendor_compromise',
    'third-party': 'vendor_compromise',
    'partner compromise': 'vendor_compromise',
    'insider': 'insider_threat',
    'internal': 'insider_threat',
    'employee theft': 'insider_threat'
  };

  for (const [keyword, themeKey] of Object.entries(directMappings)) {
    if (themeTextLower.includes(keyword)) {
      return themeKey;
    }
  }

  // Default to cyber_breach as it's the most comprehensive role set
  return 'cyber_breach';
}

// Build role section for prompt based on scenario
function buildRoleSection(themeKey) {
  const mapping = SCENARIO_ROLE_MAPPINGS[themeKey] || SCENARIO_ROLE_MAPPINGS['cyber_breach'];

  let roleSection = `**3. INCIDENT RESPONSE TEAM**
Note: These roles are specifically selected for this ${themeKey.replace('_', ' ')} scenario. Participants may need to cover multiple roles if not all positions are filled.

**Critical Roles for This Scenario (must include all):**
`;

  mapping.critical.forEach((role, index) => {
    roleSection += `${index + 1}. **${role.title}** - ${role.focus}\n`;
  });

  roleSection += `\n**Supporting Roles (include 1-2 as relevant):**\n`;

  mapping.optional.forEach((role, index) => {
    roleSection += `${index + 1}. ${role.title} - ${role.focus}\n`;
  });

  return roleSection;
}

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

    // Identify the theme key for role mapping
    const themeKey = identifyThemeKey(theme);

    // Create the prompt based on sample exercises with scenario-specific roles
    const prompt = createTabletopPrompt(sector, theme, objectives, duration || 60, themeKey);

    // Call Anthropic API for initial generation
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2500,
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
    let generatedContent = data.content[0].text;

    // Validation pass: Check coherence and make improvements
    const validationPrompt = createValidationPrompt(generatedContent, sector, theme, objectives, themeKey);

    const validationResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 3000,
        temperature: 0.3, // Lower temperature for more consistent validation
        messages: [
          {
            role: 'user',
            content: validationPrompt
          }
        ]
      })
    });

    if (validationResponse.ok) {
      const validationData = await validationResponse.json();
      const validatedContent = validationData.content[0].text;

      // Use validated content if it appears to be a complete exercise
      if (validatedContent.includes('<h3>') && validatedContent.length > 1000) {
        generatedContent = validatedContent;
      }
    }

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
          themeKey,
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

function createTabletopPrompt(sector, theme, objectives, duration, themeKey) {
  const objectivesList = objectives.map(obj => `• ${obj}`).join('\n');
  const numPhases = duration === 90 ? 6 : 4;
  const roleSection = buildRoleSection(themeKey);

  // Get the critical roles for reference in discussion questions
  const mapping = SCENARIO_ROLE_MAPPINGS[themeKey] || SCENARIO_ROLE_MAPPINGS['cyber_breach'];
  const criticalRoleNames = mapping.critical.map(r => r.title).join(', ');

  return `Create a comprehensive tabletop exercise scenario for a nonprofit organization. Use this specification:

**ORGANIZATION CONTEXT:**
- Sector: ${sector}
- Primary threat: ${theme}
- Scenario type: ${themeKey.replace('_', ' ')}
- Exercise duration: ${duration} minutes
- Learning objectives to address:
${objectivesList}

**REQUIRED STRUCTURE:**

**1. SCENARIO OVERVIEW**
Write 2-3 sentences describing the crisis situation. Make it realistic and relevant to ${sector} organizations facing a ${theme} situation.

**2. ORGANIZATION PROFILE**
Create a fictional nonprofit with:
- Realistic name appropriate for ${sector} sector
- Staff size (50-300 people)
- Brief mission statement
- Key operational details that matter for this specific ${themeKey.replace('_', ' ')} crisis

${roleSection}

IMPORTANT: The roles listed above are SPECIFICALLY CHOSEN for this ${themeKey.replace('_', ' ')} scenario. You MUST:
- Include ALL critical roles in the Incident Response Team section
- Include 1-2 supporting roles that are most relevant
- Give each person a realistic name and their specific focus area for THIS crisis
- Reference these specific roles by name throughout the phases and discussion questions

**4. EXERCISE PHASES (exactly ${numPhases} phases)**
This is a ${duration}-minute executive-level tabletop (not technical). Create exactly ${numPhases} phases.

CRITICAL REQUIREMENTS FOR PHASES:
1. Each phase MUST involve decisions relevant to the specific roles listed above (${criticalRoleNames})
2. Discussion questions MUST reference specific roles and their responsibilities
3. Injects should create tension between different role perspectives (e.g., legal vs communications, finance vs operations)

Format each phase EXACTLY like this example:
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
- Base on actual nonprofit challenges for ${themeKey.replace('_', ' ')} scenarios
- Include realistic operational constraints (budget, staffing, partnerships)
- Reference appropriate regulations/compliance for the ${sector} sector
- Include modern technology and communication challenges
- Consider multi-stakeholder coordination (board, partners, donors, media)

**COHERENCE CHECK:**
Before finalizing, verify that:
1. All critical roles appear in the Incident Response Team
2. Each role is referenced in at least one phase's discussion questions
3. The scenario progression makes sense for a ${themeKey.replace('_', ' ')} incident
4. Discussion questions address the stated learning objectives

Generate a complete, ready-to-use tabletop exercise that could be facilitated immediately.`;
}

// Validation prompt to check coherence and improve the exercise
function createValidationPrompt(generatedContent, sector, theme, objectives, themeKey) {
  const mapping = SCENARIO_ROLE_MAPPINGS[themeKey] || SCENARIO_ROLE_MAPPINGS['cyber_breach'];
  const criticalRoles = mapping.critical.map(r => r.title).join(', ');
  const objectivesList = objectives.map(obj => `• ${obj}`).join('\n');

  return `You are a quality assurance reviewer for nonprofit crisis tabletop exercises. Review and improve the following exercise.

**ORIGINAL EXERCISE:**
${generatedContent}

**VALIDATION CRITERIA:**

1. **Role-Scenario Alignment**: This is a "${themeKey.replace('_', ' ')}" scenario. The critical roles MUST be: ${criticalRoles}
   - Check: Are ALL these roles present in the Incident Response Team?
   - Check: Is each critical role referenced in the discussion questions?
   - Fix: If roles are missing or generic, add/replace them with the correct ones.

2. **Objective Coverage**: The exercise should address these objectives:
${objectivesList}
   - Check: Does at least one discussion question relate to each objective?
   - Fix: Add relevant discussion questions if objectives are not covered.

3. **Sector Relevance**: This is for a "${sector}" organization.
   - Check: Is the fictional organization realistic for this sector?
   - Check: Are the injects and complications sector-appropriate?
   - Fix: Adjust organization details and injects to be more sector-specific.

4. **Scenario Progression**:
   - Check: Do the phases escalate logically?
   - Check: Do injects create meaningful decision points?
   - Fix: Adjust phase content for better flow if needed.

5. **Discussion Question Quality**:
   - Check: Do questions require strategic thinking, not just factual answers?
   - Check: Do questions create productive tension between different roles/priorities?
   - Fix: Strengthen weak questions.

**YOUR TASK:**
Return the COMPLETE, IMPROVED exercise with all corrections applied. Maintain the exact same HTML formatting structure. If the exercise is already high quality, return it unchanged.

Output ONLY the improved exercise content (starting with <h3>), no commentary or explanation.`;
}