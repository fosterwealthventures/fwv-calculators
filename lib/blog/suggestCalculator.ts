// Simple topic → calculator suggestion helper used by the blog generator
// Only returns calculator names that the generator prompt explicitly allows.

export type Suggestion = {
  main: string;
  targets: string[];
};

// Whitelist of calculator names accepted by the generator prompt
export const ALLOWED: string[] = [
  'Break-even Calculator',
  'ROI Calculator',
  'Mortgage Calculator',
  'Savings Growth Calculator',
  'Debt Payoff Calculator',
  'Employee Cost Calculator',
  'Expense Split Calculator',
  'Simple vs Compound Interest Calculator',
  'Restaurant Tips Calculator',
  'Freelance Rate Calculator',
];

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function clampTargets(main: string, targets: string[], max = 4): string[] {
  return uniq(targets.filter((t) => t && t !== main && ALLOWED.includes(t))).slice(0, max);
}

export function suggestFromTopic(rawTopic: string): Suggestion {
  const t = (rawTopic || '').toLowerCase();

  // Rent vs Buy / Mortgage themes
  if (/(rent\s*vs\s*buy|rent\s*or\s*buy|mortgage|home|down payment|property tax|hoa)/.test(t)) {
    const main = 'Mortgage Calculator';
    const targets = clampTargets(main, [
      // Order: ROI context, opportunity cost, compounding, then pricing
      'ROI Calculator',
      'Savings Growth Calculator',
      'Simple vs Compound Interest Calculator',
      'Break-even Calculator',
    ]);
    return { main, targets };
  }

  // Car affordability / auto loan / leasing themes
  if (/(car|auto|vehicle|lease|leasing|apr|apy|auto loan|dealer|msrp|tco|insurance)/.test(t)) {
    const main = 'Simple vs Compound Interest Calculator';
    const targets = clampTargets(main, [
      // Order: payment comparison ROI, savings buffer, then payoff
      'ROI Calculator',
      'Savings Growth Calculator',
      'Debt Payoff Calculator',
    ]);
    return { main, targets };
  }

  // Side hustle, 1099, freelance income, contractor
  if (/(1099|side hustle|freelance|contractor|gig|self\-?employ(ed|ment)|invoice)/.test(t)) {
    const main = 'Freelance Rate Calculator';
    const targets = clampTargets(main, [
      // Order: cash buffer first, ROI on tools, then debt
      'Savings Growth Calculator',
      'ROI Calculator',
      'Debt Payoff Calculator',
    ]);
    return { main, targets };
  }

  // Debt payoff / credit cards
  if (/(debt payoff|snowball|avalanche|credit card|pay down debt|loan payoff|student loan|refinance debt)/.test(t)) {
    const main = 'Debt Payoff Calculator';
    const targets = clampTargets(main, [
      // Order: compounding awareness, then savings safety net
      'Simple vs Compound Interest Calculator',
      'Savings Growth Calculator',
    ]);
    return { main, targets };
  }

  // Break-even / pricing
  if (/(break[- ]?even|fixed cost|variable cost|contribution margin|price point)/.test(t)) {
    const main = 'Break-even Calculator';
    const targets = clampTargets(main, [
      'ROI Calculator',
      'Freelance Rate Calculator',
    ]);
    return { main, targets };
  }

  // ROI / investing
  if (/(\broi\b|return on investment|payback|npv|irr)/.test(t)) {
    const main = 'ROI Calculator';
    const targets = clampTargets(main, [
      'Break-even Calculator',
      'Savings Growth Calculator',
      'Simple vs Compound Interest Calculator',
    ]);
    return { main, targets };
  }

  // Hiring / employee cost
  if (/(hire|hiring|employee cost|benefits|payroll tax|overhead)/.test(t)) {
    const main = 'Employee Cost Calculator';
    const targets = clampTargets(main, [
      'ROI Calculator',
      'Break-even Calculator',
    ]);
    return { main, targets };
  }

  // Roommates / household split / utilities
  if (/(roommate|roommates|split rent|split utilities|household split|bill split)/.test(t)) {
    const main = 'Expense Split Calculator';
    const targets = clampTargets(main, [
      'Restaurant Tips Calculator',
      'Break-even Calculator',
    ]);
    return { main, targets };
  }

  // Restaurant tips / bill split
  if (/(restaurant|tips|tab split|check split|gratuity)/.test(t)) {
    const main = 'Restaurant Tips Calculator';
    const targets = clampTargets(main, [
      'Expense Split Calculator',
    ]);
    return { main, targets };
  }

  // Savings / compounding
  if (/(save|savings|compound interest|future value|retire|retirement|apy|apr)/.test(t)) {
    const main = 'Savings Growth Calculator';
    const targets = clampTargets(main, [
      'Simple vs Compound Interest Calculator',
      'ROI Calculator',
    ]);
    return { main, targets };
  }

  // Generic fallback
  const main = 'ROI Calculator';
  const targets = clampTargets(main, [
    'Break-even Calculator',
    'Simple vs Compound Interest Calculator',
  ]);
  return { main, targets };
}
