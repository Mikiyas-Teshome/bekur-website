import axios from "axios";

const getProjectsData = async () => {
  try {
    const url = '/api/projects'; // full URL for client-side fetch
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Fetching projects failed:", err);
    throw err; // Re-throw the error so React Query can handle it
  }
};

export default getProjectsData;
