// staff/buildStaffPayload.js
export const buildStaffPayload = (newData, originalData = null) => {
  const fields = [
    "first_name", "last_name",
    "first_name_ar", "last_name_ar",
    "username", "password",
    "address", "note",
    "employment_date", "termination_date",
    "department_id", "timetable_id",
    "role_id", "is_manager"
  ];

  const payload = {};

  for (const field of fields) {
    const newValue = newData[field];
    const originalValue = originalData?.[field];

    const hasChanged =
      originalData == null || // create mode
      JSON.stringify(newValue) !== JSON.stringify(originalValue);

    if (hasChanged && newValue !== undefined && newValue !== "") {
      payload[field] = typeof newValue === "string" ? newValue.trim() : newValue;
    }
  }

  if (!originalData || JSON.stringify(newData.phones) !== JSON.stringify(originalData.phones)) {
    payload.phones = newData.phones.map((p) => p.trim()).filter(Boolean);
  }

  if (newData.image && newData.image instanceof File) {
    payload.image = newData.image;
  }

  return payload;
};

