'use client';

import { useState, useEffect, useMemo } from 'react';
import { Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

type Status = 'read' | 'accepted' | 'rejected';

type AnyDate =
  | Date
  | string
  | number
  | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
  | Timestamp
  | undefined
  | null;

interface BookingData {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  pickup: string;
  pickupDate: string;
  pickupTime?: string;
  returnLoc: string;
  returnDate: string;
  returnTime?: string;
  isBooked: boolean;
  reedStatus?: Status;
  createdAt?: AnyDate;
  bookingId?: number;

}

/* ------------ helpers: parse & format createdAt ---------------- */
function parseCreatedAt(input: AnyDate): number {
  if (!input) return -Infinity;

  if (input instanceof Timestamp) {
    return input.toDate().getTime();
  }

  if (typeof input === 'object' && input !== null && 'toDate' in input && typeof input.toDate === 'function') {
    return input.toDate().getTime();
  }

  if (typeof input === 'object' && input !== null && 'seconds' in input) {
    const t = input as { seconds?: number; nanoseconds?: number };
    return (t.seconds ?? 0) * 1000 + Math.floor((t.nanoseconds ?? 0) / 1e6);
  }

  if (typeof input === 'number') return input;

  if (typeof input === 'string') {
    let s = input.trim().replace(' at ', ' ');
    s = s.replace(/UTC\+(\d{1,2}):?(\d{2})?/, (_m, h: string, mm?: string) => {
      const HH = h.padStart(2, '0');
      const MM = (mm ?? '00').padStart(2, '0');
      return `GMT+${HH}${MM}`;
    });
    const t = Date.parse(s);
    if (!Number.isNaN(t)) return t;

    const d = new Date(input);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }

  return -Infinity;
}

function formatCreatedAt(input: AnyDate): string | undefined {
  const ms = parseCreatedAt(input);
  if (!Number.isFinite(ms)) return undefined;
  return new Date(ms).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/* ------------------------- component -------------------------- */
export default function IncompleteBookings({
  bookings,
  onDelete,
}: {
  bookings: BookingData[];
  onDelete?: (id: string) => Promise<void> | void;
}) {
  const [data, setData] = useState<BookingData[]>(bookings);
  const [selected, setSelected] = useState<BookingData | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState<Status>('read');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => setData(bookings), [bookings]);

  const incompleteSorted = useMemo(
    () =>
      data
        .filter((b) => !b.isBooked)
        .slice()
        .sort((a, b) => parseCreatedAt(b.createdAt) - parseCreatedAt(a.createdAt)),
    [data]
  );

  const openModal = (b: BookingData) => {
    setSelected(b);
    const initial = b.reedStatus ?? 'read';
    setStatus(initial);
    setOpen(true);
  };

  const closeModal = () => {
    if (deleting || savingStatus) return;
    setOpen(false);
    setSelected(null);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeModal();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, deleting, savingStatus, closeModal]);

  async function handleSaveStatus() {
    if (!selected?.id) return;
    try {
      setSavingStatus(true);
      await updateDoc(doc(db, 'bookings', selected.id), { reedStatus: status });
      setData((prev) =>
        prev.map((b) => (b.id === selected.id ? { ...b, reedStatus: status } : b))
      );
      setSelected((prev) => (prev ? { ...prev, reedStatus: status } : prev));
    } catch (e) {
      console.error(e);
      alert('Failed to update status.');
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleDeleteSelected() {
    if (!selected?.id) return;
    const ok = window.confirm('Delete this booking permanently?');
    if (!ok) return;

    try {
      setDeleting(true);
      if (onDelete) {
        await onDelete(selected.id);
      } else {
        await deleteDoc(doc(db, 'bookings', selected.id));
      }
      setData((prev) => prev.filter((b) => b.id !== selected.id));
      setDeleting(false);
      closeModal();
    } catch (e) {
      console.error(e);
      setDeleting(false);
      alert('Failed to delete booking.');
    }
  }

  if (incompleteSorted.length === 0) {
    return <p className="text-gray-600">No incomplete bookings.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm text-gray-700 font-medium">
        {incompleteSorted.length} incomplete booking{incompleteSorted.length > 1 ? 's' : ''}
      </h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Whatsapp</th>
              <th className="px-3 py-2 text-left">Pickup Location</th>
              <th className="px-3 py-2 text-left">Pickup Date</th>
              <th className="px-3 py-2 text-left">Return Location</th>
              <th className="px-3 py-2 text-left">Return Date</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {incompleteSorted.map((booking, idx) => {
              const s: Status = booking.reedStatus ?? 'read';
              const color =
                s === 'accepted' ? 'bg-emerald-500' : s === 'rejected' ? 'bg-rose-500' : 'bg-yellow-500';

              return (
                <tr key={booking.id} className="hover:bg-gray-50 even:bg-gray-50 text-gray-800">
                  <td className="relative px-3 py-2">
                    <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-r ${color}`} />
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2">{booking.name}</td>
                  <td className="px-3 py-2">{booking.email}</td>
                  <td className="px-3 py-2">+{booking.whatsapp}</td>
                  <td className="px-3 py-2">{booking.pickup}</td>
                  <td className="px-3 py-2">{booking.pickupDate}</td>
                  <td className="px-3 py-2">{booking.returnLoc}</td>
                  <td className="px-3 py-2">{booking.returnDate}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => openModal(booking)}
                      className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                      type="button"
                    >
                      <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {open && selected && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Close"
                type="button"
                disabled={deleting || savingStatus}
              >
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Detail label="Name" value={selected.name} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Whatsapp" value={`+${selected.whatsapp}`} />
                <Detail label="Pickup Location" value={selected.pickup} />
                <Detail label="Pickup Date-union Date" value={selected.pickupDate} />
                <Detail label="Pickup Time" value={selected.pickupTime} />
                <Detail label="Return Location" value={selected.returnLoc} />
                <Detail label="Return Date" value={selected.returnDate} />
                <Detail label="Return Time" value={selected.returnTime} />
                <Detail label="Saved At" value={formatCreatedAt(selected.createdAt)} />
                {selected.id && <Detail label="ID" value={selected.id} />}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="text-[11px] uppercase tracking-wide text-gray-600">Set Status</div>
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                  {(['read', 'accepted', 'rejected'] as Status[]).map((opt) => {
                    const active = status === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setStatus(opt)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition
                          ${active ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-800'}`}
                        disabled={savingStatus || deleting}
                      >
                        {opt[0].toUpperCase() + opt.slice(1)}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleSaveStatus}
                  type="button"
                  className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  disabled={savingStatus || deleting}
                >
                  {savingStatus ? 'Saving…' : 'Save Status'}
                </button>

                <div className="text-xs text-gray-500">
                  Current: <span className="font-medium">{selected.reedStatus ?? 'read'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t">
              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-60"
                type="button"
                disabled={deleting || !selected?.id}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 6h18M8 6l1-2h6l1 2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
                </svg>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>

              <button
                onClick={closeModal}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                type="button"
                disabled={deleting || savingStatus}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-sm text-gray-900 break-words">{value}</div>
    </div>
  );
}