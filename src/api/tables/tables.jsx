import api from "../api"; 

export const getTableMap = async () => {
  const res = await api.get("/tables/map");
  return res.data;
};

export const assignTable = async (data) => {
  const res = await api.post("/tables/assign", data);
  return res.data;
};
