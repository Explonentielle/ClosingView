import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const closers = [
  { id: 1, name: "Alexandre L.", score: 82, lat: 48.8566, lng: 2.3522,  color: "#0EFF9C" },
  { id: 2, name: "Sarah C.",     score: 79, lat: 43.2965, lng: 5.3698,  color: "#0EFF9C" },
  { id: 3, name: "Marc R.",      score: 75, lat: 45.7640, lng: 4.8357,  color: "#0EFF9C" },
  { id: 4, name: "Lucas D.",     score: 61, lat: 44.8378, lng: -0.5792, color: "#EFB027" },
  { id: 5, name: "Nina B.",      score: 44, lat: 47.2184, lng: -1.5536, color: "#3B82F6" },
  { id: 6, name: "Kevin M.",     score: 71, lat: 43.6047, lng: 1.4442,  color: "#0EFF9C" },
  { id: 7, name: "Julie R.",     score: 58, lat: 50.6292, lng: 3.0573,  color: "#EFB027" },
  { id: 8, name: "Thomas B.",    score: 83, lat: 48.5734, lng: 7.7521,  color: "#0EFF9C" },
];

export default function MapFrance() {
  return (
    <div
      className="rounded-[12px] border-hair overflow-hidden relative"
      style={{ background: "#161d2e", borderColor: "#2a3a50", height: 420 }}
    >
      <div
        className="absolute top-3 right-3 z-[500] flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full"
        style={{ background: "#0EFF9C18", color: "#0EFF9C" }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
        127 closers actifs
      </div>

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
        {closers.map((c) => (
          <CircleMarker
            key={c.id}
            center={[c.lat, c.lng]}
            radius={9}
            pathOptions={{ color: c.color, fillColor: c.color, fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div style={{ fontFamily: "Inter, sans-serif", minWidth: 120 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0D1117" }}>{c.name}</div>
                <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginTop: 2 }}>
                  Score : {c.score}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div
        className="absolute bottom-3 left-3 z-[500] flex items-center gap-4 text-[10px] px-3 py-1.5 rounded-full"
        style={{ background: "#0D1117CC", color: "#8892a0", border: "0.5px solid #2a3a50" }}
      >
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#0EFF9C" }} /> 70+</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#EFB027" }} /> 50–69</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} /> &lt;50</span>
      </div>
    </div>
  );
}
