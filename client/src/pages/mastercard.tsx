import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ChevronDown, ChevronRight, ArrowLeft, Shield, Clock, Hash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Verdict } from "@shared/schema";

export default function MasterCardPage() {
  const [, params] = useRoute("/mastercard/:id");
  const verdictId = params?.id;

  const { data: verdict, isLoading } = useQuery<Verdict>({
    queryKey: ["/api/verdicts", verdictId],
    enabled: !!verdictId,
  });

  const [layer2Open, setLayer2Open] = useState(false);
  const [layer3Open, setLayer3Open] = useState(false);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!verdict) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto text-center">
        <span className="text-3xl text-primary/30 block mb-2">Ψ</span>
        <p className="text-sm text-muted-foreground font-mono">Verdict not found.</p>
        <Link href="/">
          <span className="text-sm font-mono text-primary hover:underline cursor-pointer mt-2 inline-block">
            ← Back to Dashboard
          </span>
        </Link>
      </div>
    );
  }

  const operators = JSON.parse(verdict.operators || "{}");
  const conditions: string[] = verdict.conditions ? JSON.parse(verdict.conditions) : [];

  // Score gauge (0-10 scale mapped to percentage)
  const gaugePercent = (verdict.stoneScore / 10) * 100;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/canon">
        <span className="flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="link-back-canon">
          <ArrowLeft size={14} /> Canon Ledger
        </span>
      </Link>

      {/* Layer 1: Summary */}
      <div className="border border-border rounded-lg bg-card overflow-hidden" data-testid="mastercard-layer1">
        <div className="border-t-2 border-primary" />
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-xl font-serif italic text-foreground" data-testid="text-subject-name">
                {verdict.subjectName}
              </h1>
              {verdict.subjectTicker && (
                <p className="font-mono text-sm text-muted-foreground mt-1">{verdict.subjectTicker}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground">
                  {verdict.subjectKind}
                </span>
                {verdict.subjectMarket && (
                  <span className="font-mono text-[10px] text-muted-foreground">{verdict.subjectMarket}</span>
                )}
                {verdict.subjectSector && (
                  <span className="font-mono text-[10px] text-muted-foreground">· {verdict.subjectSector}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`font-mono text-lg font-semibold px-4 py-1 rounded border ${
                  verdict.recommendation === "BUY"
                    ? "text-green-400 border-green-400/30"
                    : verdict.recommendation === "SELL"
                    ? "text-red-400 border-red-400/30"
                    : "text-primary border-primary/30"
                }`}
                data-testid="text-recommendation-badge"
              >
                {verdict.recommendation}
              </span>
            </div>
          </div>

          {/* Score Gauge */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-muted-foreground">STONESCORE</span>
              <span className="font-mono text-lg text-primary font-medium" data-testid="text-stone-score">
                {verdict.stoneScore.toFixed(3)}
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${gaugePercent}%` }}
              />
            </div>
          </div>

          {/* Key Scores Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center border border-border rounded-md p-3">
              <p className="font-mono text-[10px] text-muted-foreground">QTAC₇</p>
              <p className="font-mono text-lg text-foreground font-medium" data-testid="text-qtac7">
                {verdict.qtac7Score.toFixed(3)}
              </p>
            </div>
            <div className="text-center border border-border rounded-md p-3">
              <p className="font-mono text-[10px] text-muted-foreground">PINK</p>
              <p className="font-mono text-lg text-foreground font-medium">{verdict.qtac7Pink.toFixed(3)}</p>
            </div>
            <div className="text-center border border-border rounded-md p-3">
              <p className="font-mono text-[10px] text-muted-foreground">Ω GAP</p>
              <p className="font-mono text-lg text-foreground font-medium">{verdict.qtac7OmegaGap.toFixed(3)}</p>
            </div>
          </div>

          <p className="font-serif text-sm text-muted-foreground mt-4 italic" data-testid="text-verdict">
            {verdict.verdictText}
          </p>
        </div>
      </div>

      {/* Layer 2: Operator Details */}
      <div className="border border-border rounded-lg bg-card overflow-hidden" data-testid="mastercard-layer2">
        <button
          onClick={() => setLayer2Open(!layer2Open)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
          data-testid="button-toggle-layer2"
        >
          <div className="flex items-center gap-2">
            {layer2Open ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />}
            <Shield size={14} className="text-primary" />
            <span className="font-mono text-sm text-foreground">Operator Details</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">7 DIMENSIONS</span>
        </button>

        {layer2Open && (
          <div className="border-t border-border p-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DimDisplay label="Business" value={verdict.dimBusiness} />
              <DimDisplay label="Economics" value={verdict.dimEconomics} />
              <DimDisplay label="Management" value={verdict.dimManagement} />
              <DimDisplay label="Moat" value={verdict.dimMoat} />
              <DimDisplay label="Compounding" value={verdict.dimCompounding} />
              <DimDisplay label="Valuation" value={verdict.dimValuation} />
              <DimDisplay label="Risk" value={verdict.dimRisk} />
            </div>

            {/* Operator Breakdown */}
            {operators.business && (
              <OperatorSection title="BusinessBlock">
                <p className="text-sm text-foreground">{operators.business.description || "—"}</p>
                <div className="flex gap-4 mt-2 text-xs font-mono text-muted-foreground">
                  <span>CoC: {operators.business.circleOfCompetence}/10</span>
                  <span>Moat: {operators.business.moatType} ({operators.business.moatStrength}/10)</span>
                </div>
              </OperatorSection>
            )}
            {operators.economics && (
              <OperatorSection title="EconomicsBlock">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                  <span>ROIC: {(operators.economics.roic * 100).toFixed(1)}%</span>
                  <span>Margin: {(operators.economics.profitMargin * 100).toFixed(1)}%</span>
                  <span>Reinvest: {(operators.economics.reinvestmentRate * 100).toFixed(1)}%</span>
                  <span>CapEff: {(operators.economics.capitalEfficiency * 100).toFixed(1)}%</span>
                </div>
              </OperatorSection>
            )}
            {operators.compounding && (
              <OperatorSection title="CompoundingBlock">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
                  <span>CAGR: {(operators.compounding.cagrSubject * 100).toFixed(1)}%</span>
                  <span>Bench: {(operators.compounding.cagrBenchmark * 100).toFixed(1)}%</span>
                  <span>DD: {(operators.compounding.maxDrawdown * 100).toFixed(1)}%</span>
                  <span>Years: {operators.compounding.years}</span>
                </div>
              </OperatorSection>
            )}
            {operators.people && (
              <OperatorSection title="PeopleBlock">
                <div className="grid grid-cols-3 gap-2 text-xs font-mono text-muted-foreground">
                  <span>CEO: {operators.people.ceoEquityPercent}%</span>
                  <span>Hold: {operators.people.holderMedianYears}y</span>
                  <span>Insider: {operators.people.insiderNetBuyScore}/10</span>
                </div>
              </OperatorSection>
            )}
          </div>
        )}
      </div>

      {/* Layer 3: Canon Metadata */}
      <div className="border border-border rounded-lg bg-card overflow-hidden" data-testid="mastercard-layer3">
        <button
          onClick={() => setLayer3Open(!layer3Open)}
          className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
          data-testid="button-toggle-layer3"
        >
          <div className="flex items-center gap-2">
            {layer3Open ? <ChevronDown size={14} className="text-primary" /> : <ChevronRight size={14} className="text-muted-foreground" />}
            <Hash size={14} className="text-primary" />
            <span className="font-mono text-sm text-foreground">Canon Metadata</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">SHA-256</span>
        </button>

        {layer3Open && (
          <div className="border-t border-border p-5 space-y-3">
            <MetaRow label="Block #" value={`${verdict.blockNumber}`} />
            <MetaRow label="Canon Hash" value={verdict.canonHash} mono />
            <MetaRow label="Prev Hash" value={verdict.prevHash} mono />
            <MetaRow label="Sealed" value={new Date(verdict.timestamp).toLocaleString()} />
            {verdict.retrialDate && <MetaRow label="Retrial Date" value={verdict.retrialDate} />}
            {verdict.retrialStatus && <MetaRow label="Retrial Status" value={verdict.retrialStatus} />}
            {conditions.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Conditions</p>
                <ul className="list-disc list-inside text-sm font-mono text-foreground space-y-1">
                  {conditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DimDisplay({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  return (
    <div className="border border-border rounded-md p-2">
      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="font-mono text-sm text-foreground text-right">{value.toFixed(2)}</p>
    </div>
  );
}

function OperatorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary/30 pl-4">
      <p className="font-mono text-xs text-primary mb-1">{title}</p>
      {children}
    </div>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-sm text-foreground text-right break-all ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
