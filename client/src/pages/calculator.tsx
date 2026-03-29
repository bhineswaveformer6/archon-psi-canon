import { useState, useMemo, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronDown, ChevronRight, Shield, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// ────────────────────────────────────────────────────────
// Operator types
// ────────────────────────────────────────────────────────
interface BusinessOps {
  description: string;
  circleOfCompetence: number; // 0-10
  moatType: string;
  moatStrength: number; // 0-10
}

interface EconomicsOps {
  roic: number;
  profitMargin: number;
  reinvestmentRate: number;
  capitalEfficiency: number;
}

interface CompoundingOps {
  cagrSubject: number;
  cagrBenchmark: number;
  maxDrawdown: number;
  years: number;
}

interface FloatOps {
  startFloat: number;
  endFloat: number;
  profitMargin: number;
  reinvestmentRate: number;
}

interface PeopleOps {
  ceoEquityPercent: number;
  holderMedianYears: number;
  insiderNetBuyScore: number; // 0-10
}

interface ErrorsOps {
  majorErrors: string;
  capitalAtRisk: number;
  capitalLost: number;
  designChanges: string;
  errorSeverity: number; // 0-1
  survivalRatio: number; // 0-1
}

const defaultBusiness: BusinessOps = { description: "", circleOfCompetence: 5, moatType: "brand", moatStrength: 5 };
const defaultEconomics: EconomicsOps = { roic: 0.15, profitMargin: 0.2, reinvestmentRate: 0.5, capitalEfficiency: 0.7 };
const defaultCompounding: CompoundingOps = { cagrSubject: 0.12, cagrBenchmark: 0.08, maxDrawdown: 0.3, years: 5 };
const defaultFloat: FloatOps = { startFloat: 1000000, endFloat: 1500000, profitMargin: 0.25, reinvestmentRate: 0.6 };
const defaultPeople: PeopleOps = { ceoEquityPercent: 5, holderMedianYears: 3, insiderNetBuyScore: 5 };
const defaultErrors: ErrorsOps = { majorErrors: "", capitalAtRisk: 0, capitalLost: 0, designChanges: "", errorSeverity: 0.1, survivalRatio: 0.1 };

export default function CalculatorPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Subject
  const [subjectName, setSubjectName] = useState("");
  const [subjectTicker, setSubjectTicker] = useState("");
  const [subjectKind, setSubjectKind] = useState("Company");
  const [subjectMarket, setSubjectMarket] = useState("");
  const [subjectSector, setSubjectSector] = useState("");

  // Operators
  const [business, setBusiness] = useState<BusinessOps>(defaultBusiness);
  const [economics, setEconomics] = useState<EconomicsOps>(defaultEconomics);
  const [compounding, setCompounding] = useState<CompoundingOps>(defaultCompounding);
  const [floatOps, setFloatOps] = useState<FloatOps>(defaultFloat);
  const [people, setPeople] = useState<PeopleOps>(defaultPeople);
  const [errors, setErrors] = useState<ErrorsOps>(defaultErrors);

  // Expanded accordions
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ business: true });

  const toggleAccordion = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ────── Computed Scores ──────
  const scores = useMemo(() => {
    // CSS = (CAGR_subject − CAGR_benchmark) / (1 + DD)
    const CSS = (compounding.cagrSubject - compounding.cagrBenchmark) / (1 + compounding.maxDrawdown);

    // NS = FloatCAGR × (1 + ProfitMargin) × ReinvestmentRate
    const floatCAGR = floatOps.endFloat > 0 && floatOps.startFloat > 0 && compounding.years > 0
      ? Math.pow(floatOps.endFloat / floatOps.startFloat, 1 / compounding.years) - 1
      : 0;
    const NS = floatCAGR * (1 + floatOps.profitMargin) * floatOps.reinvestmentRate;

    // BFS = DividendCAGR × log(1 + PaybackMultiple)
    const paybackMultiple = economics.roic > 0 ? 1 / economics.roic : 0;
    const dividendCAGR = compounding.cagrSubject * (1 - economics.reinvestmentRate);
    const BFS = dividendCAGR * Math.log(1 + paybackMultiple);

    // FS = Liquidity_% × (1 − RelDD)
    const relDD = compounding.maxDrawdown;
    const FS = economics.capitalEfficiency * (1 - relDD);

    // TBS = 0.4 × CEO_Equity_% + 0.3 × Holder_Years + 0.3 × Insider_Score
    const TBS = 0.4 * (people.ceoEquityPercent / 100) + 0.3 * (people.holderMedianYears / 10) + 0.3 * (people.insiderNetBuyScore / 10);

    // AFS = (1 − ErrorSeverity) × (1 − SurvivalRatio)
    const AFS = (1 - errors.errorSeverity) * (1 - errors.survivalRatio);

    // Map scores to 0-10 dimensions
    const dimBusiness = Math.min(10, Math.max(0, (business.circleOfCompetence + business.moatStrength) / 2));
    const dimEconomics = Math.min(10, Math.max(0, economics.roic * 30 + economics.profitMargin * 10));
    const dimManagement = Math.min(10, Math.max(0, TBS * 10));
    const dimMoat = Math.min(10, Math.max(0, business.moatStrength));
    const dimCompounding = Math.min(10, Math.max(0, CSS * 20 + 5));
    const dimValuation = Math.min(10, Math.max(0, FS * 10));
    const dimRisk = Math.min(10, Math.max(0, AFS * 10));

    // QTAC₇ = geometric mean of 7 dimensions (all clamped to min 0.1)
    const dims = [dimBusiness, dimEconomics, dimManagement, dimMoat, dimCompounding, dimValuation, dimRisk].map(d => Math.max(0.1, d));
    const qtac7 = Math.pow(dims.reduce((a, b) => a * b, 1), 1 / 7);

    // PINK risk deflator (simple: average of error severity + inverse survival)
    const PINK = (errors.errorSeverity + (1 - errors.survivalRatio)) / 2;

    // StoneScore = Σ Wi × Mi / (1 + PINK)
    const weights = [0.2, 0.15, 0.15, 0.15, 0.15, 0.1, 0.1];
    const dimArr = [dimBusiness, dimEconomics, dimManagement, dimMoat, dimCompounding, dimValuation, dimRisk];
    const weightedSum = weights.reduce((s, w, i) => s + w * dimArr[i], 0);
    const stoneScore = weightedSum / (1 + PINK);

    // Omega Gap = QTAC₇ − StoneScore
    const omegaGap = qtac7 - stoneScore;

    // Recommendation
    let recommendation = "HOLD";
    let verdictText = "Neutral position — monitor conditions.";
    if (stoneScore >= 7) {
      recommendation = "BUY";
      verdictText = "Strong conviction — fundamentals align across all dimensions.";
    } else if (stoneScore >= 5) {
      recommendation = "HOLD";
      verdictText = "Moderate conviction — some dimensions underperform.";
    } else {
      recommendation = "SELL";
      verdictText = "Weak conviction — significant risk factors present.";
    }

    return {
      CSS, NS, BFS, FS, TBS, AFS,
      dimBusiness, dimEconomics, dimManagement, dimMoat, dimCompounding, dimValuation, dimRisk,
      qtac7, PINK, stoneScore, omegaGap,
      recommendation, verdictText,
    };
  }, [business, economics, compounding, floatOps, people, errors]);

  // Seal mutation
  const sealMutation = useMutation({
    mutationFn: async () => {
      const body = {
        subjectName,
        subjectTicker: subjectTicker || null,
        subjectKind,
        subjectMarket: subjectMarket || null,
        subjectSector: subjectSector || null,
        operators: JSON.stringify({ business, economics, compounding, float: floatOps, people, errors }),
        qtac7Score: scores.qtac7,
        qtac7Pink: scores.PINK,
        qtac7OmegaGap: scores.omegaGap,
        dimBusiness: scores.dimBusiness,
        dimEconomics: scores.dimEconomics,
        dimManagement: scores.dimManagement,
        dimMoat: scores.dimMoat,
        dimCompounding: scores.dimCompounding,
        dimValuation: scores.dimValuation,
        dimRisk: scores.dimRisk,
        stoneScore: scores.stoneScore,
        verdictText: scores.verdictText,
        recommendation: scores.recommendation,
      };
      const res = await apiRequest("POST", "/api/verdicts", body);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/verdicts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/canon-blocks"] });
      toast({ title: "Verdict Sealed", description: `Block #${data.blockNumber} · Hash: ${data.canonHash?.slice(0, 12)}…` });
      navigate(`/mastercard/${data.id}`);
    },
    onError: (err: Error) => {
      toast({ title: "Seal Failed", description: err.message, variant: "destructive" });
    },
  });

  const canSeal = subjectName.length > 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-serif italic text-foreground" data-testid="text-calculator-title">
          ARCHON Calculator
        </h1>
        <p className="text-sm font-mono text-muted-foreground mt-1">
          Compute StoneScore, QTAC₇, and seal verdicts to the Canon
        </p>
      </div>

      {/* Subject Form */}
      <div className="border border-border rounded-lg bg-card p-5" data-testid="subject-form">
        <div className="border-t-2 border-primary -mt-5 -mx-5 mb-5 rounded-t-lg" />
        <h2 className="font-serif italic text-base mb-4 text-foreground">Subject</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="font-mono text-xs text-muted-foreground">Name</Label>
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g. Berkshire Hathaway"
              className="font-mono mt-1"
              data-testid="input-subject-name"
            />
          </div>
          <div>
            <Label className="font-mono text-xs text-muted-foreground">Ticker</Label>
            <Input
              value={subjectTicker}
              onChange={(e) => setSubjectTicker(e.target.value)}
              placeholder="BRK.B"
              className="font-mono mt-1"
              data-testid="input-subject-ticker"
            />
          </div>
          <div>
            <Label className="font-mono text-xs text-muted-foreground">Kind</Label>
            <Select value={subjectKind} onValueChange={setSubjectKind}>
              <SelectTrigger className="font-mono mt-1" data-testid="select-subject-kind">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Person">Person</SelectItem>
                <SelectItem value="Nation">Nation</SelectItem>
                <SelectItem value="Asset">Asset</SelectItem>
                <SelectItem value="Protocol">Protocol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-mono text-xs text-muted-foreground">Market</Label>
            <Input
              value={subjectMarket}
              onChange={(e) => setSubjectMarket(e.target.value)}
              placeholder="NYSE"
              className="font-mono mt-1"
              data-testid="input-subject-market"
            />
          </div>
          <div>
            <Label className="font-mono text-xs text-muted-foreground">Sector</Label>
            <Input
              value={subjectSector}
              onChange={(e) => setSubjectSector(e.target.value)}
              placeholder="Financial Services"
              className="font-mono mt-1"
              data-testid="input-subject-sector"
            />
          </div>
        </div>
      </div>

      {/* 6 Operator Accordions */}
      <div className="space-y-3">
        {/* 1. BusinessBlock */}
        <AccordionPanel title="BusinessBlock" score={`DIM: ${scores.dimBusiness.toFixed(2)}`} expanded={!!expanded.business} onToggle={() => toggleAccordion("business")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-mono text-xs text-muted-foreground">Business Description</Label>
              <Textarea
                value={business.description}
                onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                placeholder="Describe the business model..."
                className="font-mono mt-1 h-20"
                data-testid="input-business-description"
              />
            </div>
            <NumericField label="Circle of Competence (0-10)" value={business.circleOfCompetence} onChange={(v) => setBusiness({ ...business, circleOfCompetence: v })} testId="input-circle-competence" />
            <div>
              <Label className="font-mono text-xs text-muted-foreground">Moat Type</Label>
              <Select value={business.moatType} onValueChange={(v) => setBusiness({ ...business, moatType: v })}>
                <SelectTrigger className="font-mono mt-1" data-testid="select-moat-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="network">Network Effect</SelectItem>
                  <SelectItem value="cost">Cost Advantage</SelectItem>
                  <SelectItem value="switching">Switching Costs</SelectItem>
                  <SelectItem value="intangible">Intangible Assets</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <NumericField label="Moat Strength (0-10)" value={business.moatStrength} onChange={(v) => setBusiness({ ...business, moatStrength: v })} testId="input-moat-strength" />
          </div>
        </AccordionPanel>

        {/* 2. EconomicsBlock */}
        <AccordionPanel title="EconomicsBlock" score={`DIM: ${scores.dimEconomics.toFixed(2)}`} expanded={!!expanded.economics} onToggle={() => toggleAccordion("economics")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumericField label="ROIC" value={economics.roic} onChange={(v) => setEconomics({ ...economics, roic: v })} step={0.01} testId="input-roic" />
            <NumericField label="Profit Margin" value={economics.profitMargin} onChange={(v) => setEconomics({ ...economics, profitMargin: v })} step={0.01} testId="input-profit-margin" />
            <NumericField label="Reinvestment Rate" value={economics.reinvestmentRate} onChange={(v) => setEconomics({ ...economics, reinvestmentRate: v })} step={0.01} testId="input-reinvestment-rate" />
            <NumericField label="Capital Efficiency" value={economics.capitalEfficiency} onChange={(v) => setEconomics({ ...economics, capitalEfficiency: v })} step={0.01} testId="input-capital-efficiency" />
          </div>
        </AccordionPanel>

        {/* 3. CompoundingBlock */}
        <AccordionPanel title="CompoundingBlock" score={`CSS: ${scores.CSS.toFixed(4)}`} expanded={!!expanded.compounding} onToggle={() => toggleAccordion("compounding")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumericField label="CAGR (Subject)" value={compounding.cagrSubject} onChange={(v) => setCompounding({ ...compounding, cagrSubject: v })} step={0.01} testId="input-cagr-subject" />
            <NumericField label="CAGR (Benchmark)" value={compounding.cagrBenchmark} onChange={(v) => setCompounding({ ...compounding, cagrBenchmark: v })} step={0.01} testId="input-cagr-benchmark" />
            <NumericField label="Max Drawdown" value={compounding.maxDrawdown} onChange={(v) => setCompounding({ ...compounding, maxDrawdown: v })} step={0.01} testId="input-max-drawdown" />
            <NumericField label="Years" value={compounding.years} onChange={(v) => setCompounding({ ...compounding, years: v })} testId="input-years" />
          </div>
        </AccordionPanel>

        {/* 4. FloatBlock */}
        <AccordionPanel title="FloatBlock" score={`NS: ${scores.NS.toFixed(4)}`} expanded={!!expanded.float} onToggle={() => toggleAccordion("float")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumericField label="Start Float" value={floatOps.startFloat} onChange={(v) => setFloatOps({ ...floatOps, startFloat: v })} testId="input-start-float" />
            <NumericField label="End Float" value={floatOps.endFloat} onChange={(v) => setFloatOps({ ...floatOps, endFloat: v })} testId="input-end-float" />
            <NumericField label="Profit Margin" value={floatOps.profitMargin} onChange={(v) => setFloatOps({ ...floatOps, profitMargin: v })} step={0.01} testId="input-float-profit-margin" />
            <NumericField label="Reinvestment Rate" value={floatOps.reinvestmentRate} onChange={(v) => setFloatOps({ ...floatOps, reinvestmentRate: v })} step={0.01} testId="input-float-reinvestment" />
          </div>
        </AccordionPanel>

        {/* 5. PeopleBlock */}
        <AccordionPanel title="PeopleBlock" score={`TBS: ${scores.TBS.toFixed(4)}`} expanded={!!expanded.people} onToggle={() => toggleAccordion("people")}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumericField label="CEO Equity %" value={people.ceoEquityPercent} onChange={(v) => setPeople({ ...people, ceoEquityPercent: v })} step={0.1} testId="input-ceo-equity" />
            <NumericField label="Holder Median Years" value={people.holderMedianYears} onChange={(v) => setPeople({ ...people, holderMedianYears: v })} step={0.1} testId="input-holder-years" />
            <NumericField label="Insider Net Buy Score (0-10)" value={people.insiderNetBuyScore} onChange={(v) => setPeople({ ...people, insiderNetBuyScore: v })} testId="input-insider-score" />
          </div>
        </AccordionPanel>

        {/* 6. ErrorsBlock */}
        <AccordionPanel title="ErrorsBlock" score={`AFS: ${scores.AFS.toFixed(4)}`} expanded={!!expanded.errors} onToggle={() => toggleAccordion("errors")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="font-mono text-xs text-muted-foreground">Major Errors</Label>
              <Textarea
                value={errors.majorErrors}
                onChange={(e) => setErrors({ ...errors, majorErrors: e.target.value })}
                placeholder="List any major business errors..."
                className="font-mono mt-1 h-16"
                data-testid="input-major-errors"
              />
            </div>
            <NumericField label="Capital at Risk" value={errors.capitalAtRisk} onChange={(v) => setErrors({ ...errors, capitalAtRisk: v })} testId="input-capital-risk" />
            <NumericField label="Capital Lost" value={errors.capitalLost} onChange={(v) => setErrors({ ...errors, capitalLost: v })} testId="input-capital-lost" />
            <NumericField label="Error Severity (0-1)" value={errors.errorSeverity} onChange={(v) => setErrors({ ...errors, errorSeverity: v })} step={0.01} testId="input-error-severity" />
            <NumericField label="Survival Ratio (0-1)" value={errors.survivalRatio} onChange={(v) => setErrors({ ...errors, survivalRatio: v })} step={0.01} testId="input-survival-ratio" />
            <div className="md:col-span-2">
              <Label className="font-mono text-xs text-muted-foreground">Design Changes</Label>
              <Textarea
                value={errors.designChanges}
                onChange={(e) => setErrors({ ...errors, designChanges: e.target.value })}
                placeholder="Describe any design changes..."
                className="font-mono mt-1 h-16"
                data-testid="input-design-changes"
              />
            </div>
          </div>
        </AccordionPanel>
      </div>

      {/* Computed Scores Dashboard */}
      <div className="border border-border rounded-lg bg-card p-5" data-testid="computed-scores">
        <div className="border-t-2 border-primary -mt-5 -mx-5 mb-5 rounded-t-lg" />
        <h2 className="font-serif italic text-base mb-4 text-foreground">Computed Scores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <ScoreCell label="QTAC₇" value={scores.qtac7.toFixed(3)} highlight />
          <ScoreCell label="StoneScore" value={scores.stoneScore.toFixed(3)} highlight />
          <ScoreCell label="PINK" value={scores.PINK.toFixed(3)} />
          <ScoreCell label="Ω Gap" value={scores.omegaGap.toFixed(3)} />
        </div>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-6">
          <DimCell label="BUS" value={scores.dimBusiness} />
          <DimCell label="ECO" value={scores.dimEconomics} />
          <DimCell label="MGT" value={scores.dimManagement} />
          <DimCell label="MOAT" value={scores.dimMoat} />
          <DimCell label="CMP" value={scores.dimCompounding} />
          <DimCell label="VAL" value={scores.dimValuation} />
          <DimCell label="RSK" value={scores.dimRisk} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <ScoreCell label="CSS" value={scores.CSS.toFixed(4)} />
          <ScoreCell label="NS" value={scores.NS.toFixed(4)} />
          <ScoreCell label="BFS" value={scores.BFS.toFixed(4)} />
          <ScoreCell label="FS" value={scores.FS.toFixed(4)} />
          <ScoreCell label="TBS" value={scores.TBS.toFixed(4)} />
          <ScoreCell label="AFS" value={scores.AFS.toFixed(4)} />
        </div>

        {/* Recommendation */}
        <div className="border border-border rounded-md p-4 bg-background/50 flex items-center justify-between" data-testid="recommendation-display">
          <div>
            <p className="font-mono text-xs text-muted-foreground mb-1">RECOMMENDATION</p>
            <p className="font-serif text-sm text-foreground">{scores.verdictText}</p>
          </div>
          <span
            className={`font-mono text-lg font-semibold px-4 py-1 rounded border ${
              scores.recommendation === "BUY"
                ? "text-green-400 border-green-400/30"
                : scores.recommendation === "SELL"
                ? "text-red-400 border-red-400/30"
                : "text-primary border-primary/30"
            }`}
            data-testid="text-recommendation"
          >
            {scores.recommendation}
          </span>
        </div>
      </div>

      {/* Seal Button */}
      <Button
        onClick={() => sealMutation.mutate()}
        disabled={!canSeal || sealMutation.isPending}
        className="w-full h-12 font-mono text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90"
        data-testid="button-seal-canon"
      >
        <Lock size={16} className="mr-2" />
        {sealMutation.isPending ? "SEALING..." : "SEAL TO CANON"}
      </Button>
    </div>
  );
}

// ── Reusable Components ──

function AccordionPanel({
  title,
  score,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  score: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden" data-testid={`accordion-${title.toLowerCase()}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
        data-testid={`button-toggle-${title.toLowerCase()}`}
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />}
          <span className="font-mono text-sm text-foreground">{title}</span>
        </div>
        <span className="font-mono text-xs text-primary">{score}</span>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

function NumericField({
  label,
  value,
  onChange,
  step = 1,
  testId,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  testId: string;
}) {
  return (
    <div>
      <Label className="font-mono text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="font-mono mt-1"
        data-testid={testId}
      />
    </div>
  );
}

function ScoreCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`border rounded-md p-3 text-center ${highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}>
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`font-mono text-lg font-medium mt-1 ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function DimCell({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  return (
    <div className="text-center">
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="font-mono text-xs text-foreground">{value.toFixed(1)}</p>
    </div>
  );
}
