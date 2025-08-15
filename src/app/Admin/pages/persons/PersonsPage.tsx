'use client';

import { useEffect, useMemo, useState } from 'react';
import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Person {
  id?: string;
  name: string;
  idNumber: string;
  licenseNumber: string;
  dateOfBirth: string;
  mobile: string;
  email: string;
  location: string;
  district: string;
  province: string;
  isActive?: boolean;
  number?: number;
}

const provinceDistricts: Record<string, string[]> = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
  Eastern: ['Trincomalee', 'Batticaloa', 'Ampara'],
};

export default function PersonsPage() {
  const [form, setForm] = useState<Person>({
    name: '',
    idNumber: '',
    licenseNumber: '',
    dateOfBirth: '',
    mobile: '',
    email: '',
    location: '',
    district: '',
    province: '',
    isActive: true,
  });

  const [searchFilters, setSearchFilters] = useState({
    name: '',
    district: '',
    province: '',
  });

  const [persons, setPersons] = useState<Person[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sortAndNumber = (rows: Person[]) =>
    rows
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      .map((p, i) => ({ ...p, number: i + 1 }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'persons'));
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Person, 'id'>),
      })) as Person[];
      setPersons(sortAndNumber(data));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = <K extends keyof Person>(key: K, value: Person[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openModal = (person?: Person) => {
    if (person) {
      setEditingId(person.id || null);
      setForm({
        id: person.id,
        name: person.name || '',
        idNumber: person.idNumber || '',
        licenseNumber: person.licenseNumber || '',
        dateOfBirth: person.dateOfBirth || '',
        mobile: person.mobile || '',
        email: person.email || '',
        location: person.location || '',
        district: person.district || '',
        province: person.province || '',
        isActive: person.isActive ?? true,
      });
    } else {
      setEditingId(null);
      setForm({
        name: '',
        idNumber: '',
        licenseNumber: '',
        dateOfBirth: '',
        mobile: '',
        email: '',
        location: '',
        district: '',
        province: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!form.name.trim()) return alert('Name is required.');
      if (!form.province) return alert('Province is required.');
      if (!form.district) return alert('District is required.');
  
      const payload: Omit<Person, 'id' | 'number'> = {
        name: form.name,
        idNumber: form.idNumber,
        licenseNumber: form.licenseNumber,
        dateOfBirth: form.dateOfBirth,
        mobile: form.mobile,
        email: form.email,
        location: form.location,
        district: form.district,
        province: form.province,
        isActive: form.isActive,
      };
  
      if (editingId) {
        const ref = doc(db, 'persons', editingId);
        await updateDoc(ref, payload);
        setPersons((prev) =>
          sortAndNumber(prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)))
        );
      } else {
        const ref = await addDoc(collection(db, 'persons'), payload);
        setPersons((prev) => sortAndNumber([...prev, { ...payload, id: ref.id }]));
      }
  
      setShowModal(false);
      setEditingId(null);
      setForm({
        name: '',
        idNumber: '',
        licenseNumber: '',
        dateOfBirth: '',
        mobile: '',
        email: '',
        location: '',
        district: '',
        province: '',
        isActive: true,
      });
    } catch (e) {
      console.error(e);
      alert('Failed to save person.');
    }
  };

  const toggleActiveStatus = async (person: Person) => {
    if (!person.id) return;
    try {
      const ref = doc(db, 'persons', person.id);
      const next = !person.isActive;
      await updateDoc(ref, { isActive: next });
      setPersons((prev) => prev.map((p) => (p.id === person.id ? { ...p, isActive: next } : p)));
    } catch (e) {
      console.error(e);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'persons', id));
      setPersons((prev) => sortAndNumber(prev.filter((p) => p.id !== id)));
    } catch (e) {
      console.error(e);
      alert('Failed to delete person.');
    }
  };

  const filtered = useMemo(
    () =>
      persons
        .filter((p) => p.name.toLowerCase().includes(searchFilters.name.toLowerCase()))
        .filter((p) => (searchFilters.province ? p.province === searchFilters.province : true))
        .filter((p) => (searchFilters.district ? p.district === searchFilters.district : true)),
    [persons, searchFilters]
  );

  // Columns: ['#','Name','ID','License','DOB','Mobile','Location','District','Status','Actions'] (10 columns total)
  // widths sum to 100%
  const colWidths = ['4%', '16%', '12%', '12%', '9%', '10%', '13%', '11%', '6%', '7%'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900"></h2>
        <button
          onClick={() => openModal()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          type="button"
        >
          + Add Person
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          value={searchFilters.name}
          onChange={(e) => setSearchFilters((s) => ({ ...s, name: e.target.value }))}
          placeholder="Search by name"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={searchFilters.province}
          onChange={(e) => setSearchFilters((s) => ({ ...s, province: e.target.value, district: '' }))}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Provinces</option>
          {Object.keys(provinceDistricts).map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>
        <select
          value={searchFilters.district}
          onChange={(e) => setSearchFilters((s) => ({ ...s, district: e.target.value }))}
          disabled={!searchFilters.province}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
        >
          <option value="">All Districts</option>
          {provinceDistricts[searchFilters.province]?.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
                <div className="flex justify-center items-center h-40">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="ml-3 text-gray-600">Loading trainers...</span>
              </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full table-fixed text-sm">
            <colgroup>
              {colWidths.map((w, i) => (
                <col key={i} style={{ width: w }} />
              ))}
            </colgroup>

            <thead className="bg-gray-50">
              <tr className="text-left">
                {['#', 'Name',  'License No', 'Date of Birth', 'Mobile', 'Location',"district", 'Status', 'Actions'].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filtered.map((p, i) => (
                <tr key={p.id} className="align-top hover:bg-blue-50/20">
                  <td className="px-3 py-3 text-xs text-gray-700">{p.number ?? i + 1}</td>
                  <td className="px-3 py-3 text-xs text-gray-900 break-words">{p.name}</td>
                  <td className="px-3 py-3 text-xs text-gray-700 break-words">{p.licenseNumber}</td>
                  <td className="px-3 py-3 text-xs text-gray-700">{p.dateOfBirth}</td>
                  <td className="px-3 py-3 text-xs text-gray-700">{p.mobile}</td>
                  <td className="px-3 py-3 text-xs text-gray-700 break-words">{p.location}</td>
                  <td className="px-3 py-3 text-xs text-gray-700 break-words">{p.district}</td>


                  {/* Status: small pill, click to toggle */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <button
                      onClick={() => toggleActiveStatus(p)}
                      type="button"
                      title="Click to toggle status"
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs shadow-sm
                                  ${p.isActive ? "bg-green-100 text-green-800"
                                               : 'bg-red-100 text-red-800 '}`}
                    >
                      {p.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  {/* Actions: small pills */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(p)}
                        title="Edit"
                        type="button"
                        className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold
                                   text-white shadow-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                        type="button"
                        className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-semibold
                                   text-white shadow-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-900">{editingId ? 'Edit Person' : 'Add Person'}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Close"
                type="button"
              >
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Name" value={form.name} onChange={(v) => handleChange('name', v)} />
              <Field label="ID Number" value={form.idNumber} onChange={(v) => handleChange('idNumber', v)} />
              <Field label="License Number" value={form.licenseNumber} onChange={(v) => handleChange('licenseNumber', v)} />
              <Field label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(v) => handleChange('dateOfBirth', v)} />
              <Field label="Mobile" value={form.mobile} onChange={(v) => handleChange('mobile', v)} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => handleChange('email', v)} />
              <Field label="Location" value={form.location} onChange={(v) => handleChange('location', v)} />

              <div>
                <Label>Province</Label>
                <select
                  value={form.province}
                  onChange={(e) => {
                    handleChange('province', e.target.value);
                    handleChange('district', '');
                  }}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select Province</option>
                  {Object.keys(provinceDistricts).map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>District</Label>
                <select
                  value={form.district}
                  disabled={!form.province}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">Select District</option>
                  {provinceDistricts[form.province]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* helpers */
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-gray-600">{children}</label>;
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
