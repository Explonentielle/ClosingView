import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";

const CITY_COORDS: Record<string, [number, number]> = {
  Paris: [48.8566, 2.3522],
  Lyon: [45.7640, 4.8357],
  Marseille: [43.2965, 5.3698],
  Bordeaux: [44.8378, -0.5792],
  Toulouse: [43.6047, 1.4442],
  Nantes: [47.2184, -1.5536],
  Strasbourg: [48.5734, 7.7521],
  Lille: [50.6292, 3.0573],
  Rennes: [48.1113, -1.6800],
  Nice: [43.7102, 7.2620],
  Montpellier: [43.6108, 3.8767],
  Grenoble: [45.1885, 5.7245],
  Brest: [48.3905, -4.4860],
  Dijon: [47.3220, 5.0415],
  Reims: [49.2583, 4.0347],
  Rouen: [49.4432, 1.0993],
  Tours: [47.3941, 0.6848],
  Angers: [47.4784, -0.5630],
  Caen: [49.1829, -0.3707],
  Limoges: [45.8336, 1.2611],
};

const colorFor = (score: number) =>
  score >= 70 ? "#0EFF9C" : score >= 50 ? "#EFB027" : "#3B82F6";

type Profile = {
  id: string;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  close_score?: number | null;
};

const fullName = (p: Profile) =>
  p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Closer";

export default function MapFrance() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("profiles")
      .select("id, first_name, last_name, display_name, city, close_score")
      .order("close_score", { ascending: false, nullsFirst: false })
      .limit(200)
      .then(({ data }) => {
        setProfiles((data as any) ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const points = profiles
    .filter((p) => p.city && CITY_COORDS[p.city] && p.close_score != null)
    .map((p) => ({
      ...p,
      lat: CITY_COORDS[p.city!][0],
      lng: CITY_COORDS[p.city!][1],
    }));

  const activeCount = profiles.length;

  return (
    <div
      className="rounded-[12px] border-hair overflow-hidden relative"
      style={{ background: "#161d2e", borderColor: "#2a3a50", height: 540 }}
    >
      <div
        className="absolute top-3 right-3 z-[500] flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full"
        style={{ background: "#0EFF9C18", color: "#0EFF9C" }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
        {activeCount} closers actifs
      </div>

      {loading ? (
        <div className="w-full h-full flex items-center justify-center" style={{ background: "#0D1117" }}>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#2a3a50] border-t-[#0EFF9C] animate-spin mx-auto mb-3" />
            <p style={{ color: "#8892a0", fontSize: "12px" }}>Chargement de la carte...</p>
          </div>
        </div>
      ) : (
        <MapContainer
          center={[46.6, 2.5]}
          zoom={6}
          style={{ height: "100%", width: "100%", background: "#0D1117" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {points.map((p) => {
            const color = colorFor(p.close_score ?? 0);
            return (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={9 + (p.close_score ?? 0) / 14}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
              >
                <Popup>
                  <div style={{ fontFamily: "Inter, sans-serif", minWidth: 150 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#0D1117" }}>
                      {fullName(p)}
                    </div>
                    <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 2 }}>
                      Score: {p.close_score} · {p.city}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      )}

      <div
        className="absolute bottom-3 left-3 z-[500] flex items-center gap-4 text-[10px] px-3 py-1.5 rounded-full"
        style={{ background: "#0D1117CC", color: "#8892a0", border: "0.5px solid #2a3a50" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#0EFF9C" }} /> 70+
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#EFB027" }} /> 50–69
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} /> &lt;50
        </span>
      </div>
    </div>
  );
}
