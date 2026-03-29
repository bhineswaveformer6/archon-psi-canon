import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MoonStar, Plus, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DailyBlock } from "@shared/schema";

interface Jewel {
  label: string;
  detail: string;
}

export default function DailyPage() {
  const { toast } = useToast();
  const [canonWord, setCanonWord] = useState("");
  const [jewels, setJewels] = useState<Jewel[]>([{ label: "", detail: "" }]);
  const [rawNotes, setRawNotes] = useState("");
  const [volts, setVolts] = useState([150]);
  const [sealed, setSealed] = useState<{ canonWord: string; volts: number } | null>(null);

  const { data: dailyBlocks, isLoading } = useQuery<DailyBlock[]>({
    queryKey: ["/api/daily-blocks"],
  });

  const sealMutation = useMutation({
    mutationFn: async () => {
      const body = {
        canonWord,
        jewels: JSON.stringify(jewels.filter((j) => j.label || j.detail)),
        rawNotes: rawNotes || null,
        volts: volts[0],
      };
      const res = await apiRequest("POST", "/api/daily-blocks", body);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/daily-blocks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setSealed({ canonWord, volts: volts[0] });
      toast({ title: "Day Sealed", description: `${canonWord} — VOLTs: ${volts[0]}` });
    },
    onError: (err: Error) => {
      toast({ title: "Seal Failed", description: err.message, variant: "destructive" });
    },
  });

  const addJewel = () => {
    setJewels([...jewels, { label: "", detail: "" }]);
  };

  const removeJewel = (index: number) => {
    setJewels(jewels.filter((_, i) => i !== index));
  };

  const updateJewel = (index: number, field: "label" | "detail", value: string) => {
    const updated = [...jewels];
    updated[index] = { ...updated[index], [field]: value };
    setJewels(updated);
  };

  const canSeal = canonWord.length > 0;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <MoonStar size={18} className="text-primary" />
          <h1 className="text-xl font-serif italic text-foreground" data-testid="text-daily-title">
            Daily Block
          </h1>
        </div>
        <p className="text-sm font-mono text-muted-foreground mt-1">
          End-of-day ritual — seal your day to the Canon
        </p>
      </div>

      {sealed ? (
        /* Confirmation Display */
        <div className="border border-primary/30 rounded-lg bg-card p-8 text-center" data-testid="daily-confirmation">
          <div className="border-t-2 border-primary -mt-8 -mx-8 mb-8 rounded-t-lg" />
          <span className="text-4xl text-primary block mb-4">Ψ</span>
          <h2 className="font-serif italic text-lg text-foreground mb-2">Day Sealed</h2>
          <p className="font-mono text-sm text-muted-foreground mb-1">
            Canon Word: <span className="text-primary">{sealed.canonWord}</span>
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            VOLTs: <span className="text-primary">{sealed.volts}</span>
          </p>
          <Button
            onClick={() => {
              setSealed(null);
              setCanonWord("");
              setJewels([{ label: "", detail: "" }]);
              setRawNotes("");
              setVolts([150]);
            }}
            variant="outline"
            className="mt-6 font-mono text-xs"
            data-testid="button-new-daily"
          >
            New Day Entry
          </Button>
        </div>
      ) : (
        /* Entry Form */
        <div className="space-y-6">
          {/* Step 1: Canon Word */}
          <div className="border border-border rounded-lg bg-card p-5" data-testid="daily-canon-word">
            <div className="border-t-2 border-primary -mt-5 -mx-5 mb-5 rounded-t-lg" />
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Step 1 — One word for this day
            </Label>
            <Input
              value={canonWord}
              onChange={(e) => setCanonWord(e.target.value)}
              placeholder="e.g. Discipline"
              className="font-serif text-lg mt-2 italic"
              data-testid="input-canon-word"
            />
          </div>

          {/* Step 2: Jewels */}
          <div className="border border-border rounded-lg bg-card p-5" data-testid="daily-jewels">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                Step 2 — Jewels
              </Label>
              <Button
                onClick={addJewel}
                variant="ghost"
                size="sm"
                className="h-7 text-xs font-mono text-primary"
                data-testid="button-add-jewel"
              >
                <Plus size={12} className="mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {jewels.map((jewel, i) => (
                <div key={i} className="flex gap-2 items-start" data-testid={`jewel-entry-${i}`}>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={jewel.label}
                      onChange={(e) => updateJewel(i, "label", e.target.value)}
                      placeholder="Label"
                      className="font-mono text-sm"
                      data-testid={`input-jewel-label-${i}`}
                    />
                    <Input
                      value={jewel.detail}
                      onChange={(e) => updateJewel(i, "detail", e.target.value)}
                      placeholder="Detail"
                      className="font-mono text-sm md:col-span-2"
                      data-testid={`input-jewel-detail-${i}`}
                    />
                  </div>
                  {jewels.length > 1 && (
                    <Button
                      onClick={() => removeJewel(i)}
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-jewel-${i}`}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Notes */}
          <div className="border border-border rounded-lg bg-card p-5" data-testid="daily-notes">
            <Label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Step 3 — Anything else that must not be lost?
            </Label>
            <Textarea
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Write your thoughts here..."
              className="font-mono text-sm mt-2 min-h-[100px]"
              data-testid="input-raw-notes"
            />
          </div>

          {/* VOLTs Slider */}
          <div className="border border-border rounded-lg bg-card p-5" data-testid="daily-volts">
            <div className="flex items-center justify-between mb-4">
              <Label className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                VOLTs — Energy Level
              </Label>
              <span className="font-mono text-lg text-primary font-medium" data-testid="text-volts-value">
                {volts[0]}
              </span>
            </div>
            <Slider
              value={volts}
              onValueChange={setVolts}
              min={0}
              max={300}
              step={5}
              className="w-full"
              data-testid="slider-volts"
            />
            <div className="flex justify-between mt-1 text-[10px] font-mono text-muted-foreground">
              <span>0</span>
              <span>150</span>
              <span>300</span>
            </div>
          </div>

          {/* Seal Button */}
          <Button
            onClick={() => sealMutation.mutate()}
            disabled={!canSeal || sealMutation.isPending}
            className="w-full h-12 font-mono text-sm tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-seal-day"
          >
            <MoonStar size={16} className="mr-2" />
            {sealMutation.isPending ? "SEALING..." : "SEAL DAY"}
          </Button>
        </div>
      )}

      {/* History */}
      <div className="border-t border-border pt-6 mt-8">
        <h2 className="font-serif italic text-base text-foreground mb-4" data-testid="text-daily-history">
          Past Days
        </h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground font-mono">Loading...</p>
        ) : !dailyBlocks || dailyBlocks.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles size={24} className="text-primary/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-mono">No daily blocks yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dailyBlocks.map((db) => {
              const jewelsArr: Jewel[] = JSON.parse(db.jewels || "[]");
              return (
                <div key={db.id} className="border border-border rounded-lg bg-card p-4" data-testid={`daily-block-${db.id}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-serif italic text-sm text-foreground">{db.canonWord}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{db.date}</span>
                    </div>
                    <span className="font-mono text-xs text-primary">{db.volts} VOLTs</span>
                  </div>
                  {jewelsArr.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {jewelsArr.map((j, i) => (
                        <span key={i} className="font-mono text-[10px] text-muted-foreground px-2 py-0.5 rounded border border-border">
                          {j.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
