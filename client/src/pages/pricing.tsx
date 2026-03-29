import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Explore the Canon with limited verdicts.",
    features: [
      "3 verdicts per month",
      "Basic Canon Ledger view",
      "QTAC₇ & StoneScore computation",
      "Single user",
    ],
    cta: "Current Plan",
    highlighted: false,
    disabled: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Full ARCHON power. Unlimited sealing.",
    features: [
      "Unlimited verdicts",
      "Full Canon Ledger + hash chain",
      "BuffettMasterCards export",
      "DailyBlocks ritual",
      "Priority computation",
      "CSV & PDF export",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
    disabled: false,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "Team canons, API access, custom operators.",
    features: [
      "Everything in Pro",
      "Team Canon ledgers",
      "REST API access",
      "Custom operator blocks",
      "Dedicated support",
      "SSO & role management",
      "Audit trail export",
    ],
    cta: "Contact Sales",
    highlighted: false,
    disabled: false,
  },
];

export default function PricingPage() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-3 pb-4">
        <div className="flex items-center justify-center gap-2">
          <Zap size={18} className="text-primary" />
          <h1 className="text-xl font-serif italic text-foreground" data-testid="text-pricing-title">
            Pricing
          </h1>
        </div>
        <p className="text-sm font-mono text-muted-foreground max-w-lg mx-auto">
          Choose the tier that fits your verdict workflow. Upgrade anytime.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`border rounded-lg bg-card flex flex-col ${
              tier.highlighted ? "border-primary" : "border-border"
            }`}
            data-testid={`pricing-tier-${tier.name.toLowerCase()}`}
          >
            {tier.highlighted && (
              <div className="border-t-2 border-primary rounded-t-lg" />
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-6">
                <h2 className="font-mono text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  {tier.name}
                </h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-medium text-foreground">{tier.price}</span>
                  <span className="font-mono text-sm text-muted-foreground">{tier.period}</span>
                </div>
                <p className="font-serif text-sm text-muted-foreground mt-2 italic">
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-sm font-mono text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                disabled={tier.disabled}
                className={`w-full font-mono text-sm tracking-wider ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }`}
                variant={tier.highlighted ? "default" : "outline"}
                data-testid={`button-${tier.name.toLowerCase()}-cta`}
              >
                {tier.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="text-center">
        <p className="font-mono text-xs text-muted-foreground">
          All plans include SHA-256 hash chain verification · ISO 8601 timestamps · Immutable ledger
        </p>
      </div>
    </div>
  );
}
