import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Activity, BarChart3, Zap, Flame, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Verdict } from "@shared/schema";

interface Stats {
  totalVerdicts: number;
  activeCanons: number;
  currentVolts: number;
  streakDays: number;
  verdictsUsedThisMonth: number;
  tier: string;
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: recentVerdicts, isLoading: verdictsLoading } = useQuery<Verdict[]>({
    queryKey: ["/api/verdicts"],
  });

  const tierLimit = stats?.tier === "pro" ? Infinity : 3;
  const usagePercent = stats ? Math.min((stats.verdictsUsedThisMonth / tierLimit) * 100, 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="border border-border rounded-lg p-6 md:p-8 bg-card" data-testid="welcome-banner">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl md:text-5xl font-serif text-primary select-none">Ψ</span>
          <div>
            <h1 className="text-xl font-serif italic text-foreground" data-testid="text-welcome-title">
              Welcome to ARCHON CANON
            </h1>
            <p className="text-sm font-mono text-muted-foreground mt-1">
              Verdict-as-a-Service · Seal truth to the ledger
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground tracking-wider">
            HCBI NETWORK · LIVE
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Verdicts"
          value={statsLoading ? "—" : String(stats?.totalVerdicts ?? 0)}
          icon={<BarChart3 size={16} />}
          testId="stat-total-verdicts"
        />
        <StatCard
          title="Active Canons"
          value={statsLoading ? "—" : String(stats?.activeCanons ?? 0)}
          icon={<Activity size={16} />}
          testId="stat-active-canons"
        />
        <StatCard
          title="VOLTs"
          value={statsLoading ? "—" : String(stats?.currentVolts ?? 0)}
          icon={<Zap size={16} />}
          testId="stat-volts"
        />
        <StatCard
          title="Streak"
          value={statsLoading ? "—" : `${stats?.streakDays ?? 0}d`}
          icon={<Flame size={16} />}
          testId="stat-streak"
        />
      </div>

      {/* Usage Meter + Recent Verdicts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Verdicts */}
        <div className="md:col-span-2 border border-border rounded-lg bg-card" data-testid="recent-verdicts">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-serif italic text-base text-foreground">Recent Verdicts</h2>
            <Link href="/canon">
              <span className="text-xs font-mono text-primary hover:underline cursor-pointer flex items-center gap-1">
                View Canon <ArrowRight size={12} />
              </span>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {verdictsLoading ? (
              <div className="p-5 text-center text-sm text-muted-foreground font-mono">Loading...</div>
            ) : !recentVerdicts || recentVerdicts.length === 0 ? (
              <div className="p-8 text-center">
                <span className="text-3xl text-primary/30 block mb-2">Ψ</span>
                <p className="text-sm text-muted-foreground font-mono">No verdicts sealed yet.</p>
                <Link href="/calculator">
                  <span className="text-sm font-mono text-primary hover:underline cursor-pointer mt-2 inline-block">
                    Open Calculator →
                  </span>
                </Link>
              </div>
            ) : (
              recentVerdicts.slice(0, 5).map((v) => (
                <Link key={v.id} href={`/mastercard/${v.id}`}>
                  <div
                    className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    data-testid={`verdict-row-${v.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-muted-foreground w-8">
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
                        <p className="text-xs font-mono text-muted-foreground">{v.subjectKind}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <p className="font-mono text-sm text-primary">
                          {v.stoneScore.toFixed(2)}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">STONE</p>
                      </div>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                          v.recommendation === "BUY"
                            ? "text-green-400 border-green-400/30"
                            : v.recommendation === "SELL"
                            ? "text-red-400 border-red-400/30"
                            : "text-primary border-primary/30"
                        }`}
                      >
                        {v.recommendation}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Pricing Usage Meter */}
        <div className="border border-border rounded-lg bg-card p-5" data-testid="usage-meter">
          <div className="border-t-2 border-primary -mt-5 -mx-5 mb-5 rounded-t-lg" />
          <h3 className="font-serif italic text-base text-foreground mb-4">Usage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
                <span>Verdicts this month</span>
                <span>{stats?.verdictsUsedThisMonth ?? 0} / {tierLimit === Infinity ? "∞" : tierLimit}</span>
              </div>
              <Progress value={usagePercent} className="h-2" />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[10px] px-2 py-0.5 rounded border border-primary/30 text-primary uppercase tracking-wider"
                data-testid="text-tier-badge"
              >
                {stats?.tier ?? "free"} tier
              </span>
            </div>
            {(stats?.tier === "free") && (
              <Link href="/pricing">
                <span className="block text-xs font-mono text-primary hover:underline cursor-pointer mt-2">
                  Upgrade to Pro →
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  testId,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  testId: string;
}) {
  return (
    <Card className="border border-border bg-card" data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
        <span className="text-primary">{icon}</span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-mono text-foreground font-medium">{value}</p>
      </CardContent>
    </Card>
  );
}
