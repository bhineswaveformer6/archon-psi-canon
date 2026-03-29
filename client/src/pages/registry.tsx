import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MasterCard } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";

// ── Status badge colors ──
function statusColor(status: string) {
  switch (status) {
    case "PROTO":
      return "bg-gray-100 text-gray-600 border-gray-300";
    case "META":
      return "bg-amber-50 text-amber-700 border-amber-300";
    case "VERIFIED":
      return "bg-sky-50 text-sky-700 border-sky-300";
    case "SOVEREIGN":
      return "bg-amber-50 text-[#c8a96e] border-[#c8a96e]";
    default:
      return "bg-gray-100 text-gray-600 border-gray-300";
  }
}

function statusDot(status: string) {
  switch (status) {
    case "PROTO":
      return "bg-gray-400";
    case "META":
      return "bg-amber-500";
    case "VERIFIED":
      return "bg-sky-500";
    case "SOVEREIGN":
      return "bg-[#c8a96e]";
    default:
      return "bg-gray-400";
  }
}

// ── Master Card Component ──
function MasterCardItem({ card }: { card: MasterCard }) {
  const [hovered, setHovered] = useState(false);
  const tags: string[] = JSON.parse(card.tags || "[]");
  const isSovereign = card.status === "SOVEREIGN";

  const shareText = `${card.name} is a ${card.status} Master on the ARCHON Registry. QTAC₇: ${card.qtac7}. cortexchain.io/masters/${card.code}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`https://cortexchain.io/masters/${card.code}`);
  };

  const handleShareX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  return (
    <div
      data-testid={`card-master-${card.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 w-[300px] bg-white rounded-lg border border-[#E5E7EB] transition-all duration-150 ease-out cursor-default select-none"
      style={{
        borderTop: isSovereign ? "2px solid #c8a96e" : undefined,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.08)"
          : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-5">
        {/* Code & Domain */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[0.1em] text-gray-400 uppercase">
            {card.code} · {card.domain}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusColor(card.status)}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot(card.status)}`} />
            {card.status}
          </span>
        </div>

        {/* Name & Role */}
        <h3 className="font-serif text-lg font-normal text-gray-900 leading-tight">
          {card.name}
        </h3>
        <p className="font-mono text-[11px] text-gray-400 mt-0.5">{card.role}</p>

        {/* Hover quote */}
        <div
          className="overflow-hidden transition-all duration-200"
          style={{
            maxHeight: hovered ? "40px" : "0px",
            opacity: hovered ? 1 : 0,
            marginTop: hovered ? "6px" : "0px",
          }}
        >
          <p className="font-serif italic text-[12px] text-gray-500">
            "{card.hoverQuote}"
          </p>
        </div>

        {/* QTAC₇ Score */}
        <div className="mt-4 mb-3">
          <span className="font-mono text-[10px] text-gray-400 tracking-wider uppercase block mb-0.5">
            QTAC₇
          </span>
          <span className="font-mono text-2xl font-bold text-[#c8a96e]">
            {card.qtac7.toFixed(1)}
          </span>
        </div>

        {/* Thesis */}
        <p className="font-mono text-[11px] text-gray-500 leading-relaxed mb-3">
          {card.thesis}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full font-mono text-[10px] text-gray-500 border border-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Share chips */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={handleCopyUrl}
            data-testid={`button-copy-url-${card.id}`}
            className="px-2.5 py-1 rounded font-mono text-[10px] text-gray-400 border border-gray-200 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            Copy URL
          </button>
          <button
            onClick={handleShareX}
            data-testid={`button-share-x-${card.id}`}
            className="px-2.5 py-1 rounded font-mono text-[10px] text-gray-400 border border-gray-200 hover:border-gray-300 hover:text-gray-600 transition-colors"
          >
            Share to X
          </button>
        </div>
      </div>
    </div>
  );
}

