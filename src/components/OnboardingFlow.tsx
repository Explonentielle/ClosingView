import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  UserPlus,
  BarChart3,
  Globe2,
  Star,
  Lock,
  ChevronRight,
} from "lucide-react";
import * as S from './OnboardingFlow.styles';
import { COLORS } from './OnboardingFlow.styles';

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type EntryDraft = {
  client_id?: string;
  offer_id?: string;
  r1_planned: number;
  r1_done: number;
  r2_planned: number;
  r2_done: number;
  closes_count: number;
  amount: number;
  amountType: "HT" | "TTC";
};

const OnboardingFlow = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [anim, setAnim] = useState(0);

  // Step 2 — client
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState("VSL");
  const [clientNiche, setClientNiche] = useState("");
  const [clientOffer, setClientOffer] = useState("");
  const [clientSaved, setClientSaved] = useState(false);
  const [newClientId, setNewClientId] = useState<string | null>(null);
  const [newOfferId, setNewOfferId] = useState<string | null>(null);

  // Step 3 — entry
  const [clientsList, setClientsList] = useState<{ id: string; name: string }[]>([]);
  const [offersList, setOffersList] = useState<{ id: string; name: string; amount: number }[]>([]);
  const [entry, setEntry] = useState<EntryDraft>({
    r1_planned: 0,
    r1_done: 0,
    r2_planned: 0,
    r2_done: 0,
    closes_count: 0,
    amount: 0,
    amountType: "HT",
  });
  const [entrySaved, setEntrySaved] = useState(false);
  const [busy, setBusy] = useState(false);

  // Check onboarding state
  useEffect(() => {
    if (loading || !user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_done")
        .eq("id", user.id)
        .maybeSingle();
      if (!data?.onboarding_done) setVisible(true);
    })();
  }, [user, loading]);

  // Animation trigger on step change
  useEffect(() => {
    setAnim(0);
    const t = setTimeout(() => setAnim(1), 10);
    return () => clearTimeout(t);
  }, [step]);

  // Background navigation per step
  useEffect(() => {
    if (!visible) return;
    if (step === 2 || step === 3) navigate("/clients");
    else if (step === 4) navigate("/stats");
    else if (step === 5) navigate("/network");
  }, [step, visible, navigate]);

  // Load clients/offers for step 3
  useEffect(() => {
    if (step !== 3 || !user) return;
    (async () => {
      const { data } = await supabase
        .from("clients")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setClientsList(data ?? []);
      if (data?.length && !entry.client_id) {
        setEntry((e) => ({ ...e, client_id: newClientId ?? data[0].id }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, user]);

  useEffect(() => {
    if (!entry.client_id) return;
    (async () => {
      const { data } = await supabase
        .from("offers")
        .select("id, name, amount")
        .eq("client_id", entry.client_id);
      setOffersList(data ?? []);
      if (data?.length) setEntry((e) => ({ ...e, offer_id: newOfferId ?? data[0].id }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry.client_id]);

  const goTo = (s: Step) => setStep(s);

  const finish = async () => {
    if (!user) return;
    await supabase.from("profiles").update({ onboarding_done: true }).eq("id", user.id);
    setVisible(false);
    navigate("/dashboard");
  };

  const saveClient = async () => {
    if (!user || !clientName.trim()) return;
    setBusy(true);
    const initials = clientName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const { data: c, error } = await supabase
      .from("clients")
      .insert({
        user_id: user.id,
        name: clientName.trim(),
        niche: clientNiche.trim() || "—",
        type: [clientType],
        initials,
      })
      .select()
      .single();
    if (error) {
      setBusy(false);
      return;
    }
    setNewClientId(c.id);
    // Optional offer
    if (clientOffer.trim()) {
      const match = clientOffer.match(/(\d[\d\s.,]*)/);
      const amount = match ? parseFloat(match[1].replace(/[\s,]/g, "")) : 0;
      const nameOnly = clientOffer.replace(/[·\-–].*$/, "").trim() || clientOffer.trim();
      const { data: o } = await supabase
        .from("offers")
        .insert({ user_id: user.id, client_id: c.id, name: nameOnly, amount })
        .select()
        .single();
      if (o) setNewOfferId(o.id);
    }
    setBusy(false);
    setClientSaved(true);
  };

  const saveEntry = async () => {
    if (!user || !entry.client_id) return;
    setBusy(true);
    const { data: ent } = await supabase
      .from("daily_entries")
      .insert({
        user_id: user.id,
        client_id: entry.client_id,
        r1_planned: entry.r1_planned,
        r1_done: entry.r1_done,
        r2_planned: entry.r2_planned,
        r2_done: entry.r2_done,
        closes_count: entry.closes_count,
      })
      .select()
      .single();
    if (entry.closes_count > 0 && entry.amount > 0 && ent) {
      const per = entry.amount / entry.closes_count;
      const rows = Array.from({ length: entry.closes_count }).map(() => ({
        user_id: user.id,
        client_id: entry.client_id!,
        offer_id: entry.offer_id ?? null,
        entry_id: ent.id,
        contracted_amount: per,
        collected_amount: per,
      }));
      await supabase.from("closes").insert(rows);
    }
    setBusy(false);
    setEntrySaved(true);
  };

  if (!visible) return null;

  const completed = step;
  const dots = [1, 2, 3, 4, 5, 6];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={S.modalOverlay}
    >
      <div
        className="flex flex-col gap-4"
        style={S.modalCard(visible, anim)}
      >
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {dots.map((d) => {
            const isDone = d < completed;
            const isActive = d === completed;
            return (
              <span
                key={d}
                style={S.dot(isDone, isActive)}
              />
            );
          })}
        </div>

        <div
          key={step}
          style={S.stepContent(anim)}
        >
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <div style={{ fontSize: 38 }}>👋</div>
                <div
                  className="mt-2 text-white"
                  style={{ fontSize: 19, fontWeight: 900, lineHeight: 1.2 }}
                >
                  Bienvenue sur Closing View
                </div>
                <div style={{ color: "#8892a0", fontSize: 12, marginTop: 8 }}>
                  L'outil que chaque closer devrait avoir.
                  <br />
                  En 5 minutes, ton tableau de bord sera opérationnel.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <ActionRow
                  color={COLORS.green}
                  icon={<UserPlus size={14} />}
                  label="Ajouter ton premier client"
                  onClick={() => goTo(2)}
                />
                <ActionRow
                  color={COLORS.blue}
                  icon={<BarChart3 size={14} />}
                  label="Saisir ta première journée"
                  onClick={() => goTo(3)}
                />
                <ActionRow
                  color={COLORS.purple}
                  icon={<Globe2 size={14} />}
                  label="Découvrir tes Stats & le Réseau"
                  onClick={() => goTo(4)}
                />
                <ActionRow
                  color={COLORS.yellow}
                  icon={<Star size={14} />}
                  label="Débloquer ton Close Score (après 5 saisies)"
                  onClick={() => goTo(6)}
                />
              </div>

              <button className={S.button()} style={S.buttonStyle(S.COLORS.green)} onClick={() => goTo(2)}>
                C'est parti ! →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <StepHeader
                color={COLORS.green}
                icon={<UserPlus size={22} color={COLORS.green} />}
                title="Ajoute ton premier client"
                subtitle="L'infopreneur pour lequel tu closes."
              />

              {!clientSaved ? (
                <>
                  <Field label="NOM">
                    <input
                      className={S.input()}
                      style={S.inputStyle}
                      placeholder="Ex : Thomas Coaching"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </Field>
                  <Field label="TYPE">
                    <select
                      className={S.input()}
                      style={S.inputStyle}
                      value={clientType}
                      onChange={(e) => setClientType(e.target.value)}
                    >
                      <option value="VSL">VSL</option>
                      <option value="Challenge">Challenge</option>
                    </select>
                  </Field>
                  <Field label="NICHE">
                    <input
                      className={S.input()}
                      style={S.inputStyle}
                      placeholder="Business..."
                      value={clientNiche}
                      onChange={(e) => setClientNiche(e.target.value)}
                    />
                  </Field>
                  <Field label="OFFRE PRINCIPALE">
                    <input
                      className={S.input()}
                      style={S.inputStyle}
                      placeholder="Ex : Mastermind Elite · 3 500€"
                      value={clientOffer}
                      onChange={(e) => setClientOffer(e.target.value)}
                    />
                  </Field>

                  <button
                    className={S.button()}
                    style={{ ...S.buttonStyle(S.COLORS.green), opacity: busy ? 0.6 : 1 }}
                    disabled={busy}
                    onClick={saveClient}
                  >
                    Ajouter ce client →
                  </button>
                  <button
                    className="text-[11px] mt-2"
                    style={{ ...S.backLinkStyle, background: "transparent" }}
                    onClick={() => goTo(1)}
                  >
                    ← Retour
                  </button>
                </>
              ) : (
                <SuccessScreen
                  emoji="✅"
                  title="Client ajouté !"
                  text="Maintenant saisis ta première journée."
                  cta="Saisir ma première journée →"
                  onCta={() => {
                    setClientSaved(false);
                    goTo(3);
                  }}
                />
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <StepHeader
                color={COLORS.blue}
                icon={<BarChart3 size={22} color={COLORS.blue} />}
                title="Saisis ta journée"
                subtitle="3 minutes. Closing View calcule tout."
              />

              {!entrySaved ? (
                <>
                  <Field label="CLIENT">
                    <select
                      className={S.input()}
                      style={S.inputStyle}
                      value={entry.client_id ?? ""}
                      onChange={(e) => setEntry({ ...entry, client_id: e.target.value })}
                    >
                      {clientsList.length === 0 && <option value="">Aucun client</option>}
                      {clientsList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="OFFRE">
                    <select
                      className={S.input()}
                      style={S.inputStyle}
                      value={entry.offer_id ?? ""}
                      onChange={(e) => setEntry({ ...entry, offer_id: e.target.value })}
                    >
                      {offersList.length === 0 && <option value="">—</option>}
                      {offersList.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="grid grid-cols-4 gap-2">
                    <NumField
                      label="R1 Prév"
                      v={entry.r1_planned}
                      onChange={(v) => setEntry({ ...entry, r1_planned: v })}
                    />
                    <NumField
                      label="R1 Faits"
                      v={entry.r1_done}
                      onChange={(v) => setEntry({ ...entry, r1_done: v })}
                    />
                    <NumField
                      label="R2 Prév"
                      v={entry.r2_planned}
                      onChange={(v) => setEntry({ ...entry, r2_planned: v })}
                    />
                    <NumField
                      label="R2 Faits"
                      v={entry.r2_done}
                      onChange={(v) => setEntry({ ...entry, r2_done: v })}
                    />
                  </div>

                  <Field label="CLOSES">
                    <input
                      type="number"
                      className={S.input()}
                      style={S.inputStyle}
                      value={entry.closes_count}
                      onChange={(e) =>
                        setEntry({ ...entry, closes_count: Number(e.target.value) || 0 })
                      }
                    />
                  </Field>
                  <Field label="MONTANT">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className={S.input()}
                        style={S.inputStyle}
                        value={entry.amount}
                        onChange={(e) =>
                          setEntry({ ...entry, amount: Number(e.target.value) || 0 })
                        }
                      />
                      <select
                        className={S.input()}
                        style={{ ...S.inputStyle, width: 80 }}
                        value={entry.amountType}
                        onChange={(e) =>
                          setEntry({ ...entry, amountType: e.target.value as "HT" | "TTC" })
                        }
                      >
                        <option value="HT">HT</option>
                        <option value="TTC">TTC</option>
                      </select>
                    </div>
                  </Field>

                  <button
                    className={S.button()}
                    style={{ ...S.buttonStyle(S.COLORS.blue), opacity: busy ? 0.6 : 1 }}
                    disabled={busy}
                    onClick={saveEntry}
                  >
                    Valider ✓
                  </button>
                  <button
                    className="text-[11px] mt-2"
                    style={{ ...S.backLinkStyle, background: "transparent" }}
                    onClick={() => goTo(2)}
                  >
                    ← Retour
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="text-center">
                    <div style={{ fontSize: 44 }}>🎉</div>
                    <div
                      className="mt-2 text-white"
                      style={{ fontSize: 17, fontWeight: 900 }}
                    >
                      Première journée enregistrée !
                    </div>
                  </div>
                  <div
                    className="grid grid-cols-3 gap-2 p-3 rounded-[10px]"
                    style={{ background: "#0a0f1a", border: "0.5px solid #2a3a50" }}
                  >
                    <StatMini label="closes" value={`${entry.closes_count}`} />
                    <StatMini label={`cash ${entry.amountType}`} value={`${entry.amount}€`} />
                    <StatMini
                      label="taux"
                      value={`${
                        entry.r2_done > 0
                          ? Math.round((entry.closes_count / entry.r2_done) * 100)
                          : 0
                      }%`}
                    />
                  </div>
                  <div style={{ color: "#8892a0", fontSize: 11, textAlign: "center" }}>
                    Tes stats se mettent à jour automatiquement.
                  </div>
                  <button
                    className={S.button()}
                    style={S.buttonStyle(S.COLORS.green)}
                    onClick={() => {
                      setEntrySaved(false);
                      goTo(4);
                    }}
                  >
                    Voir mes Stats →
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              <StepHeader
                color={COLORS.purple}
                icon={<BarChart3 size={22} color={COLORS.purple} />}
                title="Tes stats en temps réel"
                subtitle="Cash, closes, taux — tout calculé automatiquement."
              />
              <div
                className="rounded-[10px] overflow-hidden"
                style={{ background: "#0a0f1a", border: "0.5px solid #2a3a50" }}
              >
                <div className="grid grid-cols-3 p-3 gap-2">
                  <StatMini
                    label="Cash"
                    value={`${entry.amount || 3500}€`}
                  />
                  <StatMini
                    label="Close"
                    value={`${entry.closes_count || 1}`}
                  />
                  <StatMini
                    label="Taux"
                    value={`${
                      entry.r2_done > 0
                        ? Math.round((entry.closes_count / entry.r2_done) * 100)
                        : 33
                    }%`}
                  />
                </div>
                <div
                  className="px-3 py-3 flex items-center gap-2"
                  style={{ borderTop: "0.5px solid #2a3a50" }}
                >
                  <Lock size={14} color="#8892a0" />
                  <div>
                    <div className="text-white" style={{ fontSize: 12, fontWeight: 700 }}>
                      Close Score verrouillé
                    </div>
                    <div style={{ color: "#8892a0", fontSize: 10 }}>
                      Disponible après 5 saisies — il t'en reste 4
                    </div>
                  </div>
                </div>
              </div>
              <button className={S.button()} style={S.buttonStyle(S.COLORS.purple)} onClick={() => goTo(5)}>
                Découvrir le Réseau →
              </button>
              <button
                className="text-[11px] mt-2"
                style={{ ...S.backLinkStyle, background: "transparent" }}
                onClick={() => goTo(3)}
              >
                ← Retour
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-3">
              <StepHeader
                color={COLORS.green}
                icon={<Globe2 size={22} color={COLORS.green} />}
                title="Le Réseau Closing View"
                subtitle="127 closers actifs. Partage, progresse, trouve des missions."
              />

              <NetBlock
                color={COLORS.green}
                emoji="💬"
                title="Communauté"
                desc="Posts, victoires, questions"
                badge="127 membres"
              />
              <NetBlock
                color={COLORS.yellow}
                emoji="⭐"
                title="Leaderboard"
                desc="Ton rang parmi 127 closers"
                badge="#12"
              />
              <NetBlock
                color={COLORS.blue}
                emoji="💬"
                title="Messagerie privée"
                desc="Échange direct entre closers"
                badge="Privé"
              />

              <button className={S.button()} style={S.buttonStyle(S.COLORS.green)} onClick={() => goTo(6)}>
                Rejoindre →
              </button>
              <button
                className="text-[11px] mt-2"
                style={{ ...S.backLinkStyle, background: "transparent" }}
                onClick={() => goTo(4)}
              >
                ← Retour
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <div style={{ fontSize: 38 }}>⭐</div>
                <div
                  className="mt-2 text-white"
                  style={{ fontSize: 19, fontWeight: 900, lineHeight: 1.2 }}
                >
                  Le Close Score
                </div>
                <div style={{ color: "#8892a0", fontSize: 12, marginTop: 6 }}>
                  Ton score sur 100, calculé depuis tes vraies données. Ta preuve
                  objective auprès des infopreneurs.
                </div>
              </div>

              <div
                className="rounded-[10px] p-4 flex flex-col items-center"
                style={{
                  background: "#060b14",
                  border: "0.5px solid #0EFF9C33",
                }}
              >
                <div
                  style={{
                    color: "#8892a0",
                    fontSize: 10,
                    letterSpacing: 1.5,
                    fontWeight: 700,
                  }}
                >
                  CLOSE SCORE
                </div>
                <div className="relative my-2 flex items-center justify-center">
                  <div style={{ color: "#2a3a50", fontSize: 52, fontWeight: 900 }}>??</div>
                  <Lock
                    size={20}
                    color="#8892a0"
                    style={{ position: "absolute", bottom: -2 }}
                  />
                </div>
                <div style={{ color: "#8892a0", fontSize: 11 }}>
                  Se débloque après 5 saisies
                </div>
              </div>

              <div
                className="rounded-[10px] p-3 flex flex-col gap-1.5"
                style={{ background: "#0a0f1a", border: "0.5px solid #2a3a50" }}
              >
                {[
                  ["Taux de closing", "30%"],
                  ["Cash généré", "25%"],
                  ["Régularité (streaks)", "20%"],
                  ["Cycle de vente", "15%"],
                  ["Objectifs atteints", "10%"],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-[11px]">
                    <span className="text-white">{l}</span>
                    <span style={{ color: COLORS.green, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>

              <button className={S.button()} style={S.buttonStyle(S.COLORS.green)} onClick={finish}>
                Accéder à mon Dashboard 🚀
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{S.keyframes}</style>
    </div>
  );
};

// ─── helpers ────────────────────────────────────────────────────────────────

const ActionRow = ({
  color,
  icon,
  label,
  onClick,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-2.5 rounded-[10px] text-left transition-colors"
    style={S.actionButton}
  >
    <span
      className="flex items-center justify-center"
      style={S.actionIcon(color)}
    >
      {icon}
    </span>
    <span className="flex-1 text-white" style={{ fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
    <ChevronRight size={14} color="#6b7a99" />
  </button>
);

const StepHeader = ({
  color,
  icon,
  title,
  subtitle,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <div className="flex flex-col items-center text-center gap-2">
    <span
      className="flex items-center justify-center"
      style={S.stepHeaderIcon(color)}
    >
      {icon}
    </span>
    <div className="text-white" style={{ fontSize: 17, fontWeight: 900 }}>
      {title}
    </div>
    <div style={{ color: "#8892a0", fontSize: 12 }}>{subtitle}</div>
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="flex flex-col gap-1">
    <span style={S.fieldLabel}>
      {label}
    </span>
    {children}
  </label>
);

const NumField = ({
  label,
  v,
  onChange,
}: {
  label: string;
  v: number;
  onChange: (n: number) => void;
}) => (
  <label className="flex flex-col gap-1">
    <span style={{ color: "#8892a0", fontSize: 8, fontWeight: 700, letterSpacing: 1 }}>
      {label}
    </span>
    <input
      type="number"
      className="w-full h-[34px] px-2 rounded-[8px] text-[12px] text-white outline-none"
      style={S.numFieldInput}
      value={v}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
    />
  </label>
);

const StatMini = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <div className="text-white" style={{ fontSize: 14, fontWeight: 900 }}>
      {value}
    </div>
    <div style={{ color: "#8892a0", fontSize: 10 }}>{label}</div>
  </div>
);

const SuccessScreen = ({
  emoji,
  title,
  text,
  cta,
  onCta,
}: {
  emoji: string;
  title: string;
  text: string;
  cta: string;
  onCta: () => void;
}) => (
  <div className="flex flex-col gap-3 text-center">
    <div style={{ fontSize: 44 }}>{emoji}</div>
    <div className="text-white" style={{ fontSize: 17, fontWeight: 900 }}>
      {title}
    </div>
    <div style={{ color: "#8892a0", fontSize: 12 }}>{text}</div>
    <button
      onClick={onCta}
      className="w-full h-[44px] rounded-[10px] text-[13px] font-bold"
      style={{ background: "#0EFF9C", color: "#0D1117" }}
    >
      {cta}
    </button>
  </div>
);

const NetBlock = ({
  color,
  emoji,
  title,
  desc,
  badge,
}: {
  color: string;
  emoji: string;
  title: string;
  desc: string;
  badge: string;
}) => (
  <div
    className="flex items-center gap-2.5 rounded-[10px]"
    style={S.netBlock(color)}
  >
    <span
      className="flex items-center justify-center"
      style={S.netBlockIcon(color)}
    >
      {emoji}
    </span>
    <div className="flex-1">
      <div className="text-white" style={{ fontSize: 12, fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ color: "#8892a0", fontSize: 10 }}>{desc}</div>
    </div>
    <span style={S.netBlockBadge(color)}>
      {badge}
    </span>
  </div>
);

export default OnboardingFlow;
