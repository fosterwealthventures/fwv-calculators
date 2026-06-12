export type GuideCategory = "Credit" | "Real Estate" | "Utility";

export type GuideSection = {
  heading: string;
  body: string[];
};

export type Guide = {
  slug: string;
  aliases?: string[];
  title: string;
  description: string;
  category: GuideCategory;
  calculatorLabel: string;
  calculatorHref: `/${string}`;
  sections: GuideSection[];
  disclaimer?: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "credit-utilization",
    title: "Credit Utilization Guide: What to Pay Down First",
    description:
      "Understand utilization risk across cards and how payoff order can change your credit picture.",
    category: "Credit",
    calculatorLabel: "Open Credit Utilization Optimizer",
    calculatorHref: "/credit-calculators/credit-utilization-optimizer",
    disclaimer:
      "Educational estimate only. This does not predict or guarantee a credit score change and is not credit repair, legal, or financial advice.",
    sections: [
      {
        heading: "Why utilization matters",
        body: [
          "Credit utilization compares your revolving balances to your revolving credit limits. High utilization can make a profile look stretched even when payments are current.",
          "A lower utilization percentage can make the numbers easier to read before you apply for credit, review a report, or decide which balance deserves attention first.",
        ],
      },
      {
        heading: "How to use the calculator",
        body: [
          "Enter every card, credit limit, current balance, and planned payment. The calculator shows your total utilization, projected utilization after payment, and card-level pressure.",
          "Start with the card showing the highest utilization. That does not replace a full credit strategy, but it gives you a clean first move.",
        ],
      },
      {
        heading: "When to go deeper",
        body: [
          "Utilization is only one part of a credit profile. If collections, inquiries, late payments, or reporting errors are also involved, Credit Insight Intelligence is the deeper FWV review path.",
        ],
      },
    ],
  },
  {
    slug: "debt-payoff-priority",
    title: "Debt Payoff Priority Guide: Avalanche vs. Snowball",
    description:
      "Compare payoff order strategies and decide which debt deserves extra money first.",
    category: "Credit",
    calculatorLabel: "Open Debt Payoff Priority Ranker",
    calculatorHref: "/credit-calculators/debt-payoff-priority-ranker",
    disclaimer:
      "Educational estimate only. This is not financial, legal, or credit repair advice and does not guarantee savings or credit outcomes.",
    sections: [
      {
        heading: "Two ways to rank debt",
        body: [
          "Debt payoff strategy is not just about the largest balance. Avalanche prioritizes interest cost by attacking the highest APR first. Snowball prioritizes momentum by attacking the smallest balance first.",
          "Both approaches can be useful. The right one is the one you can follow consistently while staying current on required minimum payments.",
        ],
      },
      {
        heading: "How to use the ranker",
        body: [
          "Add each debt with its balance, APR, and minimum payment. Then choose a strategy and enter any extra monthly payment you can apply above minimums.",
          "The calculator turns the inputs into a clear payoff order so you can see where the next dollar may do the most work.",
        ],
      },
      {
        heading: "Credit context",
        body: [
          "If payoff decisions are connected to credit report issues, the next step may be a broader Credit Insight Intelligence review.",
        ],
      },
    ],
  },
  {
    slug: "real-estate-deal-snapshot",
    title: "Real Estate Deal Snapshot Guide: Cash Flow, Cap Rate, and DSCR",
    description:
      "Learn the core numbers investors review before going deeper on a rental deal.",
    category: "Real Estate",
    calculatorLabel: "Open Real Estate Deal Snapshot",
    calculatorHref: "/real-estate-calculators/deal-snapshot-calculator",
    disclaimer:
      "Educational estimate only. This does not guarantee investment performance, financing approval, rent, property value, or profitability.",
    sections: [
      {
        heading: "What a deal snapshot shows",
        body: [
          "Real estate investors need a fast way to see whether a rental property deserves deeper attention. Cash flow, cap rate, DSCR, vacancy, and expenses all matter before emotion gets involved.",
          "The snapshot gives you a first-pass view of whether the numbers deserve more due diligence.",
        ],
      },
      {
        heading: "How to read the results",
        body: [
          "Monthly cash flow shows whether rent may cover the estimated mortgage and operating expenses. Cap rate compares income to property price. DSCR compares net operating income to debt service.",
          "If the numbers are weak, you can move on quickly. If they are close or strong, HavenMIND can support deeper real estate decision planning.",
        ],
      },
      {
        heading: "What it does not replace",
        body: [
          "This calculator is not a replacement for underwriting, comps, inspections, lender guidance, or local market research.",
        ],
      },
    ],
  },
  {
    slug: "max-offer-arv",
    aliases: ["arv-max-offer"],
    title: "Max Offer & ARV Guide: How to Work Backward From the Deal",
    description:
      "Use ARV, rehab, holding costs, and profit targets to estimate a max allowable offer.",
    category: "Real Estate",
    calculatorLabel: "Open Max Offer & ARV Calculator",
    calculatorHref: "/real-estate-calculators/max-offer-arv-calculator",
    disclaimer:
      "Educational estimate only. This does not guarantee investment performance, financing approval, rent, property value, or profitability.",
    sections: [
      {
        heading: "Start from the future value",
        body: [
          "Max offer math works backward from the future value of the property. ARV, repairs, closing costs, holding costs, and profit target all shape what you can afford to pay today.",
          "This helps you avoid turning a promising property into a deal with no margin.",
        ],
      },
      {
        heading: "How the calculator helps",
        body: [
          "Enter the ARV, repair estimate, buying and selling costs, holding timeline, and desired profit. The calculator estimates a maximum allowable offer using the selected rule.",
          "Use the output before negotiating so your offer has a clear relationship to the risk and work involved.",
        ],
      },
      {
        heading: "Validate the assumptions",
        body: [
          "ARV should always be checked against comparable sales, local market conditions, and realistic rehab numbers.",
        ],
      },
    ],
  },
  {
    slug: "tip-and-tab-split",
    aliases: ["restaurant-tip-tab-split"],
    title: "Tip & Tab Split Guide: Split Restaurant Bills With Tax and Tip",
    description:
      "A simple utility guide for splitting checks, discounts, tax, and gratuity fairly.",
    category: "Utility",
    calculatorLabel: "Open Tip & Tab Split Calculator",
    calculatorHref: "/utility-calculators/tip-tab-split-calculator",
    sections: [
      {
        heading: "What the tool does",
        body: [
          "Tip & Tab Split helps split a bill with discounts, tax, tip, and number of people included.",
          "It is built for fast, fair even splits when the group wants a clear per-person total without doing receipt math at the table.",
        ],
      },
      {
        heading: "How to use it",
        body: [
          "Enter the bill amount, number of people, discount, tax percentage, and tip percentage. Choose whether the tip should be based on the pre-discount or post-discount subtotal.",
          "The calculator updates the total and per-person amount immediately so everyone can see the same number.",
        ],
      },
      {
        heading: "Receipt details to check",
        body: [
          "Always check the receipt for automatic gratuity, service fees, local tax differences, and discounts that may change the tip base.",
        ],
      },
    ],
  },
];

export const getAllGuides = (): Guide[] => GUIDES;

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug || guide.aliases?.includes(slug));
}
