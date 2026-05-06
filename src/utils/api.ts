import axios from 'axios';

const API_URL = 'https://your-api-url.com/api/projects';

export const getProjects = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

// Upload expects FormData (thumbnail file + fields). Backend must accept multipart/form-data.
export const uploadProject = async (projectData: FormData) => {
  try {
    const response = await axios.post(API_URL, projectData, {
      headers: {
        // Let browser set the proper boundary; axios will set the correct content-type for FormData in the browser,
        // but including this header is explicit and compatible with most backends.
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading project:', error);
    throw error;
  }
};

export const getProjectById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    throw error;
  }
};