import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Bot, 
  Layers, 
  Settings, 
  ShieldCheck, 
  LineChart, 
  CheckCircle, 
  X, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Sliders,
  Sparkles
} from "lucide-react";
import { DashboardData } from "./types";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import AdminPanel from "./components/AdminPanel";
import { defaultDashboardData } from "./defaultData";

type RoleType = "executive" | "admin";

interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export default function App() {
  const [role, setRole] = useState<RoleType>("executive");
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [publishedState, setPublishedState] = useState<DashboardData>(defaultDashboardData);
  const [draftState, setDraftState] = useState<DashboardData>(defaultDashboardData);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const lastUpdatedRef = React.useRef<string | undefined>(undefined);
  const notificationIdRef = React.useRef<number>(0);

  // Show customized visual alerts
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    notificationIdRef.current += 1;
    const id = Date.now() + notificationIdRef.current;
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Fetch current database state from Express server on boot
  const fetchState = async () => {
    try {
      const res = await fetch("/api/dashboard-state");
      if (res.ok) {
        const data = await res.json();
        setPublishedState(data.published);
        setDraftState(data.draft);
        lastUpdatedRef.current = data.published.lastUpdated;
      }
    } catch (e) {
      console.error("Failed to load dashboard state from backend", e);
      showNotification("Could not reach backend state server, using secure offline memory.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    
    // Support URL routing via query param or hash: e.g. ?role=admin or #admin
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const roleParam = params.get("role");
    
    const hasAdminMarker = roleParam === "admin" || hash === "#admin" || sessionStorage.getItem("hospital_ops_admin") === "true";
    
    if (roleParam === "admin" || hash === "#admin") {
      sessionStorage.setItem("hospital_ops_admin", "true");
    }
    
    if (hasAdminMarker) {
      setIsAdminSession(true);
      if (roleParam === "admin" || hash === "#admin") {
        setRole("admin");
      } else if (roleParam === "executive") {
        setRole("executive");
      } else {
        setRole("admin");
      }
    } else {
      setRole("executive");
      setIsAdminSession(false);
    }

    // Set up background polling to auto-update the viewer with published changes
    const intervalId = setInterval(() => {
      fetch("/api/dashboard-state")
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch state");
        })
        .then(data => {
          if (lastUpdatedRef.current && lastUpdatedRef.current !== data.published.lastUpdated) {
            lastUpdatedRef.current = data.published.lastUpdated;
            setPublishedState(data.published);
            showNotification("Viewer dashboard has been updated with the latest published administrative metrics.", "success");
          } else if (!lastUpdatedRef.current) {
            lastUpdatedRef.current = data.published.lastUpdated;
            setPublishedState(data.published);
          }
        })
        .catch(err => console.debug("Quiet background update check failed:", err));
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Publish Admin Draft to live public view
  const handlePublish = async (updatedData: DashboardData) => {
    setPublishing(true);
    try {
      // Sync with server state
      const response = await fetch("/api/publish-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: updatedData })
      });
      
      if (response.ok) {
        const result = await response.json();
        setPublishedState(result.published);
        setDraftState(result.published);
        lastUpdatedRef.current = result.published.lastUpdated;
        showNotification("All operational CSV files committed and updated on the customer view!", "success");
      } else {
        throw new Error("Failed to write state on backend");
      }
    } catch (err: any) {
      // Offline fallback if server is down (client state update only)
      const now = new Date().toISOString();
      const updatedLocal = { ...updatedData, lastUpdated: now };
      setPublishedState(updatedLocal);
      setDraftState(updatedLocal);
      showNotification("Offline mode: Saved changes locally to browser session.", "success");
    } finally {
      setPublishing(false);
    }
  };

  // Reset sandbox draft back to standard baseline
  const handleReset = async () => {
    try {
      const response = await fetch("/api/reset-state", { method: "POST" });
      if (response.ok) {
        const result = await response.json();
        setDraftState(result.draft);
        showNotification("Sandboxed draft data has been reset to standard hospital YTD defaults.", "success");
      }
    } catch (err: any) {
      setDraftState(JSON.parse(JSON.stringify(defaultDashboardData)));
      showNotification("Offline mode: Sandbox reset to local YTD defaults.", "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans" id="hospital-ops-portal-root">
      
      {/* GLOBAL TOASTER FOR NOTIFICATIONS */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex gap-3 items-start justify-between transition-all duration-300 transform translate-y-0 ${
              n.type === "success" 
                ? "bg-emerald-50 text-emerald-900 border-emerald-200/80" 
                : n.type === "error"
                ? "bg-rose-50 text-rose-900 border-rose-200/80"
                : "bg-blue-50 text-blue-900 border-blue-200/80"
            }`}
          >
            <div className="flex gap-2">
              <CheckCircle size={16} className={`shrink-0 mt-0.5 ${
                n.type === "success" ? "text-emerald-600" : n.type === "error" ? "text-rose-600" : "text-blue-600"
              }`} />
              <p className="text-xs font-semibold leading-relaxed">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="text-slate-400 hover:text-slate-600 shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* CORE PORTAL NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/15 flex items-center justify-center">
            <Activity size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight leading-none">
                Sophia Medical Group
              </h1>
              <span className="text-[9px] font-mono font-bold tracking-widest bg-slate-100 border border-slate-200 text-slate-600 py-0.5 px-2 rounded-full uppercase">
                Enterprise v4.1
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Hospital Operations AI Assistant</p>
          </div>
        </div>

        {/* View Selection Toggle */}
        {isAdminSession && (
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60 max-w-sm w-full sm:w-auto">
            <button
              onClick={() => {
                setRole("executive");
                // Update URL query parameters
                const newUrl = `${window.location.origin}${window.location.pathname}?role=executive`;
                window.history.pushState({ path: newUrl }, "", newUrl);
                showNotification("Switched view to Executive Dashboard", "info");
              }}
              className={`flex-1 sm:flex-none py-2 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                role === "executive"
                  ? "bg-white text-blue-600 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <LineChart size={14} />
              <span>Executive Board View</span>
            </button>

            <button
              onClick={() => {
                setRole("admin");
                // Update URL query parameters
                const newUrl = `${window.location.origin}${window.location.pathname}?role=admin`;
                window.history.pushState({ path: newUrl }, "", newUrl);
                showNotification("Switched view to administrative control sandbox", "info");
              }}
              className={`flex-1 sm:flex-none py-2 px-4 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                role === "admin"
                  ? "bg-white text-amber-700 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <ShieldCheck size={14} />
              <span className="flex items-center gap-1">
                <span>Admin Room</span>
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
              </span>
            </button>
          </div>
        )}

      </header>

      {/* CORE FRAMEWORK STAGE */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center gap-3 py-24">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <Activity size={16} className="text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-500 font-mono">Securing system interfaces...</span>
        </div>
      ) : (
        <main className="flex-grow max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
          
          {role === "executive" ? (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <div className="space-y-1">
                  <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500 animate-pulse" />
                    <span>Welcome back, Director</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review live metrics, evaluate clinic performance, and consult your custom AI Hospital Analyst below.
                  </p>
                </div>
                
                <div className="py-1 px-3 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100 self-start sm:self-auto flex items-center gap-1.5">
                  <Bot size={12} />
                  <span>Sophia AI Agent Online</span>
                </div>
              </div>

              {/* Public Dashboard */}
              <ExecutiveDashboard 
                data={publishedState} 
                onNotify={showNotification} 
              />
            </div>
          ) : (
            // Administrative Control Area
            <AdminPanel
              draftState={draftState}
              setDraftState={setDraftState}
              onPublish={handlePublish}
              onReset={handleReset}
              onNotify={showNotification}
              publishing={publishing}
            />
          )}

        </main>
      )}

      {/* COMPACT FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-6 px-8 text-center text-slate-400 text-[10px] tracking-wide mt-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <Activity size={12} className="text-blue-500" />
          <span>Sophia Clinical Intelligence Portal &copy; 2026. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <span className="hover:text-slate-600 cursor-pointer">Security Protocol ISO-27001</span>
          <span>&bull;</span>
          <span className="hover:text-slate-600 cursor-pointer">HIPAA Compliant Ingestion</span>
        </div>
      </footer>

    </div>
  );
}
