import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronDown, ChevronRight, Hash, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CanonBlock, Verdict } from "@shared/schema";

interface CanonBlockWithVerdicts extends CanonBlock {
  verdictDetails?: Verdict[];
}

export default function CanonPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>({});

  const { data: canonBlocks, isLoading: blocksLoading } = useQuery<CanonBlockWithVerdicts[]>({
    queryKey: ["/api/canon-blocks"],
  });

  const toggleBlock = (blockNum: number) => {
    setExpandedBlocks((prev) => ({ ...prev, [blockNum]: !prev[blockNum] }));
  };

  const filteredBlocks = canonBlocks?.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.blockNumber.toString().includes(q) ||
      b.hash.toLowerCase().includes(q) ||
      b.verdictDetails?.some(
        (v) =>
          v.subjectName.toLowerCase().includes(q) ||
          v.subjectTicker?.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-serif italic text-foreground" data-testid="text-canon-title">
          Canon Ledger
        </h1>
        <p className="text-sm font-mono text-muted-foreground mt-1">
          Immutable hash-chain of all sealed verdicts
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by subject, ticker, block #, or hash..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="font-mono"
        data-testid="input-canon-search"
      />

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        {blocksLoading ? (
          <div className="pl-12 py-8 text-center text-sm text-muted-foreground font-mono">
            Loading canon...
          </div>
        ) : !filteredBlocks || filteredBlocks.length === 0 ? (
          <div className="pl-12 py-12 text-center">
            <span className="text-3xl text-primary/30 block mb-2">Ψ</span>
            <p className="text-sm text-muted-foreground font-mono">
              No blocks sealed yet. Create your first verdict.
            </p>
            <Link href="/calculator">
              <span className="text-sm font-mono text-primary hover:underline cursor-pointer mt-2 inline-block">
                Open Calculator →
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBlocks.map((block) => {
              const isExpanded = expandedBlocks[block.blockNumber];
              const eventIds: number[] = JSON.parse(block.events || "[]");

              return (
                <div key={block.id} className="relative pl-12" data-testid={`canon-block-${block.blockNumber}`}>
                  {/* Node dot */}
                  <div className="absolute left-[12px] top-4 w-[15px] h-[15px] rounded-full border-2 border-primary bg-card z-10" />

                  <div className="border border-border rounded-lg bg-card overflow-hidden">
                    {/* Block header */}
                    <button
                      onClick={() => toggleBlock(block.blockNumber)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
                      data-testid={`button-expand-block-${block.blockNumber}`}
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown size={14} className="text-primary" />
                        ) : (
                          <ChevronRight size={14} className="text-muted-foreground" />
                        )}
                        <Hash size={14} className="text-primary" />
                        <span className="font-mono text-sm text-foreground">
                          Block #{block.blockNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {eventIds.length} event{eventIds.length !== 1 ? "s" : ""}
                        </span>
                        <span className="font-mono text-[10px] text-primary">
                          {block.volts} VOLTs
                        </span>
                      </div>
                    </button>

                    {/* Block metadata */}
                    <div className="px-5 pb-2 flex flex-wrap gap-4 text-[10px] font-mono text-muted-foreground">
                      <span>HASH: {block.hash.slice(0, 16)}…</span>
                      <span>PREV: {block.prevHash.slice(0, 16)}…</span>
                      <span>{new Date(block.sealedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Expanded events */}
                    {isExpanded && block.verdictDetails && (
                      <div className="border-t border-border divide-y divide-border">
                        {block.verdictDetails.map((v) => (
                          <Link key={v.id} href={`/mastercard/${v.id}`}>
                            <div
                              className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors cursor-pointer"
                              data-testid={`canon-verdict-${v.id}`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="font-mono text-xs text-muted-foreground">
                                  #{v.blockNumber}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm font-serif truncate text-foreground">
                                    {v.subjectName}
                                    {v.subjectTicker && (
                                      <span className="text-muted-foreground ml-1 font-mono text-xs">
                                        ({v.subjectTicker})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-mono text-xs text-primary">
                                  {v.stoneScore.toFixed(2)}
                                </span>
                                <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                                  v.recommendation === "BUY"
                                    ? "text-green-400 border-green-400/30"
                                    : v.recommendation === "SELL"
                                    ? "text-red-400 border-red-400/30"
                                    : "text-primary border-primary/30"
                                }`}>
                                  {v.recommendation}
                                </span>
                                <ArrowRight size={12} className="text-muted-foreground" />
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
