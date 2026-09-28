import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/api/auth/login', credentials),
  checkHello: () => axiosClient.get('/api/hello', { responseType: 'text' })
};

export const aboutApi = {
  getAll: () => axiosClient.get('/api/about'),
  getById: (id) => axiosClient.get(`/api/about/${id}`),
  create: (data) => axiosClient.post('/api/about', data),
  update: (id, data) => axiosClient.put(`/api/about/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/about/${id}`)
};

export const skillsApi = {
  getAll: () => axiosClient.get('/api/skills'),
  getById: (id) => axiosClient.get(`/api/skills/${id}`),
  create: (data) => axiosClient.post('/api/skills', data),
  update: (id, data) => axiosClient.put(`/api/skills/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/skills/${id}`)
};

export const experiencesApi = {
  getAll: () => axiosClient.get('/api/experiences'),
  getById: (id) => axiosClient.get(`/api/experiences/${id}`),
  create: (data) => axiosClient.post('/api/experiences', data),
  update: (id, data) => axiosClient.put(`/api/experiences/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/experiences/${id}`)
};

export const educationApi = {
  getAll: () => axiosClient.get('/api/education'),
  getById: (id) => axiosClient.get(`/api/education/${id}`),
  create: (data) => axiosClient.post('/api/education', data),
  update: (id, data) => axiosClient.put(`/api/education/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/education/${id}`)
};

export const certificatesApi = {
  getAll: () => axiosClient.get('/api/certificates'),
  getById: (id) => axiosClient.get(`/api/certificates/${id}`),
  create: (data) => axiosClient.post('/api/certificates', data),
  update: (id, data) => axiosClient.put(`/api/certificates/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/certificates/${id}`)
};

export const trainingApi = {
  getAll: () => axiosClient.get('/api/training'),
  getById: (id) => axiosClient.get(`/api/training/${id}`),
  create: (data) => axiosClient.post('/api/training', data),
  update: (id, data) => axiosClient.put(`/api/training/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/training/${id}`)
};

export const learningApi = {
  getAll: () => axiosClient.get('/api/learning'),
  getById: (id) => axiosClient.get(`/api/learning/${id}`),
  create: (data) => axiosClient.post('/api/learning', data),
  update: (id, data) => axiosClient.put(`/api/learning/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/learning/${id}`)
};

export const projectsApi = {
  getAll: () => axiosClient.get('/api/projects'),
  getById: (id) => axiosClient.get(`/api/projects/${id}`),
  create: (data) => axiosClient.post('/api/projects', data),
  update: (id, data) => axiosClient.put(`/api/projects/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/projects/${id}`)
};

export const socialLinksApi = {
  getAll: () => axiosClient.get('/api/social-links'),
  getById: (id) => axiosClient.get(`/api/social-links/${id}`),
  create: (data) => axiosClient.post('/api/social-links', data),
  update: (id, data) => axiosClient.put(`/api/social-links/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/social-links/${id}`)
};

export const contactApi = {
  send: (data) => axiosClient.post('/api/contact', data),
  getAll: () => axiosClient.get('/api/contact'),
  getById: (id) => axiosClient.get(`/api/contact/${id}`)
};

export const mediaApi = {
  getAll: () => axiosClient.get('/api/media'),
  getById: (id) => axiosClient.get(`/api/media/${id}`),
  delete: (id) => axiosClient.delete(`/api/media/${id}`)
};

export const uploadApi = {
  uploadImage: (formData, onProgress) => axiosClient.post('/api/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  }),
  uploadPdf: (formData, onProgress) => axiosClient.post('/api/uploads/pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  }),
  uploadResume: (formData, onProgress) => axiosClient.post('/api/uploads/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    }
  })
};
