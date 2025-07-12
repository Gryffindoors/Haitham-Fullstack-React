// utils/buildStaffFormData.js
export const buildStaffFormData = (payloadObj) => {
  const formData = new FormData();

  Object.entries(payloadObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
};
