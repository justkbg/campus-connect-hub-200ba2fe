import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Compass, Wifi, MapPin, QrCode, CheckCircle2, Loader2,
  Smartphone, Bell, Navigation,
} from "lucide-react";
import { UPSA_CENTER, upsaBuildings } from "@/components/CampusMap";

type ArrivalStep = "idle" | "locating" | "wifi" | "qr" | "ready";

// Simulated UPSA campus bounding radius (~600m)
const ON_CAMPUS_RADIUS_M = 600;

function distanceMeters(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function ArrivalPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ArrivalStep>("idle");
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wifiConnected, setWifiConnected] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);

  const onCampus = useMemo(() => {
    if (!coords) return null;
    return distanceMeters(coords, UPSA_CENTER) < ON_CAMPUS_RADIUS_M;
  }, [coords]);

  const nearestBuilding = useMemo(() => {
    if (!coords) return null;
    return [...upsaBuildings]
      .map((b) => ({ b, d: distanceMeters(coords, b.position) }))
      .sort((x, y) => x.d - y.d)[0];
  }, [coords]);

  const requestLocation = () => {
    setStep("locating");
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't supported on this device.");
      setStep("idle");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setAccuracy(pos.coords.accuracy);
        setStep("wifi");
      },
      (err) => {
        setError(err.message || "Couldn't read your location.");
        setStep("idle");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  // Simulate Wi-Fi probe (UPSA-Secure SSID)
  useEffect(() => {
    if (step !== "wifi") return;
    const id = setTimeout(() => {
      setWifiConnected(Math.random() > 0.2); // 80% chance "connected"
      setStep("qr");
    }, 1400);
    return () => clearTimeout(id);
  }, [step]);

  // Simulate QR confirm
  const confirmQr = () => {
    setQrScanned(true);
    setStep("ready");
  };

  const skipQr = () => {
    setStep("ready");
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero */}
      <div className="gradient-hero px-5 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="relative z-10 flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-primary-foreground/15 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-primary-foreground" />
          </button>
          <span className="text-[11px] font-semibold text-primary-foreground/80 tracking-wider uppercase">
            Smart Arrival
          </span>
          <span className="w-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-primary-foreground">Set up campus presence</h1>
          <p className="text-sm text-primary-foreground/70 mt-1 max-w-sm">
            We use your location, Wi-Fi, and QR check-in to give you live, context-aware help.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 -mt-4 space-y-3">
        {/* Step 1: Location */}
        <StepCard
          index={1}
          title="Allow location"
          desc="So we can show your live position and route you to any building."
          icon={MapPin}
          status={coords ? "done" : step === "locating" ? "active" : "todo"}
        >
          {!coords && step !== "locating" && (
            <button
              onClick={requestLocation}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold shadow-premium active:scale-[0.98] transition-transform"
            >
              <Compass className="w-3.5 h-3.5" />
              Enable location
            </button>
          )}
          {step === "locating" && (
            <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Pinpointing you…
            </p>
          )}
          {coords && (
            <div className="mt-3 text-xs text-muted-foreground space-y-1">
              <p>Lat {coords[0].toFixed(5)}, Lng {coords[1].toFixed(5)} {accuracy && `· ±${Math.round(accuracy)}m`}</p>
              <p className={onCampus ? "text-success font-semibold" : "text-warning font-semibold"}>
                {onCampus ? "✓ You're on UPSA campus" : "Off-campus — directions still work"}
              </p>
            </div>
          )}
          {error && <p className="mt-2 text-[11px] text-destructive">{error}</p>}
        </StepCard>

        {/* Step 2: WiFi */}
        <StepCard
          index={2}
          title="Detect campus Wi-Fi"
          desc="Connect to UPSA-Secure for free high-speed access and verified presence."
          icon={Wifi}
          status={wifiConnected ? "done" : step === "wifi" ? "active" : (step === "qr" || step === "ready") ? "done" : "todo"}
        >
          {step === "wifi" && (
            <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking SSID UPSA-Secure…
            </p>
          )}
          {(step === "qr" || step === "ready") && (
            <p className={`mt-3 text-xs font-medium ${wifiConnected ? "text-success" : "text-muted-foreground"}`}>
              {wifiConnected ? "✓ Connected to UPSA-Secure" : "Wi-Fi not detected — using mobile data"}
            </p>
          )}
        </StepCard>

        {/* Step 3: QR */}
        <StepCard
          index={3}
          title="Scan a gate / office QR (optional)"
          desc="Verifies your check-in and unlocks contextual prompts for the location."
          icon={QrCode}
          status={qrScanned ? "done" : step === "qr" ? "active" : step === "ready" ? "done" : "todo"}
        >
          {step === "qr" && !qrScanned && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={confirmQr}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-xl py-2.5 text-xs font-semibold active:scale-[0.98] transition-transform"
              >
                <QrCode className="w-3.5 h-3.5" />
                Simulate scan
              </button>
              <button
                onClick={skipQr}
                className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted-foreground"
              >
                Skip
              </button>
            </div>
          )}
          {qrScanned && (
            <p className="mt-3 text-xs text-success font-medium">✓ Checked in at Main Gate</p>
          )}
        </StepCard>

        {/* Ready summary */}
        <AnimatePresence>
          {step === "ready" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-2xl p-4 shadow-card border border-success/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">You're all set</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {nearestBuilding ? (
                      <>Nearest landmark: <span className="font-semibold text-foreground">{nearestBuilding.b.name}</span> ({Math.round(nearestBuilding.d)}m)</>
                    ) : (
                      "Location ready"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  to={nearestBuilding ? `/map?to=${nearestBuilding.b.id}` : "/map"}
                  className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-xl py-2.5 text-xs font-semibold shadow-premium"
                >
                  <Navigation className="w-3.5 h-3.5" /> Open map
                </Link>
                <Link
                  to="/inbox"
                  className="inline-flex items-center justify-center gap-1.5 bg-muted text-foreground rounded-xl py-2.5 text-xs font-semibold"
                >
                  <Bell className="w-3.5 h-3.5" /> Smart inbox
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Install prompt */}
        <div className="bg-card rounded-2xl p-4 shadow-card mt-2">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Install CIS on your phone</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Add to home screen for one-tap access at gates, queues, and lectures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  index, title, desc, icon: Icon, status, children,
}: {
  index: number;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "todo" | "active" | "done";
  children?: React.ReactNode;
}) {
  const tone =
    status === "done" ? "bg-success/10 text-success border-success/20" :
    status === "active" ? "bg-primary/10 text-primary border-primary/20" :
    "bg-muted text-muted-foreground border-border";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl p-4 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${tone}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Step {index}
            </span>
            {status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
          </div>
          <p className="text-sm font-semibold text-foreground mt-0.5">{title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}
