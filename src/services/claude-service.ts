import type { Project, ParsedGtdInput } from '../types/gtd';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const GTD_PARSE_TOOL = {
  name: 'categorize_gtd_item',
  description:
    'Parse and categorize a natural language input into a structured GTD item.',
  input_schema: {
    type: 'object' as const,
    properties: {
      title: {
        type: 'string',
        description:
          'Clean, actionable title starting with a verb when possible',
      },
      notes: {
        type: 'string',
        description: 'Any additional details or context from the input',
      },
      suggestedList: {
        type: 'string',
        enum: [
          'inbox',
          'next-action',
          'waiting-for',
          'someday-maybe',
          'calendar',
          'reference',
        ],
        description: 'The GTD list this item belongs in',
      },
      suggestedContext: {
        type: ['string', 'null'],
        enum: [
          '@calls',
          '@computer',
          '@errands',
          '@home',
          '@office',
          '@anywhere',
          '@agenda',
          null,
        ],
        description: 'GTD context tag, primarily for next-action items',
      },
      suggestedProjectName: {
        type: ['string', 'null'],
        description: 'Name of the associated project, or null if standalone',
      },
      waitingOnPerson: {
        type: ['string', 'null'],
        description: 'For waiting-for items: who we are waiting on',
      },
      scheduledDate: {
        type: ['string', 'null'],
        description: 'ISO date (YYYY-MM-DD) if date-specific',
      },
      scheduledTime: {
        type: ['string', 'null'],
        description: 'Time (HH:mm) if time-specific',
      },
      dueDate: {
        type: ['string', 'null'],
        description: 'ISO date (YYYY-MM-DD) deadline if mentioned',
      },
      energy: {
        type: ['string', 'null'],
        enum: ['low', 'medium', 'high', null],
      },
      timeEstimate: {
        type: ['string', 'null'],
        enum: ['5min', '15min', '30min', '1hr', '2hr+', null],
      },
      priority: {
        type: ['number', 'null'],
        description: 'Priority 1-4 (1=highest), null if not indicated',
      },
      confidence: {
        type: 'number',
        description: 'Confidence score 0.0 to 1.0',
      },
      reasoning: {
        type: 'string',
        description: 'Brief explanation of the categorization',
      },
    },
    required: [
      'title',
      'notes',
      'suggestedList',
      'suggestedContext',
      'suggestedProjectName',
      'waitingOnPerson',
      'scheduledDate',
      'scheduledTime',
      'dueDate',
      'energy',
      'timeEstimate',
      'priority',
      'confidence',
      'reasoning',
    ],
  },
};

function buildSystemPrompt(projects: Project[]): string {
  const projectNames = projects
    .filter((p) => p.isActive)
    .map((p) => p.name)
    .join(', ');

  return `You are a GTD (Getting Things Done) processing assistant. Parse natural language input — often dictated via voice — into structured GTD items.

## GTD Rules

1. **Next Actions** must be concrete, physical actions starting with a verb. "Call John" is a next action. "Ukraine project" is NOT.
2. **Context Assignment**:
   - @calls: Phone/video calls
   - @computer: Tasks requiring a computer
   - @errands: Tasks requiring going somewhere
   - @home: Tasks at home
   - @office: Tasks at work
   - @anywhere: Location-independent tasks
   - @agenda: Items to discuss with someone at next meeting
3. **Waiting For**: Someone else needs to act. Look for "waiting on", "asked X to", "delegated to".
4. **Calendar**: Only for items with a SPECIFIC date or hard deadline.
5. **Someday/Maybe**: Wishes, ideas, "it would be nice to", no commitment.
6. **Reference**: Pure information, no action needed.
7. **Inbox**: Only if genuinely ambiguous.

## Known Projects
Active projects: ${projectNames}

Match input to projects even indirectly. "call John about Ukraine funding" → project "Ukraine".

## Voice Input
Input is speech-to-text, so ignore minor grammar issues and misspellings. Always choose the MOST SPECIFIC categorization possible. Prefer next-action over inbox.`;
}

interface ContentBlock {
  type: string;
  name?: string;
  input?: Record<string, unknown>;
}

export async function parseGtdInput(
  rawInput: string,
  apiKey: string,
  projects: Project[],
): Promise<ParsedGtdInput> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: buildSystemPrompt(projects),
      tools: [GTD_PARSE_TOOL],
      tool_choice: { type: 'tool', name: 'categorize_gtd_item' },
      messages: [
        {
          role: 'user',
          content: `Parse this into a GTD item: "${rawInput}"`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const toolUseBlock = data.content.find(
    (block: ContentBlock) => block.type === 'tool_use',
  );

  if (!toolUseBlock) {
    throw new Error('No tool_use block in Claude response');
  }

  return toolUseBlock.input as ParsedGtdInput;
}
