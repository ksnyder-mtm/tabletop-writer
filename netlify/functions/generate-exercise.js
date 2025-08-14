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
    const { sector, theme, objectives } = JSON.parse(event.body);
    
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
    const prompt = createTabletopPrompt(sector, theme, objectives);
    
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

function createTabletopPrompt(sector, theme, objectives) {
  const objectivesList = objectives.map(obj => `• ${obj}`).join('\n');
  
  return `Create a detailed tabletop exercise scenario for a nonprofit organization in the ${sector} sector. The exercise should focus on ${theme} and address these specific learning objectives:

${objectivesList}

Based on the format of professional tabletop exercises, please create:

1. **Scenario Overview**: A realistic 2-3 sentence description of the crisis situation
2. **Organization Profile**: Brief context about the fictional nonprofit (name, size, mission)
3. **Key Roles & Personnel**: 4-6 named characters with titles and responsibilities
4. **Exercise Phases**: 3-4 progressive phases that escalate the scenario, each with:
   - Phase title and timeline (e.g., "Hour 1-2" or "Day 1")
   - Situation update/inject
   - 3-4 targeted discussion questions that test the learning objectives

Format the response in clean HTML that will integrate well with the existing interface. Use semantic headings (h3, h4) and proper structure. Keep the tone professional but accessible for nonprofit audiences.

The scenario should be realistic and relevant to the ${sector} sector, incorporating modern challenges that nonprofits face. Ensure discussion questions promote strategic thinking about crisis response, not just tactical actions.`;
}