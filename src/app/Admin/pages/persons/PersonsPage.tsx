'use client';

import { useEffect, useState } from 'react';
import { db } from '@/config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

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
    dateOfBirth:'',
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
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // start loading
      const snapshot = await getDocs(collection(db, 'persons'));
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        number: index + 1,
      })) as unknown as Person[] & { number: number }[];
      setPersons(data);
      setLoading(false); // stop loading
    };
  
    fetchData();
  }, []);
  

  const handleChange = <K extends keyof Person>(key: K, value: Person[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  

  const handleSubmit = async () => {
    try {
      const newPerson = { ...form, isActive: true };
      const docRef = await addDoc(collection(db, 'persons'), newPerson);
      setPersons((prev) => [
        ...prev,
        { ...newPerson, id: docRef.id, number: prev.length + 1 },
      ]);
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
      setShowModal(false);
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  const toggleActiveStatus = async (person: Person) => {
    if (!person.id) return;

    const newStatus = !person.isActive;
    const ref = doc(db, 'persons', person.id);
    await updateDoc(ref, { isActive: newStatus });

    setPersons((prev) =>
      prev.map((p) => (p.id === person.id ? { ...p, isActive: newStatus } : p))
    );
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'persons', id));
      setPersons((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete person:', error);
    }
  };

  return (


    
<div className="p-6">
  {/* 🔷 Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <h2 className="text-2xl font-semibold text-gray-800">Trainers</h2>
    <button
      onClick={() => setShowModal(true)}
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow"
    >
      ➕ Add Person
    </button>
  </div>

  {/* 🔷 Search Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
    {/* Search by Name */}
    <div className="flex flex-col">
      <label className="text-xs text-gray-600 mb-1">Search by Name</label>
      <input
        type="text"
        placeholder="Name"
        value={searchFilters.name}
        onChange={(e) =>
          setSearchFilters((prev) => ({ ...prev, name: e.target.value }))
        }
        className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-100"
      />
    </div>

    {/* Province */}
    <div className="flex flex-col">
      <label className="text-xs text-gray-600 mb-1">Province</label>
      <select
        value={searchFilters.province}
        onChange={(e) =>
          setSearchFilters((prev) => ({
            ...prev,
            province: e.target.value,
            district: '', // reset district if province changes
          }))
        }
        className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Provinces</option>
        {Object.keys(provinceDistricts).map((prov) => (
          <option key={prov} value={prov}>
            {prov}
          </option>
        ))}
      </select>
    </div>

    {/* District */}
    <div className="flex flex-col">
      <label className="text-xs text-gray-600 mb-1">District</label>
      <select
        value={searchFilters.district}
        onChange={(e) =>
          setSearchFilters((prev) => ({ ...prev, district: e.target.value }))
        }
        className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
        disabled={!searchFilters.province}
      >
        <option value="">All Districts</option>
        {provinceDistricts[searchFilters.province]?.map((dist) => (
          <option key={dist} value={dist}>
            {dist}
          </option>
        ))}
      </select>
    </div>
  </div>




      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative">
            <h3 className="text-xl font-bold mb-4">Add Person</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="border p-2" />
              <input type="text" placeholder="ID Number" value={form.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} className="border p-2" />
              <input type="text" placeholder="License Number" value={form.licenseNumber} onChange={(e) => handleChange('licenseNumber', e.target.value)} className="border p-2" />
              <input
                  type="date"
                  placeholder="Date of Birth"
                  value={form.dateOfBirth || ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  className="border p-2"
            />
              <input type="text" placeholder="Mobile Number" value={form.mobile} onChange={(e) => handleChange('mobile', e.target.value)} className="border p-2" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="border p-2" />
              <input type="text" placeholder="Location" value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="border p-2" />

              {/* Province Dropdown */}
              <select value={form.province} onChange={(e) => {
                handleChange('province', e.target.value);
                handleChange('district', ''); // reset district
              }} className="border p-2">
                <option value="">Select Province</option>
                {Object.keys(provinceDistricts).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>

              {/* District Dropdown */}
              <select value={form.district} onChange={(e) => handleChange('district', e.target.value)} className="border p-2" disabled={!form.province}>
                <option value="">Select District</option>
                {provinceDistricts[form.province]?.map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setShowModal(false)} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-4">Person List</h3>


      {loading ? (
  <div className="flex justify-center items-center h-40">
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
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
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    <span className="ml-2 text-gray-600">Loading persons...</span>
  </div>
) : (


      
<table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
    <tr>
      <th className="px-3 py-2 text-left">#</th>
      <th className="px-3 py-2 text-left">Name</th>
      <th className="px-3 py-2 text-left">ID Number</th>
      <th className="px-3 py-2 text-left">License No</th>
      <th className="px-3 py-2 text-left">Date Of Birth</th>
      <th className="px-3 py-2 text-left">Mobile</th>
      <th className="px-3 py-2 text-left">Email</th>
      <th className="px-3 py-2 text-left">Location</th>
      <th className="px-3 py-2 text-left">Province</th>
      <th className="px-3 py-2 text-left">District</th>
      <th className="px-3 py-2 text-left">Status</th>
      <th className="px-3 py-2 text-left">Action</th>
    </tr>
  </thead>
  <tbody>
    {persons
      .filter((person) =>
        person.name.toLowerCase().includes(searchFilters.name.toLowerCase())
      )
      .filter((person) =>
        searchFilters.province ? person.province === searchFilters.province : true
      )
      .filter((person) =>
        searchFilters.district ? person.district === searchFilters.district : true
      )
      .map((person, index) => (
        <tr
          key={person.id}
          className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
        >
          <td className="px-3 py-2">{index + 1}</td>
          <td className="px-3 py-2">{person.name}</td>
          <td className="px-3 py-2">{person.idNumber}</td>
          <td className="px-3 py-2">{person.licenseNumber}</td>
          <td className="px-3 py-2">{person.dateOfBirth}</td>
          <td className="px-3 py-2">{person.mobile}</td>
          <td className="px-3 py-2">{person.email}</td>
          <td className="px-3 py-2">{person.location}</td>
          <td className="px-3 py-2">{person.province}</td>
          <td className="px-3 py-2">{person.district}</td>
          <td className="px-3 py-2">
            <button
              onClick={() => toggleActiveStatus(person)}
              className={`text-xs px-3 py-1 rounded-full shadow ${
                person.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {person.isActive ? 'Active' : 'Inactive'}
            </button>
          </td>
          <td className="px-3 py-2 space-x-1">
            <button
              onClick={() => handleDelete(person.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs shadow"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
  </tbody>
</table>

)}
    </div>
  );
}
