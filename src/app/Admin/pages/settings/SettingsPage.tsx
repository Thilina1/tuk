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
    if (!form.whatsappPhoneId) return true; // made optional to ease button enablement
    return /^\d{6,20}$/.test(form.whatsappPhoneId.trim());
  }, [form.whatsappPhoneId]);

  const graphOk = useMemo(
    () => /^v\d+\.\d+$/.test(form.whatsappGraphVersion.trim()),
    [form.whatsappGraphVersion]
  );

  const waNumberOk = useMemo(() => {
    if (!form.whatsappNumber) return true; // optional
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
          // Set dirty to true if all fields are valid to enable Save button
          if (
            d.email &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim()) &&
            (!d.mobile || /^(\+?\d{9,15})$/.test(d.mobile.trim())) &&
            (!d.whatsappPhoneId || /^\d{6,20}$/.test(d.whatsappPhoneId.trim())) &&
            /^v\d+\.\d+$/.test(d.whatsappGraphVersion?.trim() ?? "v22.0") &&
            (!d.whatsappNumber || /^\d{9,15}$/.test(d.whatsappNumber.trim()))
          ) {
            setDirty(true);
          }
        } else {
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
          updatedAt: serverTimestamp(),
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

  // Helper to get disabled reason for Save button
  const getDisabledReason = () => {
    if (loading) return "Form is loading...";
    if (saving) return "Saving in progress...";
    if (!dirty) return "No changes to save.";
    if (!emailOk) return "Invalid email format.";
    if (!mobileOk) return "Invalid mobile number format.";
    if (!phoneIdOk) return "Invalid WhatsApp Phone ID.";
    if (!graphOk) return "Invalid WhatsApp Graph Version format.";
    if (!waNumberOk) return "Invalid WhatsApp Number format.";
    return "";
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <div className="relative group">
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`px-4 py-2 rounded-lg text-white text-sm font-semibold shadow-md transition ${
                !canSave ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
            {!canSave && (
              <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-2 px-3 -mt-12 right-0">
                {getDisabledReason()}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Loading settings…
          </div>
        ) : loadError ? (
          <div className="text-sm text-red-600 flex items-center gap-2 bg-red-50 rounded-lg p-4">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {loadError}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Admin Contact */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contact Email <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    placeholder="info@tuktukdrive.com"
                    onChange={(e) => onChange("email", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  />
                  {!emailOk && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Invalid email format.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contact Mobile <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.mobile}
                    placeholder="+9476XXXXXXX"
                    onChange={(e) => onChange("mobile", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  />
                  {!mobileOk && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Use digits only, optional +, 9–15 chars.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* WhatsApp API */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp API</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Access Token
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showToken ? "text" : "password"}
                      value={form.whatsappToken}
                      placeholder="EAAG... (from Meta)"
                      onChange={(e) => onChange("whatsappToken", e.target.value)}
                      className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken((s) => !s)}
                      className="px-4 py-3 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 shadow-md transition"
                      title={showToken ? "Hide token" : "Show token"}
                    >
                      {showToken ? "Hide" : "Show"}
                    </button>
                  </div>
                  {!showToken && form.whatsappToken && (
                    <p className="text-xs text-gray-600 mt-1">
                      Saved: {maskToken(form.whatsappToken)}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    Store tokens in Firestore with restricted access. Rotate regularly.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone ID <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.whatsappPhoneId}
                    placeholder="770899736101213"
                    onChange={(e) => onChange("whatsappPhoneId", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  />
                  {!phoneIdOk && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Phone ID should be numeric (6–20 digits).
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Graph Version
                  </label>
                  <input
                    type="text"
                    value={form.whatsappGraphVersion}
                    placeholder="v22.0"
                    onChange={(e) => onChange("whatsappGraphVersion", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  />
                  {!graphOk && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Format like v22.0
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Default Notify Number (E.164 without +) <span className="text-gray-500 text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.whatsappNumber}
                    placeholder="9476XXXXXXX"
                    onChange={(e) => onChange("whatsappNumber", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                  />
                  {!waNumberOk && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Enter digits only, 9–15 chars (e.g., 94768408835).
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Meta */}
            {form.updatedAt && (
              <p className="text-xs text-gray-600 mt-4">
                Last updated: {form.updatedAt.toDate().toLocaleString()}
              </p>
            )}

            {saveMsg && (
              <p
                className={`text-sm flex items-center gap-2 mt-4 p-3 rounded-lg ${
                  saveMsg.includes("✅") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                }`}
              >
                {saveMsg.includes("✅") ? (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {saveMsg}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}