'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

interface DailyRate {
  duration: string;
  pricePerDay: number;
}

interface OptionalExtra {
  name: string;
  price: number;
  type: string;
}

interface MasterPrices {
  dailyRates: DailyRate[];
  licenseFee: {
    amount: number;
    description: string;
  };
  optionalExtras: OptionalExtra[];
  refundableDeposit: {
    amount: number;
    description: string;
  };
  updatedAt?: Timestamp;
}

type SectionKey = 'dailyRates' | 'licenseFee' | 'optionalExtras' | 'refundableDeposit';

const COLLECTION = 'masterPrices';
const DOC_ID = 'pricing';

export default function MasterPricesPage() {
  const [form, setForm] = useState<MasterPrices>({
    dailyRates: [
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
      { duration: '', pricePerDay: 0 },
    ],
    licenseFee: { amount: 0, description: '' },
    optionalExtras: [
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
      { name: '', price: 0, type: '' },
    ],
    refundableDeposit: { amount: 0, description: '' },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionStates, setSectionStates] = useState({
    dailyRates: { dirty: false, saving: false, saveMsg: null as string | null },
    licenseFee: { dirty: false, saving: false, saveMsg: null as string | null },
    optionalExtras: { dirty: false, saving: false, saveMsg: null as string | null },
    refundableDeposit: { dirty: false, saving: false, saveMsg: null as string | null },
  });

  const docRef = doc(db, COLLECTION, DOC_ID);

  // Fetch pricing data from Firestore
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data() as MasterPrices;
          // Validate structure: ensure 8 daily rates and 8 optional extras
          if (data.dailyRates?.length !== 8 || data.optionalExtras?.length !== 8) {
            throw new Error('Invalid data structure: Expected 8 daily rates and 8 optional extras.');
          }
          setForm({
            dailyRates: data.dailyRates,
            licenseFee: data.licenseFee || { amount: 0, description: '' },
            optionalExtras: data.optionalExtras,
            refundableDeposit: data.refundableDeposit || { amount: 0, description: '' },
            updatedAt: data.updatedAt,
          });
        } else {
          setError('Pricing data not found. Initialize by saving each section.');
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load pricing data from Firestore.';
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update section state
  const updateSectionState = (
    section: SectionKey,
    updates: Partial<(typeof sectionStates)[SectionKey]>
  ) => {
    setSectionStates((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
  };

  // Save handlers for each section
  const saveDailyRates = async () => {
    if (sectionStates.dailyRates.saving || !sectionStates.dailyRates.dirty) return;
    try {
      updateSectionState('dailyRates', { saving: true });
      await setDoc(docRef, { dailyRates: form.dailyRates, updatedAt: serverTimestamp() }, { merge: true });
      updateSectionState('dailyRates', { dirty: false, saveMsg: 'Saved successfully ✅' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save daily rates.';
      updateSectionState('dailyRates', { saveMsg: message });
    } finally {
      updateSectionState('dailyRates', { saving: false });
    }
  };

  const saveLicenseFee = async () => {
    if (sectionStates.licenseFee.saving || !sectionStates.licenseFee.dirty) return;
    try {
      updateSectionState('licenseFee', { saving: true });
      await setDoc(docRef, { licenseFee: form.licenseFee, updatedAt: serverTimestamp() }, { merge: true });
      updateSectionState('licenseFee', { dirty: false, saveMsg: 'Saved successfully ✅' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save license fee.';
      updateSectionState('licenseFee', { saveMsg: message });
    } finally {
      updateSectionState('licenseFee', { saving: false });
    }
  };

  const saveOptionalExtras = async () => {
    if (sectionStates.optionalExtras.saving || !sectionStates.optionalExtras.dirty) return;
    try {
      updateSectionState('optionalExtras', { saving: true });
      await setDoc(docRef, { optionalExtras: form.optionalExtras, updatedAt: serverTimestamp() }, { merge: true });
      updateSectionState('optionalExtras', { dirty: false, saveMsg: 'Saved successfully ✅' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save optional extras.';
      updateSectionState('optionalExtras', { saveMsg: message });
    } finally {
      updateSectionState('optionalExtras', { saving: false });
    }
  };

  const saveRefundableDeposit = async () => {
    if (sectionStates.refundableDeposit.saving || !sectionStates.refundableDeposit.dirty) return;
    try {
      updateSectionState('refundableDeposit', { saving: true });
      await setDoc(docRef, { refundableDeposit: form.refundableDeposit, updatedAt: serverTimestamp() }, { merge: true });
      updateSectionState('refundableDeposit', { dirty: false, saveMsg: 'Saved successfully ✅' });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save refundable deposit.';
      updateSectionState('refundableDeposit', { saveMsg: message });
    } finally {
      updateSectionState('refundableDeposit', { saving: false });
    }
  };

  // Update handlers
  const updateField = <K extends SectionKey>(key: K, value: MasterPrices[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    updateSectionState(key, { dirty: true, saveMsg: null });
  };

  const updateDailyRate = (index: number, field: keyof DailyRate, value: string | number) => {
    const newRates = form.dailyRates.map((rate, i) =>
      i === index ? { ...rate, [field]: field === 'pricePerDay' ? Number(value) : value } : rate
    );
    updateField('dailyRates', newRates);
  };

  const updateOptionalExtra = (index: number, field: keyof OptionalExtra, value: string | number) => {
    const newExtras = form.optionalExtras.map((extra, i) =>
      i === index ? { ...extra, [field]: field === 'price' ? Number(value) : value } : extra
    );
    updateField('optionalExtras', newExtras);
  };

  const updateLicenseFee = (field: 'amount' | 'description', value: string | number) => {
    const newFee = { ...form.licenseFee, [field]: field === 'amount' ? Number(value) : value };
    updateField('licenseFee', newFee);
  };

  const updateRefundableDeposit = (field: 'amount' | 'description', value: string | number) => {
    const newDeposit = { ...form.refundableDeposit, [field]: field === 'amount' ? Number(value) : value };
    updateField('refundableDeposit', newDeposit);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600 animate-pulse">Loading pricing data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">TukTuk Pricing Editor</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
        )}

        {/* Daily Rental Rates */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Daily Rental Rates</h3>
            <button
              onClick={saveDailyRates}
              disabled={!sectionStates.dailyRates.dirty || sectionStates.dailyRates.saving}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.dailyRates.dirty || sectionStates.dailyRates.saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'
              }`}
            >
              {sectionStates.dailyRates.saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Rates'
              )}
            </button>
          </div>
          {sectionStates.dailyRates.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.dailyRates.saveMsg.includes('✅')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {sectionStates.dailyRates.saveMsg}
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">Duration</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">Price / Day ($)</th>
                </tr>
              </thead>
              <tbody>
                {form.dailyRates.map((rate, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={rate.duration}
                        onChange={(e) => updateDailyRate(index, 'duration', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        placeholder="e.g., 1–4 days"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={rate.pricePerDay}
                        onChange={(e) => updateDailyRate(index, 'pricePerDay', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        min="0"
                        step="0.01"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* License Fee */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">🪪 License Fee</h3>
            <button
              onClick={saveLicenseFee}
              disabled={!sectionStates.licenseFee.dirty || sectionStates.licenseFee.saving}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.licenseFee.dirty || sectionStates.licenseFee.saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'
              }`}
            >
              {sectionStates.licenseFee.saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save License Fee'
              )}
            </button>
          </div>
          {sectionStates.licenseFee.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.licenseFee.saveMsg.includes('✅')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {sectionStates.licenseFee.saveMsg}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={form.licenseFee.amount}
                onChange={(e) => updateLicenseFee('amount', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.licenseFee.description}
                onChange={(e) => updateLicenseFee('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                rows={4}
                placeholder="Describe the license fee..."
              />
            </div>
          </div>
        </section>

        {/* Optional Extras */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Optional Extras</h3>
            <button
              onClick={saveOptionalExtras}
              disabled={!sectionStates.optionalExtras.dirty || sectionStates.optionalExtras.saving}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.optionalExtras.dirty || sectionStates.optionalExtras.saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'
              }`}
            >
              {sectionStates.optionalExtras.saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Extras'
              )}
            </button>
          </div>
          {sectionStates.optionalExtras.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.optionalExtras.saveMsg.includes('✅')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {sectionStates.optionalExtras.saveMsg}
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">Price ($)</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-indigo-900">Type</th>
                </tr>
              </thead>
              <tbody>
                {form.optionalExtras.map((extra, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={extra.name}
                        onChange={(e) => updateOptionalExtra(index, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        placeholder="e.g., Train Transfer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={extra.price}
                        onChange={(e) => updateOptionalExtra(index, 'price', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={extra.type}
                        onChange={(e) => updateOptionalExtra(index, 'type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-gray-50"
                        placeholder="e.g., per unit"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Refundable Deposit */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">💰 Refundable Deposit</h3>
            <button
              onClick={saveRefundableDeposit}
              disabled={!sectionStates.refundableDeposit.dirty || sectionStates.refundableDeposit.saving}
              className={`px-6 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
                !sectionStates.refundableDeposit.dirty || sectionStates.refundableDeposit.saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400'
              }`}
            >
              {sectionStates.refundableDeposit.saving ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Deposit'
              )}
            </button>
          </div>
          {sectionStates.refundableDeposit.saveMsg && (
            <div
              className={`mb-4 p-4 rounded-lg text-sm ${
                sectionStates.refundableDeposit.saveMsg.includes('✅')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {sectionStates.refundableDeposit.saveMsg}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                value={form.refundableDeposit.amount}
                onChange={(e) => updateRefundableDeposit('amount', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.refundableDeposit.description}
                onChange={(e) => updateRefundableDeposit('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white"
                rows={4}
                placeholder="Describe the refundable deposit..."
              />
            </div>
          </div>
        </section>

        {/* Last Updated */}
        {form.updatedAt && (
          <p className="text-xs text-gray-500 mt-6">
            Last updated: {form.updatedAt.toDate().toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}