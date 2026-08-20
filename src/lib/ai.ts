// Lightweight client-side AI text generator.
// Produces structured, deterministic-but-varied output from user inputs using
// templated prompts. No external API key required — works fully offline.

export type EmailInput = {
  purpose: string;
  recipient: string;
  tone: string;
  keyPoints: string;
};

export type MeetingInput = {
  notes: string;
};

export type TaskInput = {
  goal: string;
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function splitPoints(text: string): string[] {
  return text
    .split(/[\n;]+|\u2022|•|\d+\.\s/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// ---------------------------------------------------------------------------
// Email Generator
// ---------------------------------------------------------------------------

export function generateEmail(input: EmailInput): string {
  const seed = hash(JSON.stringify(input));
  const points = splitPoints(input.keyPoints);
  const recipientName = input.recipient.trim() || 'there';

  const openers: Record<string, string> = {
    Professional: `Dear ${recipientName},`,
    Friendly: `Hi ${recipientName},`,
    Formal: `Greetings ${recipientName},`,
    Concise: `${recipientName},`,
    Persuasive: `Hello ${recipientName},`,
    Appreciative: `Dear ${recipientName},`,
  };
  const closers: Record<string, string> = {
    Professional: 'Best regards,',
    Friendly: 'Warm regards,',
    Formal: 'Respectfully,',
    Concise: 'Thanks,',
    Persuasive: 'Looking forward to your response,',
    Appreciative: 'With gratitude,',
  };

  const opener = openers[input.tone] ?? openers.Professional;
  const closer = closers[input.tone] ?? closers.Professional;

  const purposeLower = input.purpose.trim().toLowerCase();
  const introTemplates = [
    `I hope this message finds you well. I'm writing to ${purposeLower}.`,
    `I trust you're doing well. I wanted to reach out regarding ${purposeLower}.`,
    `Thank you for your time. The purpose of this email is to ${purposeLower}.`,
  ];

  let body = pick(introTemplates, seed) + '\n\n';

  if (points.length > 0) {
    body += "Here are the key points I'd like to highlight:\n\n";
    points.forEach((p, i) => {
      body += `${i + 1}. ${p}\n`;
    });
    body += '\n';
  }

  const ctas = [
    'Please let me know if you have any questions or need further details.',
    "I'd appreciate your thoughts on this at your earliest convenience.",
    'Happy to discuss this further whenever works for you.',
  ];
  body += pick(ctas, seed + 1) + '\n\n' + closer + '\n[Your Name]';

  return `${opener}\n\n${body}`;
}

// ---------------------------------------------------------------------------
// Meeting Notes Summarizer
// ---------------------------------------------------------------------------

export type MeetingOutput = {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: string[];
  followUps: string[];
};

export function summarizeMeeting(input: MeetingInput): MeetingOutput {
  const notes = input.notes.trim();
  const lines = notes
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const lower = notes.toLowerCase();

  // Key points: lines that look substantive
  const keyPoints = lines
    .filter((l) => l.length > 15 && !/^action/i.test(l) && !/^decision/i.test(l) && !/^follow/i.test(l))
    .slice(0, 6)
    .map((l) => l.replace(/^[\u2022•\-\d.\s]+/, '').trim());

  // Action items: lines containing action verbs
  const actionVerbs = ['will', 'should', 'must', 'need to', 'todo', 'to do', 'assigned', 'responsible', 'follow up', 'complete', 'prepare', 'send', 'review', 'draft', 'schedule'];
  const actionItems = lines
    .filter((l) => actionVerbs.some((v) => l.toLowerCase().includes(v)))
    .slice(0, 5)
    .map((l) => l.replace(/^[\u2022•\-\d.\s]+/, '').trim());

  // Decisions: lines containing decision language
  const decisionWords = ['decided', 'agreed', 'approved', 'concluded', 'resolution', 'consensus', 'finalize', 'finalised'];
  const decisions = lines
    .filter((l) => decisionWords.some((v) => l.toLowerCase().includes(v)))
    .slice(0, 5)
    .map((l) => l.replace(/^[\u2022•\-\d.\s]+/, '').trim());

  // Follow-ups
  const followWords = ['next', 'follow', 'check', 'verify', 'confirm', 'pending', 'await', 'revisit'];
  const followUps = lines
    .filter((l) => followWords.some((v) => l.toLowerCase().includes(v)))
    .slice(0, 4)
    .map((l) => l.replace(/^[\u2022•\-\d.\s]+/, '').trim());

  const summary = `This meeting covered ${keyPoints.length} main topic${keyPoints.length === 1 ? '' : 's'}. ` +
    (decisions.length > 0 ? `${decisions.length} decision${decisions.length === 1 ? '' : 's'} were made` : 'No formal decisions were recorded') +
    (actionItems.length > 0 ? `, and ${actionItems.length} action item${actionItems.length === 1 ? '' : 's'} were identified for follow-through.` : '.');

  // Fallbacks if nothing matched
  const finalKeyPoints = keyPoints.length > 0 ? keyPoints : lines.slice(0, 3).map((l) => l.replace(/^[\u2022•\-\d.\s]+/, '').trim());
  const finalActions = actionItems.length > 0 ? actionItems : [];
  const finalDecisions = decisions.length > 0 ? decisions : [];
  const finalFollowUps = followUps.length > 0 ? followUps : [];

  return {
    summary,
    keyPoints: finalKeyPoints,
    decisions: finalDecisions,
    actionItems: finalActions,
    followUps: finalFollowUps,
  };
}

// ---------------------------------------------------------------------------
// Task Planner
// ---------------------------------------------------------------------------

export type PlannedTask = {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  dependencies: string[];
};

export function planTasks(input: TaskInput): PlannedTask[] {
  const goal = input.goal.trim();
  const seed = hash(goal);

  const phases = [
    {
      title: 'Discovery & Research',
      description: `Gather requirements, identify stakeholders, and research context for: ${goal}.`,
      priority: 'High' as const,
      days: 3,
    },
    {
      title: 'Planning & Scoping',
      description: `Define scope, success criteria, and a detailed work breakdown for ${goal}.`,
      priority: 'High' as const,
      days: 5,
    },
    {
      title: 'Design & Drafting',
      description: `Create initial drafts, mockups, or prototypes aligned with the goal: ${goal}.`,
      priority: 'Medium' as const,
      days: 7,
    },
    {
      title: 'Implementation',
      description: `Execute the core work required to achieve: ${goal}.`,
      priority: 'High' as const,
      days: 10,
    },
    {
      title: 'Review & Refinement',
      description: `Validate output against success criteria, incorporate feedback, and refine deliverables for ${goal}.`,
      priority: 'Medium' as const,
      days: 4,
    },
    {
      title: 'Final Delivery & Handoff',
      description: `Package deliverables, document outcomes, and hand off results of: ${goal}.`,
      priority: 'Low' as const,
      days: 2,
    },
  ];

  // Pick 4-6 phases based on seed for variety
  const count = 4 + (seed % 3);
  const selected = phases.slice(0, count);

  const baseDate = new Date();
  let cumulativeDays = 0;

  return selected.map((phase, i) => {
    cumulativeDays += phase.days;
    const deadline = new Date(baseDate);
    deadline.setDate(deadline.getDate() + cumulativeDays);

    return {
      id: `task-${i + 1}`,
      title: phase.title,
      description: phase.description,
      priority: phase.priority,
      deadline: deadline.toISOString().split('T')[0],
      dependencies: i > 0 ? [`task-${i}`] : [],
    };
  });
}
