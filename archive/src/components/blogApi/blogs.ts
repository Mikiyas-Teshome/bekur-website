import axios from "axios";

const getBlogsData = async () => {
  try {
    const url = '/api/blogs'; // full URL for client-side fetch
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("Fetching blog posts failed:", err);
    throw err; // Re-throw the error so React Query can handle it
  }
};

export default getBlogsData;
