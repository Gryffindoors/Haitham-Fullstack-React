// src/utils/toFormData.js
export const toFormData = (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((val) => formData.append(`${key}[]`, val));
    } else {
      formData.append(key, data[key]);
    }
  }
  return formData;
};
