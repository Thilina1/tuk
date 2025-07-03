"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface TukTukData {
  id?: string;
  ownerName: string;
  vehicleNumber: string;
  vehicleUsers: string;
  mobile: string;
  district: string;
  province: string;
  manufacturedYear: string;
  warrantyExpiry: string;
  licenseExpiry: string;
  active?: boolean;
}

export default function TuktukPage() {
  const [tuktuks, setTuktuks] = useState<TukTukData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  const [formData, setFormData] = useState<TukTukData>({
    ownerName: "",
    vehicleNumber: "",
    vehicleUsers: "",
    mobile: "",
    district: "",
    province: "",
    manufacturedYear: "",
    warrantyExpiry: "",
    licenseExpiry: "",
    active: true,
  });

  const fetchTuktuks = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "tuktuks"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TukTukData[];
    setTuktuks(data);
    setLoading(false);
  };
  

  useEffect(() => {
    fetchTuktuks();
  }, []);

  const handleAddTuktuk = async () => {
    await addDoc(collection(db, "tuktuks"), formData);
    setFormData({
      ownerName: "",
      vehicleNumber: "",
      vehicleUsers: "",
      mobile: "",
      district: "",
      province: "",
      manufacturedYear: "",
      warrantyExpiry: "",
      licenseExpiry: "",
      active: true,
    });
    setShowModal(false);
    fetchTuktuks();
  };


  const [searchOwner, setSearchOwner] = useState("");
  const [searchVehicleNo, setSearchVehicleNo] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchProvince, setSearchProvince] = useState("");

  const filteredTuktuks = tuktuks.filter((tuk) => {
    return (
      tuk.ownerName.toLowerCase().includes(searchOwner.toLowerCase()) &&
      tuk.vehicleNumber.toLowerCase().includes(searchVehicleNo.toLowerCase()) &&
      tuk.district.toLowerCase().includes(searchDistrict.toLowerCase()) &&
      tuk.province.toLowerCase().includes(searchProvince.toLowerCase())
    );
  });
  

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Tuk Tuk?")) {
      await deleteDoc(doc(db, "tuktuks", id));
      fetchTuktuks();
    }
  };

  const toggleActive = async (tuk: TukTukData) => {
    if (!tuk.id) return;
    await updateDoc(doc(db, "tuktuks", tuk.id), {
      ...tuk,
      active: !tuk.active,
    });
    fetchTuktuks();
  };

  const provinceDistrictMap: { [province: string]: string[] } = {
    "Western": ["Colombo", "Gampaha", "Kalutara"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Southern": ["Galle", "Matara", "Hambantota"],
    "Uva": ["Badulla", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"],
    "North Western": ["Kurunegala", "Puttalam"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    "Eastern": ["Batticaloa", "Ampara", "Trincomalee"],
  };

  const [districtOptions, setDistrictOptions] = useState<string[]>([]);


  return (
    <div>
{/* 🔷 Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <h2 className="text-2xl font-semibold text-gray-800">Tuk Tuk Management</h2>
  <button
    onClick={() => setShowModal(true)}
    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow"
  >
    ➕ Add Tuk Tuk
  </button>
</div>

{/* 🔷 Search Section */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  {[{ label: 'Owner', value: searchOwner, setter: setSearchOwner },
    { label: 'Vehicle No', value: searchVehicleNo, setter: setSearchVehicleNo },
    { label: 'District', value: searchDistrict, setter: setSearchDistrict },
    { label: 'Province', value: searchProvince, setter: setSearchProvince }]
    .map(({ label, value, setter }) => (
    <div key={label} className="flex flex-col">
      <label className="text-xs text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        placeholder={`Search ${label}`}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-100"
      />
    </div>
  ))}
</div>


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
  </div>
) :(

<table className="min-w-full bg-white shadow rounded-lg overflow-hidden text-sm">
  <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
    <tr>
      <th className="px-3 py-2 text-left">#</th>
      <th className="px-3 py-2 text-left">Owner</th>
      <th className="px-3 py-2 text-left">Vehicle No</th>
      <th className="px-3 py-2 text-left">Users</th>
      <th className="px-3 py-2 text-left">District</th>
      <th className="px-3 py-2 text-left">Province</th>
      <th className="px-3 py-2 text-left">Mobile</th>
      <th className="px-3 py-2 text-left">Year</th>
      <th className="px-3 py-2 text-left">Warranty Exp</th>
      <th className="px-3 py-2 text-left">License Exp</th>
      <th className="px-3 py-2 text-left">Status</th>
      <th className="px-3 py-2 text-left">Action</th>
    </tr>
  </thead>
  <tbody>
    {filteredTuktuks.map((tuk, index) => (
      <tr
        key={tuk.id}
        className="hover:bg-gray-50 even:bg-gray-50 text-gray-800"
      >
        <td className="px-3 py-2">{index + 1}</td>
        <td className="px-3 py-2">{tuk.ownerName}</td>
        <td className="px-3 py-2">{tuk.vehicleNumber}</td>
        <td className="px-3 py-2">{tuk.vehicleUsers}</td>
        <td className="px-3 py-2">{tuk.district}</td>
        <td className="px-3 py-2">{tuk.province}</td>
        <td className="px-3 py-2">{tuk.mobile}</td>
        <td className="px-3 py-2">{tuk.manufacturedYear}</td>
        <td className="px-3 py-2">{tuk.warrantyExpiry}</td>
        <td className="px-3 py-2">{tuk.licenseExpiry}</td>
        <td className="px-3 py-2">
          <button
            onClick={() => toggleActive(tuk)}
            className={`text-xs px-3 py-1 rounded-full shadow ${
              tuk.active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {tuk.active ? 'Active' : 'Inactive'}
          </button>
        </td>
        <td className="px-3 py-2">
          <button
            onClick={() => handleDelete(tuk.id!)}
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
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
      <h3 className="text-xl font-bold mb-4">Add New Tuk Tuk</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Province and District Data */}
        {([
  { label: "Owner Name", field: "ownerName" },
  { label: "Vehicle Number", field: "vehicleNumber" },
  { label: "Vehicle Users", field: "vehicleUsers" },
  { label: "Mobile Number", field: "mobile" },
  { label: "Manufactured Year", field: "manufacturedYear" },
] as const).map(({ label, field }) => (
  <div key={field}>
    <label className="text-sm font-medium">{label}</label>
    <input
      type="text"
      value={String(formData[field])}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }))
      }
      className="w-full border border-gray-300 rounded px-3 py-2"
      required
    />
  </div>
))
}


{/* Insurance (Warranty Expiry) */}
<div>
  <label className="text-sm font-medium">Insurance</label>
  <input
    type="date"
    value={formData.warrantyExpiry}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, warrantyExpiry: e.target.value }))
    }
    className="w-full border border-gray-300 rounded px-3 py-2"
    required
  />
</div>

{/* License Expiry */}
<div>
  <label className="text-sm font-medium">License Expiry</label>
  <input
    type="date"
    value={formData.licenseExpiry}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, licenseExpiry: e.target.value }))
    }
    className="w-full border border-gray-300 rounded px-3 py-2"
    required
  />
</div>



        {/* Province Dropdown */}
        <div>
          <label className="text-sm font-medium">Province</label>
          <select
            value={formData.province}
            onChange={(e) => {
              const selectedProvince = e.target.value;
              setFormData((prev) => ({
                ...prev,
                province: selectedProvince,
                district: "", // Reset district when province changes
              }));
              setDistrictOptions(provinceDistrictMap[selectedProvince] || []);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Province</option>
            {Object.keys(provinceDistrictMap).map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* District Dropdown */}
        <div>
          <label className="text-sm font-medium">District</label>
          <select
            value={formData.district}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, district: e.target.value }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            disabled={!formData.province}
            
          >
            <option value="">Select District</option>
            {districtOptions.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-6 gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleAddTuktuk}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
