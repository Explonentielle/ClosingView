import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { computeCloseScore, profileLabel, type CloseScoreResult } from "@/services";
import { ModalOverlay } from "@/components/modals/ModalOverlay";

type Props = { open: boolean; onClose: () => void; rates: { noShow: { v: number; x: number; y: number }; followUp: { v: number; deals: number }; closing: { v: number; x: number; y: number } } };

type Profile = {
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  city: string | null;
  experience_years: number | null;
  close_score: number | null;
};

type CloseRow = {
  close_date: string | null;
  created_at: string;
  contracted_amount: number;
  collected_amount: number;
  closed_at_round: string | null;
  installments: number | null;
  client_id: string | null;
  offer_id: string | null;
  offers: { commission_rate: number } | null;
};

// Fallback commission rate for closes without a linked offer, matching services/stats.ts
const DEFAULT_COMMISSION_RATE = 20;

const fmtEUR = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const today = () => new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

const EMPTY_CLOSE_SCORE: CloseScoreResult = {
  score: 0,
  axes: [
    { label: "Closing", v: 0 },
    { label: "Cash", v: 0 },
    { label: "Régularité", v: 0 },
    { label: "Cycle de vente", v: 0 },
    { label: "Objectifs", v: 0 },
  ],
  avgCycleDays: null,
};

