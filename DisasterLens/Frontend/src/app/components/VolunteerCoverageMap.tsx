import { useEffect, useMemo, useState } from "react";
import { LocateFixed, Search } from "lucide-react";
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { latLngBounds, type LeafletMouseEvent } from "leaflet";

export type CoveragePoint = {
  id: string;
  teamName: string;
  locationName: string;
  lat: number;
  lng: number;
  radiusKm: number;
  submittedAt?: string;
};

type SelectedPoint = {
  lat: number;
  lng: number;
  radiusKm?: number;
  label?: string;
};

type VolunteerCoverageMapProps = {
  points: CoveragePoint[];
  selectedPoint?: SelectedPoint | null;
  onSelectPoint?: (point: SelectedPoint) => void;
  heightClassName?: string;
  recenterSignal?: number;
};

function FlyTo({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom, { animate: true });
  return null;
}

function ClickPicker({
  enabled,
  onPick,
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number, label?: string) => void;
}) {
  useMapEvents({
    click: async (event: LeafletMouseEvent) => {
      if (enabled) {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;
        let label = "Pinned location";
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}`,
          );
          const data = (await response.json()) as { display_name?: string };
          if (data.display_name) {
            label = data.display_name;
          }
        } catch (error) {
          console.error("Reverse geocoding failed", error);
        }
        onPick(lat, lng, label);
      }
    },
  });
  return null;
}

function FitToPoints({ points, signal }: { points: CoveragePoint[]; signal: number }) {
  const map = useMap();

  useEffect(() => {
    if (signal > 0 && points.length > 0) {
      const bounds = latLngBounds(points.map((point) => [point.lat, point.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.2));
    }
  }, [signal, points, map]);

  return null;
}

export function VolunteerCoverageMap({
  points,
  selectedPoint,
  onSelectPoint,
  heightClassName = "h-[560px]",
  recenterSignal = 0,
}: VolunteerCoverageMapProps) {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [center, setCenter] = useState<[number, number]>(() => {
    if (selectedPoint) {
      return [selectedPoint.lat, selectedPoint.lng];
    }
    if (points.length > 0) {
      return [points[0].lat, points[0].lng];
    }
    return [23.8103, 90.4125];
  });
  const [zoom, setZoom] = useState(9);

  const mappedPoints = useMemo(() => points.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng)), [points]);

  const handleSearch = async () => {
    const query = search.trim();
    if (!query) {
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
      );
      const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
      if (data.length === 0) {
        return;
      }
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      setCenter([lat, lng]);
      setZoom(13);
      if (onSelectPoint) {
        onSelectPoint({ lat, lng, label: data[0].display_name });
      }
    } catch (error) {
      console.error("Location search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCenter([lat, lng]);
        setZoom(14);
        if (onSelectPoint) {
          onSelectPoint({ lat, lng, label: "Current Location" });
        }
      },
      (error) => {
        console.error("GPS locate failed", error);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${heightClassName} flex flex-col`}>
      <div className="z-10 flex gap-2 border-b border-gray-200 bg-white p-3">
        <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSearch();
              }
            }}
            className="w-64 px-3 py-2 text-sm outline-none"
            placeholder="Search location"
            title="Search location"
          />
          <button
            type="button"
            onClick={() => void handleSearch()}
            className="border-l border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-50"
            title="Search"
            aria-label="Search"
            disabled={isSearching}
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleLocate}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
          title="Use GPS"
          aria-label="Use GPS"
        >
          <LocateFixed className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (mappedPoints.length > 0) {
              const bounds = latLngBounds(mappedPoints.map((point) => [point.lat, point.lng] as [number, number]));
              setCenter([bounds.getCenter().lat, bounds.getCenter().lng]);
              setZoom(10);
            }
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
          title="Recenter"
          aria-label="Recenter"
        >
          <span className="text-xs font-semibold">Center</span>
        </button>
      </div>

      <MapContainer center={center} zoom={zoom} className="h-full w-full min-h-0 flex-1">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo center={center} zoom={zoom} />
        <FitToPoints points={mappedPoints} signal={recenterSignal} />

        {mappedPoints.map((point) => (
          <div key={point.id}>
            <Circle
              center={[point.lat, point.lng]}
              radius={point.radiusKm * 1000}
              pathOptions={{ color: "#16a34a", fillColor: "#16a34a", fillOpacity: 0.18 }}
            />
            <CircleMarker center={[point.lat, point.lng]} radius={7} pathOptions={{ color: "#1d4ed8", fillColor: "#2563eb", fillOpacity: 1 }}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{point.teamName}</p>
                  <p>{point.locationName}</p>
                  <p>Radius: {point.radiusKm} km</p>
                  {point.submittedAt ? <p className="text-xs text-gray-500">{new Date(point.submittedAt).toLocaleString()}</p> : null}
                </div>
              </Popup>
            </CircleMarker>
          </div>
        ))}

        {selectedPoint ? (
          <>
            {selectedPoint.radiusKm ? (
              <Circle
                center={[selectedPoint.lat, selectedPoint.lng]}
                radius={selectedPoint.radiusKm * 1000}
                pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.12 }}
              />
            ) : null}
            <CircleMarker center={[selectedPoint.lat, selectedPoint.lng]} radius={7} pathOptions={{ color: "#d97706", fillColor: "#f59e0b", fillOpacity: 1 }}>
              <Popup>
                <p className="text-sm font-semibold">{selectedPoint.label || "Selected location"}</p>
              </Popup>
            </CircleMarker>
          </>
        ) : null}

        <ClickPicker
          enabled={Boolean(onSelectPoint)}
          onPick={(lat, lng, label) => {
            if (onSelectPoint) {
              onSelectPoint({ lat, lng, label: label || "Pinned location" });
            }
          }}
        />
      </MapContainer>
    </div>
  );
}
