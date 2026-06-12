// Topic → calculator suggestion helper used by the blog generator.
// Refocused for the new FWV calculator site: credit, debt payoff, real estate investing, and tip split utility.

export type Suggestion = {
  main: string;
  targets: string[];
};

export const ALLOWED: string[] = [
  'Credit Utilization Optimizer',
  'Debt Payoff Priority Ranker',
  'Real Estate Deal Snapshot Calculator',
  'Max Offer & ARV Calculator',
  'Tip & Tab Split Calculator',
];

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function clampTargets(main: string, targets: string[], max = 4): string[] {
  return uniq(targets.filter((t) => t && t !== main && ALLOWED.includes(t))).slice(0, max);
}

export function suggestFromTopic(rawTopic: string): Suggestion {
  const t = (rawTopic || '').toLowerCase();

  if (/(utilization|credit card utilization|balance|credit limit|pay down card|revolving|fico|score impact|score range)/.test(t)) {
    const main = 'Credit Utilization Optimizer';
    return { main, targets: clampTargets(main, ['Debt Payoff Priority Ranker']) };
  }

  if (/(debt payoff|snowball|avalanche|minimum payment|interest saved|payoff order|credit card debt|debt-free|debt free)/.test(t)) {
    const main = 'Debt Payoff Priority Ranker';
    return { main, targets: clampTargets(main, ['Credit Utilization Optimizer']) };
  }

  if (/(arv|after repair value|max offer|maximum allowable offer|mao|70% rule|70 percent rule|rehab|flip|brrrr)/.test(t)) {
    const main = 'Max Offer & ARV Calculator';
    return { main, targets: clampTargets(main, ['Real Estate Deal Snapshot Calculator']) };
  }

  if (/(rental|cash flow|cap rate|dscr|noi|vacancy|property management|landlord|deal analysis|real estate investor|investment property|rent|brrrr)/.test(t)) {
    const main = 'Real Estate Deal Snapshot Calculator';
    return { main, targets: clampTargets(main, ['Max Offer & ARV Calculator']) };
  }

  if (/(restaurant|tip|tab split|check split|gratuity|dinner bill)/.test(t)) {
    const main = 'Tip & Tab Split Calculator';
    return { main, targets: [] };
  }

  const main = 'Credit Utilization Optimizer';
  return { main, targets: clampTargets(main, ['Debt Payoff Priority Ranker', 'Real Estate Deal Snapshot Calculator']) };
}
