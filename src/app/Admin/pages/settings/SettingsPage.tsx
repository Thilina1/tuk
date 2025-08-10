"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "@/config/firebase";
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from "firebase/firestore";

type SettingsFirestore = {
  email?: string;
  mobile?: string;
  whatsappToken?: string;
  whatsappPhoneId?: string;
  whatsappGraphVersion?: string;
  whatsappNumber?: string; // E.164 without +
  updatedAt?: Timestamp;    // Firestore Timestamp when read
};

type SettingsForm = {
  email: string;
  mobile: string;
  whatsappToken: string;
  whatsappPhoneId: string;
  whatsappGraphVersion: string;
  whatsappNumber: string;    // E.164 without +
  updatedAt?: Timestamp | null;
};

const COLLECTION = "settings";
const DOC_ID = "contact";

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>({
    email: "",
    mobile: "",
    whatsappToken: "",
    whatsappPhoneId: "",
    whatsappGraphVersion: "v22.0",
    whatsappNumber: "",
    updatedAt: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Token reveal/mask
  const [showToken, setShowToken] = useState(false);

  const docRef = doc(db, COLLECTION, DOC_ID);

  // --- Helpers ---
  const maskToken = (t: string) => {
    if (!t) return "";
    if (showToken) return t;
    if (t.length <= 10) return "*".repeat(t.length);
    const head = t.slice(0, 4);
    const tail = t.slice(-4);
    return `${head}${"*".repeat(t.length - 8)}${tail}`;
  };

  const onChange = <K extends keyof SettingsForm>(key: K, val: SettingsForm[K]) => {
    setForm((p) => ({ ...p, [key]: val }));
    setDirty(true);
    setSaveMsg(null);
  };

  const emailOk = useMemo(() => {
    if (!form.email) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  }, [form.email]);

  const mobileOk = useMemo(() => {
    if (!form.mobile) return true; // optional
    return /^(\+?\d{9,15})$/.test(form.mobile.trim());
  }, [form.mobile]);

  const phoneIdOk = useMemo(() => {
    // Meta phone IDs are numeric strings
    if (!form.whatsappPhoneId) return false;
    return /^\d{6,20}$/.test(form.whatsappPhoneId.trim());
  }, [form.whatsappPhoneId]);

  const graphOk = useMemo(
    () => /^v\d+\.\d+$/.test(form.whatsappGraphVersion.trim()),
    [form.whatsappGraphVersion]
  );

  const waNumberOk = useMemo(() => {
    if (!form.whatsappNumber) return true; // optional
    // stored as E.164 without + (e.g., 94768408835)
    return /^\d{9,15}$/.test(form.whatsappNumber.trim());
  }, [form.whatsappNumber]);

  const canSave =
    !loading &&
    !saving &&
    dirty &&
    emailOk &&
    mobileOk &&
    phoneIdOk &&
    graphOk &&
    waNumberOk;

  // --- Load existing settings ---
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const d = snap.data() as SettingsFirestore;
          setForm({
            email: d.email ?? "",
            mobile: d.mobile ?? "",
            whatsappToken: d.whatsappToken ?? "",
            whatsappPhoneId: d.whatsappPhoneId ?? "",
            whatsappGraphVersion: d.whatsappGraphVersion ?? "v22.0",
            whatsappNumber: d.whatsappNumber ?? "",
            updatedAt: d.updatedAt ?? null,
          });
          setDirty(false);
        } else {
          // First time — keep defaults
          setDirty(false);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load settings.";
        setLoadError(message);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Save ---
  const handleSave = async () => {
    if (!canSave) return;
    try {
      setSaving(true);
      await setDoc(
        docRef,
        {
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          whatsappToken: form.whatsappToken.trim(),
          whatsappPhoneId: form.whatsappPhoneId.trim(),
          whatsappGraphVersion: form.whatsappGraphVersion.trim(),
          whatsappNumber: form.whatsappNumber.trim(),
          updatedAt: serverTimestamp(), // FieldValue on write, ok for Firestore
        },
        { merge: true }
      );
      setDirty(false);
      setSaveMsg("Saved ✅");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save.";
      setSaveMsg(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`px-4 py-2 rounded text-white text-sm font-medium shadow ${
            !canSave ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading settings…</div>
      ) : loadError ? (
        <div className="text-sm text-red-600">{loadError}</div>
      ) : (
        <div className="space-y-6">
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Admin Contact</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={form.email}
                placeholder="info@tuktukdrive.com"
                onChange={(e) => onChange("email", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
              {!emailOk && <p className="text-xs text-red-600 mt-1">Invalid email format.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Mobile</label>
              <input
                type="tel"
                value={form.mobile}
                placeholder="+9476XXXXXXX"
                onChange={(e) => onChange("mobile", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
              {!mobileOk && (
                <p className="text-xs text-red-600 mt-1">Use digits only, optional +, 9–15 chars.</p>
              )}
            </div>
          </div>

          {/* WhatsApp Config */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">WhatsApp API</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
              <div className="flex items-center gap-2">
                <input
                  type={showToken ? "text" : "password"}
                  value={form.whatsappToken}
                  placeholder="EAAG... (from Meta)"
                  onChange={(e) => onChange("whatsappToken", e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((s) => !s)}
                  className="px-3 py-2 text-xs rounded border border-gray-300 hover:bg-gray-50"
                  title={showToken ? "Hide token" : "Show token"}
                >
                  {showToken ? "Hide" : "Show"}
                </button>
              </div>
              {!showToken && form.whatsappToken && (
                <p className="text-xs text-gray-500 mt-1">Saved: {maskToken(form.whatsappToken)}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Store tokens in Firestore with restricted access. Rotate regularly.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone ID</label>
              <input
                type="text"
                value={form.whatsappPhoneId}
                placeholder="770899736101213"
                onChange={(e) => onChange("whatsappPhoneId", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
              {!phoneIdOk && (
                <p className="text-xs text-red-600 mt-1">Phone ID should be numeric (6–20 digits).</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Graph Version</label>
              <input
                type="text"
                value={form.whatsappGraphVersion}
                placeholder="v22.0"
                onChange={(e) => onChange("whatsappGraphVersion", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
              {!graphOk && <p className="text-xs text-red-600 mt-1">Format like v22.0</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Notify Number (E.164 without +)
              </label>
              <input
                type="text"
                value={form.whatsappNumber}
                placeholder="9476XXXXXXX"
                onChange={(e) => onChange("whatsappNumber", e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
              {!waNumberOk && (
                <p className="text-xs text-red-600 mt-1">
                  Enter digits only, 9–15 chars (e.g., 94768408835).
                </p>
              )}
            </div>
          </div>

          {/* Meta */}
          {form.updatedAt && (
            <p className="text-xs text-gray-500">
              Last updated: {form.updatedAt.toDate().toLocaleString()}
            </p>
          )}

          {saveMsg && (
            <p className={`text-sm ${saveMsg.includes("✅") ? "text-green-700" : "text-red-600"}`}>
              {saveMsg}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
