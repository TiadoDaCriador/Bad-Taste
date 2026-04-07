// Gallery data layer — communicates with backend API

export const getGallery = async () => {
  try {
    const res = await fetch('/api/gallery');
    if (!res.ok) throw new Error(`Failed to fetch gallery: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('getGallery error:', err);
    return [];
  }
};

export const addGalleryPhoto = async (photoData) => {
  // photoData = { path, caption? }
  try {
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(photoData),
    });
    if (!res.ok) throw new Error(`Failed to add photo: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('addGalleryPhoto error:', err);
    throw err;
  }
};

export const setCoverPhoto = async (id) => {
  return updateGalleryPhoto(id, { isCover: true });
};

export const updateGalleryPhoto = async (id, updates) => {
  // updates = { caption?, order?, isCover? }
  try {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`Failed to update photo: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('updateGalleryPhoto error:', err);
    throw err;
  }
};

export const deleteGalleryPhoto = async (id) => {
  try {
    const res = await fetch(`/api/gallery/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete photo: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('deleteGalleryPhoto error:', err);
    throw err;
  }
};

// File uploads
export const uploadPhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload/photo', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('uploadPhoto error:', err);
    throw err;
  }
};

export const uploadVideo = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload/video', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('uploadVideo error:', err);
    throw err;
  }
};