// ── OPERATOR Mode ──
function OperatorMode() {
  const slots = [
    "Operating Edge",
    "Compounding Motion",
    "Pattern Library",
    "Proof of Repeatability",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* Left: Identity */}
          <div className="p-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[10px] text-gray-300">AVATAR</span>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-1.5 font-serif text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#c8a96e]/40"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    placeholder="Your role"
                    className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-1.5 font-mono text-xs text-gray-500 placeholder:text-gray-300 focus:outline-none focus:border-[#c8a96e]/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: ARCHON Ψ Band */}
          <div className="p-8">
            <div className="mb-6">
              <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                QTAC₇
              </span>
              <span className="font-mono text-3xl text-gray-300">—.—</span>
              <span className="font-mono text-[10px] text-gray-300 ml-2">
                (awaiting data)
              </span>
            </div>

            <p className="font-mono text-[11px] text-gray-400 mb-5">
              1 Metric That Matters: We'll compute this from your live footprint.
            </p>

            <div className="space-y-2.5">
              {slots.map((slot, i) => (
                <div
                  key={slot}
                  className="flex items-center gap-3 px-3 py-2.5 rounded bg-gray-50 border border-gray-100"
                >
                  <span className="font-mono text-[10px] text-gray-300 w-4">
                    {i + 1}.
                  </span>
                  <span className="font-mono text-[11px] text-gray-300">
                    {slot}
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-gray-300 uppercase tracking-wider">
                    Locked
                  </span>
                </div>
              ))}
            </div>

            <Link href="/calculator">
              <button
                data-testid="button-complete-mastercard"
                className="mt-6 w-full py-2.5 rounded border border-[#c8a96e] text-[#c8a96e] font-mono text-xs tracking-wider hover:bg-[#c8a96e]/5 transition-colors"
                style={{ boxShadow: "inset 0 1px 0 rgba(200,169,110,0.15)" }}
              >
                Complete My MasterCard →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MARKET Mode (Bloomberg Ticker) ──
function MarketMode({ masters }: { masters: MasterCard[] }) {
  const tickerRef = useRef<HTMLDivElement>(null);

  const tickerItems = masters.map((m) => {
    const arrow = m.qtac7 >= 9.4 ? "↑" : m.qtac7 >= 9.2 ? "→" : "↓";
    return `${m.code} ${m.name.split(" ")[0].toUpperCase()} · ${m.qtac7.toFixed(1)} ${arrow}`;
  });

  const tickerText = tickerItems.join("   ·   ");

  return (
    <div className="max-w-5xl mx-auto">
      {/* Label */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">
          ARCHON Ψ Human Capital Exchange — Real-Time
        </span>
      </div>

      {/* Ticker Strip */}
      <div className="bg-gray-900 rounded-md overflow-hidden mb-8">
        <div className="relative overflow-hidden py-3 px-4">
          <div
            ref={tickerRef}
            className="flex whitespace-nowrap animate-ticker"
          >
            {[0, 1, 2].map((rep) => (
              <span
                key={rep}
                className="font-mono text-sm text-green-400 tracking-wider mr-16"
              >
                {tickerText}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left font-mono text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3">
                Code
              </th>
              <th className="text-left font-mono text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3">
                Name
              </th>
              <th className="text-right font-mono text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3">
                QTAC₇
              </th>
              <th className="text-center font-mono text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left font-mono text-[10px] text-gray-400 uppercase tracking-wider px-5 py-3">
                1MTM
              </th>
            </tr>
          </thead>
          <tbody>
            {masters.map((m) => (
              <tr
                key={m.id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                data-testid={`row-master-${m.id}`}
              >
                <td className="px-5 py-3 font-mono text-xs text-gray-500">
                  {m.code}
                </td>
                <td className="px-5 py-3">
                  <span className="font-serif text-sm text-gray-900">
                    {m.name}
                  </span>
                  <span className="font-mono text-[10px] text-gray-400 ml-2">
                    {m.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-right font-mono text-sm font-bold text-[#c8a96e]">
                  {m.qtac7.toFixed(1)}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${statusColor(m.status)}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(m.status)}`} />
                    {m.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-[11px] text-gray-400">
                  {m.metricThatMatters || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Signal Box ──
function SignalBox() {
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(-1);
  const steps = [
    "Ingesting signal...",
    "Mapping frameworks...",
    "Calculating QTAC₇...",
    "Extracting the One Metric That Matters...",
  ];

  const handleGenerate = () => {
    if (!input.trim()) return;
    setProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          window.location.hash = "#/calculator";
        }, 800);
      } else {
        setProgress(step);
      }
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2">
          Signal Box
        </p>
        <h3 className="font-serif text-lg text-gray-900 mb-1">
          Paste a company, we turn it into a sovereign-grade card.
        </h3>
        <p className="font-mono text-[11px] text-gray-400 mb-6">
          Enter a company name or URL to generate an ARCHON analysis.
        </p>

        {progress < 0 ? (
          <div className="space-y-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Apple, Tesla, or a company URL..."
              className="bg-gray-50 border-gray-200 font-mono text-xs resize-none h-20 focus:border-[#c8a96e]/40 text-gray-700 placeholder:text-gray-300"
              data-testid="input-signal-box"
            />
            <button
              onClick={handleGenerate}
              data-testid="button-generate-card"
              className="w-full py-2.5 rounded bg-gray-900 text-white font-mono text-xs tracking-wider hover:bg-gray-800 transition-colors"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              Generate Card
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-3 transition-all duration-300"
                style={{ opacity: i <= progress ? 1 : 0.25 }}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono transition-colors ${
                    i < progress
                      ? "bg-[#c8a96e] text-white"
                      : i === progress
                        ? "bg-[#c8a96e]/20 text-[#c8a96e] animate-pulse"
                        : "bg-gray-100 text-gray-300"
                  }`}
                >
                  {i < progress ? "✓" : i + 1}
                </div>
                <span className="font-mono text-xs text-gray-600">{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Viral Ingest Widget ──
function IngestWidget() {
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [progress, setProgress] = useState(-1);
  const [result, setResult] = useState<{ simulatedQtac7: number } | null>(null);
  const { toast } = useToast();

  const steps = [
    "Scanning LinkedIn profile...",
    "Mapping signal graph...",
    "Running QTAC₇ engine...",
    "Generating MasterCard draft...",
  ];

  const mutation = useMutation({
    mutationFn: async (data: { email: string; linkedinUrl: string }) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
      setProgress(-1);
    },
  });

  const handleSubmit = () => {
    if (!email.trim() || !linkedin.trim()) return;
    setProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        mutation.mutate({ email, linkedinUrl: linkedin });
      } else {
        setProgress(step);
      }
    }, 800);
  };

  if (result) {
    return (
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
        <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-4">
          Your QTAC₇ Score
        </p>
        <div className="text-center py-4">
          <span className="font-mono text-4xl font-bold text-[#c8a96e]">
            {result.simulatedQtac7.toFixed(1)}
          </span>
          <p className="font-mono text-[10px] text-gray-400 mt-2">
            Simulated · Full analysis requires operator ingest
          </p>
        </div>
        <div className="space-y-2 mt-4">
          <button
            data-testid="button-email-mastercard"
            className="w-full py-2 rounded border border-[#c8a96e] text-[#c8a96e] font-mono text-[11px] tracking-wider hover:bg-[#c8a96e]/5 transition-colors"
          >
            Email me my MasterCard draft
          </button>
          <Link href="/calculator">
            <button
              data-testid="button-open-operator"
              className="w-full py-2 rounded bg-gray-900 text-white font-mono text-[11px] tracking-wider hover:bg-gray-800 transition-colors"
            >
              Open full Operator view
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
      <p className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-1">
        Ingest Widget
      </p>
      <h3 className="font-serif text-base text-gray-900 mb-4">
        Generate your MasterCard in 30 seconds.
      </h3>

      {progress < 0 ? (
        <div className="space-y-3">
          <div>
            <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="bg-gray-50 border-gray-200 font-mono text-xs h-9 text-gray-700 placeholder:text-gray-300 focus:border-[#c8a96e]/40"
              data-testid="input-ingest-email"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
              LinkedIn URL
            </label>
            <Input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="linkedin.com/in/yourname"
              className="bg-gray-50 border-gray-200 font-mono text-xs h-9 text-gray-700 placeholder:text-gray-300 focus:border-[#c8a96e]/40"
              data-testid="input-ingest-linkedin"
            />
          </div>
          <button
            onClick={handleSubmit}
            data-testid="button-compute-qtac7"
            className="w-full py-2.5 rounded bg-gray-900 text-white font-mono text-xs tracking-wider hover:bg-gray-800 transition-colors"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
          >
            Compute My QTAC₇ →
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {steps.map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-2.5 transition-all duration-300"
              style={{ opacity: i <= progress ? 1 : 0.25 }}
            >
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono transition-colors ${
                  i < progress
                    ? "bg-[#c8a96e] text-white"
                    : i === progress
                      ? "bg-[#c8a96e]/20 text-[#c8a96e] animate-pulse"
                      : "bg-gray-100 text-gray-300"
                }`}
              >
                {i < progress ? "✓" : i + 1}
              </div>
              <span className="font-mono text-[11px] text-gray-600">{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Nomination Dialog ──
function NominationDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [nominatorEmail, setNominatorEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: {
      nomineeName: string;
      nomineeUrl: string;
      reason: string;
      nominatorEmail: string;
    }) => {
      const res = await apiRequest("POST", "/api/nominations", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!name.trim() || !url.trim() || !reason.trim() || !nominatorEmail.trim()) return;
    mutation.mutate({ nomineeName: name, nomineeUrl: url, reason, nominatorEmail });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setName("");
      setUrl("");
      setReason("");
      setNominatorEmail("");
      setSubmitted(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white border-[#E5E7EB] max-w-md text-gray-900">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-normal text-gray-900">
            Nominate a Master
          </DialogTitle>
          <DialogDescription className="font-mono text-[11px] text-gray-400">
            Know someone who should be in the Registry? Submit their details.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-[#c8a96e]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-[#c8a96e] text-lg">✓</span>
            </div>
            <p className="font-serif text-sm text-gray-900">Nomination received.</p>
            <p className="font-mono text-[11px] text-gray-400 mt-1">
              We'll review and mint a Proto MasterCard.
            </p>
          </div>
        ) : (
          <div className="space-y-3 mt-2">
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="bg-gray-50 border-gray-200 font-mono text-xs h-9 text-gray-700 placeholder:text-gray-300"
                data-testid="input-nomination-name"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                LinkedIn / Website
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="linkedin.com/in/name or website"
                className="bg-gray-50 border-gray-200 font-mono text-xs h-9 text-gray-700 placeholder:text-gray-300"
                data-testid="input-nomination-url"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Why this person?
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="What makes them a Master?"
                className="bg-gray-50 border-gray-200 font-mono text-xs resize-none h-16 text-gray-700 placeholder:text-gray-300"
                data-testid="input-nomination-reason"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-1">
                Your Email
              </label>
              <Input
                type="email"
                value={nominatorEmail}
                onChange={(e) => setNominatorEmail(e.target.value)}
                placeholder="you@email.com"
                className="bg-gray-50 border-gray-200 font-mono text-xs h-9 text-gray-700 placeholder:text-gray-300"
                data-testid="input-nomination-email"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              data-testid="button-submit-nomination"
              className="w-full py-2.5 rounded bg-gray-900 text-white font-mono text-xs tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              {mutation.isPending ? "Submitting..." : "Submit Nomination"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Main Registry Page ──
export default function RegistryPage() {
  const [mode, setMode] = useState<"CATALOG" | "OPERATOR" | "MARKET">("CATALOG");
  const [nominationOpen, setNominationOpen] = useState(false);
  const mastersRef = useRef<HTMLDivElement>(null);

  const { data: masters = [], isLoading } = useQuery<MasterCard[]>({
    queryKey: ["/api/masters"],
  });

  const scrollToMasters = () => {
    mastersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Ticker CSS animation */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker {
          animation: ticker 20s linear infinite;
        }
      `}</style>

      {/* ── Hero ── */}
      <div className="relative px-6 md:px-12 pt-8 pb-16 md:pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-16 md:mb-24">
          <span className="font-mono text-[10px] text-gray-300 tracking-[0.15em] uppercase">
            CORTEXCHAIN · HUMAN CAPITAL EXCHANGE
          </span>
          <div className="hidden md:flex items-center gap-6">
            {["Masters Registry", "Sovereign Directory", "Signal Box"].map(
              (tab, i) => (
                <span
                  key={tab}
                  className={`font-mono text-[11px] tracking-wider ${
                    i === 0 ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  {tab}
                </span>
              )
            )}
          </div>
        </div>

        {/* Center hero */}
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif italic text-3xl md:text-4xl text-gray-900 font-light leading-tight mb-4">
            The Central Bank for Human Capital.
          </h1>
          <p className="font-mono text-sm text-gray-400 leading-relaxed max-w-lg mx-auto mb-8">
            A living catalog of sovereign-grade masters, verified, scored, and
            built to compound human outcomes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={scrollToMasters}
              data-testid="button-browse-masters"
              className="px-6 py-2.5 rounded bg-gray-900 text-white font-mono text-xs tracking-wider hover:bg-gray-800 transition-colors"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
            >
              Browse Masters
            </button>
            <button
              onClick={() => setNominationOpen(true)}
              data-testid="button-nominate-master"
              className="px-6 py-2.5 rounded border border-gray-200 text-gray-600 font-mono text-xs tracking-wider hover:border-gray-300 hover:text-gray-800 transition-colors"
            >
              Nominate a Master
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop: Two-column layout for Ingest Widget ── */}
      <div className="px-6 md:px-8 overflow-hidden">
        {/* Mobile/Tablet Ingest Widget (below hero, when no right column) */}
        <div className="lg:hidden mb-8 max-w-md">
          <IngestWidget />
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* ── Mode Switcher ── */}
            <div ref={mastersRef} className="mb-8 scroll-mt-4">
              <div className="flex items-center gap-1 bg-white rounded-lg border border-[#E5E7EB] p-1 max-w-sm">
                {(["CATALOG", "OPERATOR", "MARKET"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    data-testid={`button-mode-${m.toLowerCase()}`}
                    className={`flex-1 py-2 rounded font-mono text-[11px] tracking-wider transition-colors ${
                      mode === m
                        ? "bg-gray-900 text-white"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Mode Content ── */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="font-mono text-xs text-gray-300 animate-pulse">
                  Loading Masters...
                </div>
              </div>
            ) : (
              <>
                {mode === "CATALOG" && (
                  <div>
                    {/* Horizontal scrollable strip */}
                    <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
                      {masters.map((card) => (
                        <MasterCardItem key={card.id} card={card} />
                      ))}
                    </div>
                  </div>
                )}

                {mode === "OPERATOR" && <OperatorMode />}

                {mode === "MARKET" && <MarketMode masters={masters} />}
              </>
            )}

            {/* ── Signal Box ── */}
            <div className="mt-16 mb-16">
              <SignalBox />
            </div>
          </div>

          {/* Desktop Ingest Widget (sticky right) */}
          <div className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-6">
              <IngestWidget />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 md:px-12 py-6 mt-8">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-gray-300 tracking-wider">
            Powered by ARCHON Ψ · QTAC₇ Verified Rails
          </span>
          <span className="font-mono text-[10px] text-gray-300 tracking-wider">
            NVIDIA Inception · CortexChain, Inc.
          </span>
        </div>
      </footer>

      {/* ── Nomination Dialog ── */}
      <NominationDialog open={nominationOpen} onOpenChange={setNominationOpen} />
    </div>
  );
}
