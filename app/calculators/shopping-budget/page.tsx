/** Shopping Budget Calculator page route */

import ShoppingBudget from "@/components/shopping-budget-calc";

export const metadata = {
    title: "Shopping Budget Calculator",
    description: "Plan your cart, include tax, and stay under budget with live remaining and progress.",
};

export default function Page() {
    return <ShoppingBudget />;
}