const TrackRecordModal = ({ open, onClose, rates }: Props) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [closes, setCloses] = useState<CloseRow[]>([]);
  const [clientsMap, setClientsMap] = useState<Record<string, string>>({});
  const [offersMap, setOffersMap] = useState<Record<string, string>>({});
  const [closeScore, setCloseScore] = useState<CloseScoreResult>(EMPTY_CLOSE_SCORE);

  useEffect(() => {
    if (!open || !user) return;
    (async () => {
      const { data: p } = await supabase.from("profiles").select("display_name,first_name,last_name,email,city,experience_years,close_score").eq("id", user.id).maybeSingle();
      setProfile(p as Profile);
      const since = new Date(); since.setMonth(since.getMonth() - 12);
      const { data: cs } = await supabase.from("closes").select("close_date,created_at,contracted_amount,collected_amount,closed_at_round,installments,client_id,offer_id,offers(commission_rate)").eq("user_id", user.id).gte("created_at", since.toISOString()).order("created_at", { ascending: false });
      const rows = (cs || []) as CloseRow[];
      setCloses(rows);
      const cIds = [...new Set(rows.map(r => r.client_id).filter(Boolean) as string[])];
      const oIds = [...new Set(rows.map(r => r.offer_id).filter(Boolean) as string[])];
      if (cIds.length) {
        const { data: cls } = await supabase.from("clients").select("id,name").in("id", cIds);
        setClientsMap(Object.fromEntries((cls || []).map((c: any) => [c.id, c.name])));
      }
      if (oIds.length) {
        const { data: ofs } = await supabase.from("offers").select("id,name").in("id", oIds);
        setOffersMap(Object.fromEntries((ofs || []).map((o: any) => [o.id, o.name])));
      }
      setCloseScore(await computeCloseScore(user.id));
    })();
  }, [open, user]);

  if (!open) return null;

  const displayName = profile?.display_name || [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || profile?.email?.split("@")[0] || "—";
  const initials = (displayName.split(" ").map(s => s[0]).join("").slice(0, 2) || "U").toUpperCase();
  const score = closeScore.score;

  const cashCollected = closes.reduce((s, r) => s + Number(r.collected_amount || 0), 0);
  const commissions = closes.reduce((s, r) => {
    const rate = Number(r.offers?.commission_rate ?? DEFAULT_COMMISSION_RATE);
    return s + Number(r.contracted_amount || 0) * (rate / 100);
  }, 0);
  const closeCount = closes.length;
  const closingRate = rates.closing.v;

  // Monthly evolution — last 5 months
  const monthly: { label: string; total: number; key: string }[] = [];
  const now = new Date();
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const label = d.toLocaleDateString("fr-FR", { month: "short" });
    const total = closes.filter(r => {
      const dt = new Date(r.close_date || r.created_at);
      return dt.getFullYear() === d.getFullYear() && dt.getMonth() === d.getMonth();
    }).reduce((s, r) => s + Number(r.collected_amount || 0), 0);
    monthly.push({ label, total, key });
  }
  const maxMonth = Math.max(1, ...monthly.map(m => m.total));
  const first = monthly.find(m => m.total > 0)?.total || 0;
  const last = monthly[monthly.length - 1].total;
  const progression = first > 0 ? Math.round(((last - first) / first) * 100) : 0;

  // Radar axes — computed once by services/closeScore.ts, shared with Stats.tsx
  const axes = closeScore.axes;
  const toXY = (ang: number, r: number) => [Math.cos(ang) * r, Math.sin(ang) * r] as const;
  const R = 65;
  const pts = axes.map((a, i) => ({ ...a, ang: -Math.PI / 2 + (i * 2 * Math.PI) / axes.length }));
  const ring = (r: number) => pts.map(p => toXY(p.ang, r).join(",")).join(" ");
  const dataPts = pts.map(p => toXY(p.ang, (R * p.v) / 100).join(",")).join(" ");

  const top10 = closes.slice(0, 10);

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      overlayId="track-record-modal-overlay"
      overlayStyle={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflowY: "auto" }}
      contentClassName="track-record-modal"
      contentStyle={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 740, maxHeight: "90vh", overflowY: "auto", color: "#0f172a", fontFamily: "Inter, sans-serif" }}
    >
        {/* BLOC 1 - HEADER */}
        <div style={{ background: "#0f172a", padding: "32px 40px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0EFF9C" strokeWidth={2}><polygon points="12,2 22,7 22,17 12,22 2,17 2,7" /></svg>
              <span style={{ color: "#0EFF9C", fontSize: 12, fontWeight: 800 }}>Closing View</span>
            </div>
            <DialogPrimitive.Title asChild>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, lineHeight: 1.1 }}>Track Record</div>
            </DialogPrimitive.Title>
            <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 6 }}>{displayName} · Généré le {today()}</div>
          </div>
          <div style={{ background: "#0EFF9C18", border: "1px solid #0EFF9C33", borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 130 }}>
            <div style={{ color: "#6b7a99", fontSize: 8, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Close Score</div>
            <div style={{ color: "#0EFF9C", fontSize: 34, fontWeight: 900, lineHeight: 1.1, marginTop: 2 }}>{score}</div>
            <div style={{ color: "#0EFF9C", fontSize: 8, opacity: 0.7, fontWeight: 700, letterSpacing: "1px" }}>{profileLabel(score)}</div>
          </div>
        </div>

        {/* BLOC 2 - PROFIL */}
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "16px 40px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 42, height: 42, borderRadius: 999, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", fontWeight: 800, fontSize: 15 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ color: "#0f172a", fontSize: 14, fontWeight: 800 }}>{displayName}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Senior Closer · {profile?.city || "—"} · {profile?.experience_years || 0} ans d'expérience</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "Taux closing", value: `${Math.round(closingRate)}%` },
              { label: "Nb closes", value: closeCount },
              { label: "Cash total", value: `${Math.round(cashCollected / 1000)}k€` },
            ].map(k => (
              <div key={k.label} style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 11px", textAlign: "center" }}>
                <div style={{ color: "#059669", fontSize: 14, fontWeight: 800 }}>{k.value}</div>
                <div style={{ color: "#94a3b8", fontSize: 8, textTransform: "uppercase", fontWeight: 700 }}>{k.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "20px 40px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* BLOC 3 - KPI 12 mois */}
          <div>
            <div style={{ color: "#94a3b8", fontSize: 8, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>Résultats sur 12 mois</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {[
                { label: "Cash collecté", value: fmtEUR(cashCollected), color: "#0f172a" },
                { label: "Commissions", value: fmtEUR(commissions), color: "#059669" },
                { label: "Closes réalisés", value: String(closeCount), color: "#0f172a" },
                { label: "Taux closing", value: `${Math.round(closingRate)}%`, color: "#0f172a" },
              ].map(k => (
                <div key={k.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 11, textAlign: "center" }}>
                  <div style={{ color: k.color, fontSize: 17, fontWeight: 900 }}>{k.value}</div>
                  <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BLOC 4 - RADAR + ÉVOLUTION */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="track-record-radar" style={{ background: "#060b14", border: "1px solid #0EFF9C33", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ color: "#0EFF9C", fontSize: 8, letterSpacing: "3px", fontWeight: 800 }}>CLOSE SCORE</div>
              <div style={{ width: 18, height: 1, background: "#0EFF9C", opacity: 0.3, marginTop: 4 }} />
              <div style={{ color: "#0EFF9C", fontSize: 22, fontWeight: 900, lineHeight: 1, marginTop: 4 }}>{score}</div>
              <svg viewBox="0 0 220 185" style={{ width: "100%", maxHeight: 175 }}>
                <g transform="translate(110 95)">
                  {[R, R * 0.66, R * 0.33].map((r, i) => <polygon key={i} points={ring(r)} fill="none" stroke="#1e2b3a" strokeWidth={0.8} />)}
                  {pts.map((p, i) => { const [x, y] = toXY(p.ang, R); return <line key={i} x1={0} y1={0} x2={x} y2={y} stroke="#1e2b3a" strokeWidth={0.7} />; })}
                  <polygon points={dataPts} fill="#0EFF9C" fillOpacity={0.1} stroke="#0EFF9C" strokeWidth={2} />
                  {pts.map((p, i) => { const [x, y] = toXY(p.ang, (R * p.v) / 100); return <circle key={i} cx={x} cy={y} r={3} fill="#0EFF9C" />; })}
                  {pts.map((p, i) => {
                    const [lx, ly] = toXY(p.ang, R + 18);
                    return (
                      <g key={i}>
                        <text x={lx} y={ly - 2} textAnchor="middle" fontSize={7.5} fontWeight={600} fill="#e2e8f0">{p.label}</text>
                        <text x={lx} y={ly + 7} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#0EFF9C">{p.v}%</text>
                      </g>
                    );
                  })}
                  <circle cx={0} cy={0} r={2.5} fill="#0EFF9C" />
                </g>
              </svg>
              <div style={{ color: "#0EFF9C", fontSize: 7, opacity: 0.6, letterSpacing: "2px", fontWeight: 700 }}>{profileLabel(score)}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ color: "#94a3b8", fontSize: 8, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Évolution mensuelle</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {monthly.map((m, i) => {
                  const isLast = i === monthly.length - 1;
                  const pct = (m.total / maxMonth) * 100;
                  return (
                    <div key={m.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, fontSize: 10, color: "#64748b", fontWeight: 600, textTransform: "capitalize" }}>{m.label}</div>
                      <div style={{ flex: 1, height: 7, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#0EFF9C", borderRadius: 999 }} />
                      </div>
                      <div style={{ width: 60, textAlign: "right", fontSize: 11, fontWeight: isLast ? 800 : 700, color: isLast ? "#059669" : "#0f172a" }}>{fmtEUR(m.total)}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "9px 13px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: "#0f172a", fontWeight: 600 }}>Progression {monthly.length} mois</span>
                <span style={{ fontSize: 13, color: "#059669", fontWeight: 900 }}>{progression >= 0 ? "+" : ""}{progression}%</span>
              </div>
            </div>
          </div>

          {/* BLOC 5 - 10 derniers closes */}
          <div>
            <div style={{ color: "#94a3b8", fontSize: 8, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700, marginBottom: 8 }}>10 derniers closes</div>
            <div className="track-record-table" style={{ border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Date", "Client", "Offre", "Round", "Montant", "Règl."].map((h, i) => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: i === 4 ? "right" : i === 3 || i === 5 ? "center" : "left", color: "#64748b", fontSize: 9, textTransform: "uppercase", borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {top10.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}>Aucun close enregistré</td></tr>
                  )}
                  {top10.map((c, i) => {
                    const round = c.closed_at_round || "R1";
                    const isR1 = round === "R1";
                    const date = new Date(c.close_date || c.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
                    return (
                      <tr key={i} style={{ background: i % 2 ? "#fafafa" : "#fff" }}>
                        <td style={{ padding: "8px 12px", color: "#64748b" }}>{date}</td>
                        <td style={{ padding: "8px 12px", color: "#0f172a", fontWeight: 600 }}>{(c.client_id && clientsMap[c.client_id]) || "—"}</td>
                        <td style={{ padding: "8px 12px", color: "#64748b" }}>{(c.offer_id && offersMap[c.offer_id]) || "—"}</td>
                        <td style={{ padding: "8px 12px", textAlign: "center" }}>
                          <span style={{ background: isR1 ? "#dcfce7" : "#fef9c3", color: isR1 ? "#059669" : "#ca8a04", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>{round}</span>
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>{fmtEUR(Number(c.contracted_amount))}</td>
                        <td style={{ padding: "8px 12px", textAlign: "center", color: "#64748b" }}>X{c.installments || 1}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLOC 6 - 3 taux */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: 11, textAlign: "center" }}>
              <div style={{ color: "#dc2626", fontSize: 20, fontWeight: 900 }}>{rates.noShow.v}%</div>
              <div style={{ color: "#94a3b8", fontSize: 9, textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>No Show</div>
              <div style={{ color: "#dc2626", fontSize: 10, marginTop: 2 }}>{rates.noShow.x}/{rates.noShow.y} RDV</div>
            </div>
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: 11, textAlign: "center" }}>
              <div style={{ color: "#d97706", fontSize: 20, fontWeight: 900 }}>{rates.followUp.v}%</div>
              <div style={{ color: "#94a3b8", fontSize: 9, textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>Follow Up</div>
              <div style={{ color: "#d97706", fontSize: 10, marginTop: 2 }}>{rates.followUp.deals} deals actifs</div>
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 11, textAlign: "center" }}>
              <div style={{ color: "#059669", fontSize: 20, fontWeight: 900 }}>{rates.closing.v}%</div>
              <div style={{ color: "#94a3b8", fontSize: 9, textTransform: "uppercase", fontWeight: 700, marginTop: 2 }}>Closing</div>
              <div style={{ color: "#059669", fontSize: 10, marginTop: 2 }}>{rates.closing.x}/{rates.closing.y} RDV</div>
            </div>
          </div>

          {/* BLOC 7 - BOUTONS */}
          <div className="track-record-actions" style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => window.print()}
              style={{ flex: 1, background: "#0EFF9C", color: "#0a1a0f", fontWeight: 700, border: "none", borderRadius: 10, padding: 12, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a1a0f" strokeWidth={2.5}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Télécharger en PDF
            </button>
            <DialogPrimitive.Close asChild>
              <button style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 10, padding: "12px 18px", fontSize: 13, cursor: "pointer" }}>Fermer</button>
            </DialogPrimitive.Close>
          </div>
        </div>

        {/* BLOC 8 - FOOTER */}
        <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "13px 40px", borderRadius: "0 0 16px 16px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: "#64748b", fontSize: 11, fontWeight: 600 }}>Closing View · app.closingview.io</span>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>Document certifié · {today()}</span>
        </div>
    </ModalOverlay>
  );
};

export default TrackRecordModal;
