import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { radiologyApi } from '../../../services/api/radiologyApi';
import { useTranslation } from 'react-i18next';

const RadiologyContext = createContext({});

export function RadiologyProvider({ children, initialPatientId = null }) {
  const { t } = useTranslation();
  
  // Data State
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Selection State
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || '');
  const [activeImage, setActiveImage] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
    type: 'all',
    tooth: '',
    dateRange: 'all' // e.g. 'all', 'last_30_days', '2026'
  });

  const loadImages = useCallback(async () => {
    if (!selectedPatientId) {
      setImages([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await radiologyApi.getAll(selectedPatientId);
      // Normalize mock data fields to match the new spec if they are missing
      const normalizedData = data.map(img => ({
        ...img,
        type: img.category?.toLowerCase() || 'other',
        title: img.fileName,
        capturedAt: img.uploadedAt,
        linkedTeeth: img.tooth ? [img.tooth] : [],
        notes: img.diagnosis || '',
      }));
      setImages(normalizedData);
    } catch (err) {
      console.error(err);
      setError(t('radiology.loadError') || 'Failed to load radiology images.');
    } finally {
      setLoading(false);
    }
  }, [selectedPatientId, t]);

  useEffect(() => {
    loadImages();
    setActiveImage(null); // Reset viewer if patient changes
  }, [selectedPatientId, loadImages]);

  // Derived filtered state
  const filteredImages = images.filter(img => {
    if (filters.type !== 'all' && img.type.toLowerCase() !== filters.type) return false;
    if (filters.tooth && !img.linkedTeeth.includes(filters.tooth)) return false;
    return true;
  });

  const deleteImage = async (id) => {
    try {
      await radiologyApi.remove(id);
      if (activeImage?.id === id) setActiveImage(null);
      await loadImages();
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete image');
    }
  };

  const uploadImage = async (data) => {
    await radiologyApi.upload(data);
    await loadImages();
  };

  const value = {
    // Data
    images: filteredImages,
    allImages: images,
    loading,
    error,
    
    // View State
    selectedPatientId,
    setSelectedPatientId,
    activeImage,
    setActiveImage,
    
    // Filters
    filters,
    setFilters,
    
    // Actions
    loadImages,
    deleteImage,
    uploadImage
  };

  return (
    <RadiologyContext.Provider value={value}>
      {children}
    </RadiologyContext.Provider>
  );
}

export function useRadiology() {
  const context = useContext(RadiologyContext);
  if (!context) {
    throw new Error('useRadiology must be used within a RadiologyProvider');
  }
  return context;
}
