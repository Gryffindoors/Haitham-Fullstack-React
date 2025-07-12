// src/components/staff/StaffModal.jsx
import { useEffect, useState } from "react";
import FormattedInput from "../utils/FormattedInput";
import {
    createStaff,
    updateStaff,
    getStaffRoles,
    getDepartments,
} from "../api/staff/staff";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import { buildStaffPayload } from "./buildStaffPayload";


const emptyStaff = {
    first_name: "",
    last_name: "",
    first_name_ar: "",
    last_name_ar: "",
    username: "",
    user_role: "",
    phones: [""],
    department_id: "",
    image: null,
};

const StaffModal = ({ initialData = null, onClose, onSaved }) => {
    const isEdit = !!initialData;
    const [data, setData] = useState(emptyStaff);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const { lang } = useLanguage();

    useEffect(() => {
        getStaffRoles().then(setRoles).catch(() => toast.error("⚠️ Failed to load roles"));
        getDepartments().then(setDepartments).catch(() => toast.error("⚠️ Failed to load departments"));
    }, []);

    useEffect(() => {
        if (initialData) {
            const safe = (val) =>
                typeof val === "string" ? val : (val?.toString?.() || "");

            setData({
                ...emptyStaff,
                department_id: initialData.department?.id || "",
                username: safe(initialData.username),
                user_role: safe(initialData.user_role),
                first_name: safe(initialData.first_name),
                last_name: safe(initialData.last_name),
                first_name_ar: safe(initialData.first_name_ar),
                last_name_ar: safe(initialData.last_name_ar),
                phones: Array.isArray(initialData.phones) ? initialData.phones : [""],
            });

            if (initialData.image_url) setPreview(initialData.image_url);
        } else {
            setData(emptyStaff);
            setPreview(null);
        }
    }, [initialData]);

    const handleInputChange = (e) => { // Now accepts event object
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };

    const handlePhoneChange = (e, index) => {
        const { value } = e.target;
        const newPhones = [...data.phones];
        newPhones[index] = value;
        setData({ ...data, phones: newPhones });
    };

    const addPhoneField = () => {
        setData({ ...data, phones: [...data.phones, ""] });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData({ ...data, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!data.first_name) newErrors.first_name = "Required";
        if (!data.last_name) newErrors.last_name = "Required";
        if (!data.first_name_ar) newErrors.first_name_ar = "مطلوب";
        if (!data.last_name_ar) newErrors.last_name_ar = "مطلوب";
        if (!data.username) newErrors.username = "Required";
        if (!data.user_role) newErrors.user_role = "Required";
        if (!data.phones[0]) newErrors.phones = "At least one phone is required";
        if (!data.department_id) newErrors.department_id = "Required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fix the errors");
            return;
        }

        const payload = buildStaffPayload(data, isEdit ? initialData : null);
        try {
            if (isEdit) {
                await updateStaff(initialData.id, payload);
                toast.success("Updated successfully");
            } else {
                await createStaff(payload);
                toast.success("Staff created");
            }
            onSaved();
            onClose();
        } catch (err) {
            toast.error("❌ Submission failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-4 sm:p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-lg font-semibold mb-4 text-center">
                    {isEdit ? "Edit Staff" : "Add New Staff"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[90vh] overflow-y-auto pr-1">
                    <div>
                        <label className="block mb-1 text-sm font-medium">First Name</label>
                        <FormattedInput
                            name="first_name"
                            value={data.first_name}
                            onChange={handleInputChange}
                            capitalizeText
                            placeholder="First Name"
                            error={errors.first_name}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">Last Name</label>
                        <FormattedInput
                            name="last_name"
                            value={data.last_name}
                            onChange={handleInputChange}
                            capitalizeText
                            placeholder="Last Name"
                            error={errors.last_name}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">الاسم الأول</label>
                        <FormattedInput
                            name="first_name_ar"
                            value={data.first_name_ar}
                            onChange={handleInputChange}
                            placeholder="الاسم الأول"
                            error={errors.first_name_ar}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium">اسم العائلة</label>
                        <FormattedInput
                            name="last_name_ar"
                            value={data.last_name_ar}
                            onChange={handleInputChange}
                            placeholder="اسم العائلة"
                            error={errors.last_name_ar}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Username</label>
                        <FormattedInput
                            name="username"
                            value={data.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                            error={errors.username}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Role</label>
                        <select
                            name="user_role"
                            value={data.user_role}
                            onChange={handleInputChange}
                            className="border rounded-md px-4 py-2 w-full"
                        >
                            <option value="">Select Role</option>
                            {roles.map((roleObj) => (
                                <option key={roleObj.id} value={roleObj.role}>
                                    {roleObj.role}
                                </option>
                            ))}
                        </select>
                        {errors.user_role && (
                            <p className="text-sm text-red-600 mt-1">{errors.user_role}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium">Department</label>
                        <select
                            name="department_id"
                            value={data.department_id}
                            onChange={handleInputChange}
                            className="border rounded-md px-4 py-2 w-full"
                        >
                            <option value="">{lang === "ar" ? "اختر القسم" : "Select Department"}</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {lang === "ar" ? d.name_ar : d.name}
                                </option>
                            ))}
                        </select>
                        {errors.department_id && (
                            <p className="text-sm text-red-600 mt-1">{errors.department_id}</p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium">Phones</label>
                        <div className="space-y-2">
                            {data.phones.map((phone, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <FormattedInput
                                        name={`phones[${i}]`}
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(e, i)}
                                        placeholder="Phone number"
                                        error={i === 0 ? errors.phones : null}
                                        className="flex-1"
                                    />
                                    {data.phones.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = data.phones.filter((_, idx) => idx !== i);
                                                setData({ ...data, phones: updated });
                                            }}
                                            className="text-red-500 hover:text-red-700 px-2 text-sm"
                                            title="Delete"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPhoneField}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                + Add another phone
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <FormattedInput
                            name="password"
                            value={data.password || ""}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current password"
                            type="password"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="inline-flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                name="is_manager"
                                checked={!!data.is_manager}
                                onChange={(e) =>
                                    handleInputChange({
                                        target: { name: "is_manager", value: e.target.checked },
                                    })
                                }
                                className="scale-110 accent-blue-600"
                            />
                            <span className="text-sm font-medium">Is Manager</span>
                        </label>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium">Profile Image</label>
                        <div className="flex items-center gap-4 flex-wrap">
                            <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer">
                                Select Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-4 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                        {isEdit ? "Save Changes" : "Add Staff"}
                    </button>
                </div>
            </div>
        </div>
    );

};

export default StaffModal;
