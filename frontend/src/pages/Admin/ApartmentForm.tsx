import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FaWifi, FaUtensils, FaTv, FaSnowflake, FaDesktop, 
  FaParking, FaWater, FaEye, FaDumbbell, FaUpload, 
  FaTrash, FaSuitcase, FaWind
} from 'react-icons/fa';

import { useAuth } from '../../utils/AuthContext';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';
import { mockGetApartmentById } from '../../utils/mockApi';
import { shouldUseMockData } from '../../utils/mockData';
import { api } from '../../utils/api';
import { Apartment } from '../../utils/types';

// Available amenities with their icons and labels
const availableAmenities = [
  { id: 'wifi', label: 'WiFi', icon: <FaWifi /> },
  { id: 'kitchen', label: 'Kitchen', icon: <FaUtensils /> },
  { id: 'tv', label: 'TV', icon: <FaTv /> },
  { id: 'ac', label: 'Air Conditioning', icon: <FaSnowflake /> },
  { id: 'workspace', label: 'Workspace', icon: <FaDesktop /> },
  { id: 'parking', label: 'Parking', icon: <FaParking /> },
  { id: 'washer', label: 'Washer', icon: <FaWater /> },
  { id: 'view', label: 'View', icon: <FaEye /> },
  { id: 'gym', label: 'Gym', icon: <FaDumbbell /> },
  { id: 'balcony', label: 'Balcony', icon: <FaWind /> },
  { id: 'luggage', label: 'Luggage Storage', icon: <FaSuitcase /> },
];

// Empty apartment template for new apartments
const emptyApartment: Apartment = {
  id: 0,
  name: '',
  description: '',
  price: 0,
  size: 0,
  maxGuests: 1,
  bedrooms: 0,
  bathrooms: 1,
  available: true,
  amenities: [],
  images: [],
  rating: 0,
  reviewCount: 0,
  mainImage: '',
};

interface ApartmentFormProps {}

const ApartmentForm: React.FC<ApartmentFormProps> = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // State
  const [apartment, setApartment] = useState<Apartment>(emptyApartment);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  
  // Fetch apartment data if in edit mode
  useEffect(() => {
    if (!isEditMode) {
      return;
    }
    
    const fetchApartment = async () => {
      try {
        let apartmentData;
        
        if (shouldUseMockData()) {
          // Mock API call
          const mockResponse = await mockGetApartmentById(parseInt(id!, 10));
          if (!mockResponse.success) {
            throw new Error(mockResponse.message);
          }
          apartmentData = mockResponse.apartment;
        } else {
          // Real API call
          const response = await api.get(`/apartments/${id}`);
          apartmentData = response.data;
        }
        
        setApartment(apartmentData);
        setPreviewImages(apartmentData.images || []);
      } catch (err: any) {
        console.error('Error fetching apartment:', err);
        setAlert({
          type: 'error',
          message: t('admin.apartmentForm.errors.fetchFailed'),
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApartment();
  }, [id, isEditMode, t]);
  
  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [isAuthenticated, user, navigate]);
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Convert to number for number inputs
    if (type === 'number') {
      setApartment({
        ...apartment,
        [name]: value === '' ? '' : parseFloat(value),
      });
    } else {
      setApartment({
        ...apartment,
        [name]: value,
      });
    }
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setApartment({
      ...apartment,
      [name]: checked,
    });
  };
  
  // Handle amenities toggle
  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = [...apartment.amenities];
    
    if (currentAmenities.includes(amenityId)) {
      // Remove amenity
      setApartment({
        ...apartment,
        amenities: currentAmenities.filter(id => id !== amenityId),
      });
    } else {
      // Add amenity
      setApartment({
        ...apartment,
        amenities: [...currentAmenities, amenityId],
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewUrls]);
  };
  
  // Remove preview image
  const handleRemoveImage = (index: number) => {
    // If it's a new file (from imageFiles)
    if (index < imageFiles.length) {
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(index, 1);
      setImageFiles(newImageFiles);
      
      const newPreviewImages = [...previewImages];
      URL.revokeObjectURL(newPreviewImages[index]); // Clean up URL object
      newPreviewImages.splice(index, 1);
      setPreviewImages(newPreviewImages);
    } else {
      // If it's an existing image from the apartment
      const newPreviewImages = [...previewImages];
      newPreviewImages.splice(index, 1);
      setPreviewImages(newPreviewImages);
      
      // Also update apartment images
      const newApartmentImages = [...apartment.images];
      newApartmentImages.splice(index - imageFiles.length, 1);
      setApartment({
        ...apartment,
        images: newApartmentImages,
      });
    }
  };
  
  // Set main image
  const handleSetMainImage = (index: number) => {
    let mainImageUrl;
    
    if (index < imageFiles.length) {
      // It's a new image
      mainImageUrl = previewImages[index];
    } else {
      // It's an existing image
      mainImageUrl = previewImages[index];
    }
    
    setApartment({
      ...apartment,
      mainImage: mainImageUrl,
    });
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!apartment.name.trim()) {
      newErrors.name = t('admin.apartmentForm.errors.nameRequired');
    }
    
    if (!apartment.description.trim()) {
      newErrors.description = t('admin.apartmentForm.errors.descriptionRequired');
    }
    
    if (!apartment.price || apartment.price <= 0) {
      newErrors.price = t('admin.apartmentForm.errors.priceRequired');
    }
    
    if (!apartment.size || apartment.size <= 0) {
      newErrors.size = t('admin.apartmentForm.errors.sizeRequired');
    }
    
    if (!apartment.maxGuests || apartment.maxGuests <= 0) {
      newErrors.maxGuests = t('admin.apartmentForm.errors.maxGuestsRequired');
    }
    
    if (apartment.bedrooms < 0) {
      newErrors.bedrooms = t('admin.apartmentForm.errors.invalidBedrooms');
    }
    
    if (!apartment.bathrooms || apartment.bathrooms <= 0) {
      newErrors.bathrooms = t('admin.apartmentForm.errors.bathroomsRequired');
    }
    
    // Check if there are any images
    if (previewImages.length === 0) {
      newErrors.images = t('admin.apartmentForm.errors.imagesRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: t('admin.apartmentForm.errors.formInvalid'),
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real application, we would upload the images first and get URLs back
      // For this demo, we'll just simulate it
      
      // Prepare the apartment data
      const apartmentData = {
        ...apartment,
        // In a real app, we would update the images array with the new URLs
        // from the uploaded files, but for now we'll just use the preview URLs
        images: previewImages,
        // If no main image is set, use the first image
        mainImage: apartment.mainImage || previewImages[0],
      };
      
      // Create or update apartment
      if (isEditMode) {
        if (shouldUseMockData()) {
          // Mock update
          console.log('Updating apartment:', apartmentData);
          // Wait for a bit to simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // Real API call
          await api.put(`/apartments/${id}`, apartmentData);
        }
        
        setAlert({
          type: 'success',
          message: t('admin.apartmentForm.updateSuccess'),
        });
      } else {
        if (shouldUseMockData()) {
          // Mock create
          console.log('Creating apartment:', apartmentData);
          // Wait for a bit to simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // Real API call
          await api.post('/apartments', apartmentData);
        }
        
        setAlert({
          type: 'success',
          message: t('admin.apartmentForm.createSuccess'),
        });
      }
      
      // Navigate back to apartments list after a delay
      setTimeout(() => {
        navigate('/admin/apartments');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving apartment:', err);
      setAlert({
        type: 'error',
        message: isEditMode
          ? t('admin.apartmentForm.errors.updateFailed')
          : t('admin.apartmentForm.errors.createFailed'),
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode 
            ? t('admin.apartmentForm.editTitle') 
            : t('admin.apartmentForm.createTitle')}
        </h1>
        <p className="text-gray-500">
          {isEditMode 
            ? t('admin.apartmentForm.editSubtitle') 
            : t('admin.apartmentForm.createSubtitle')}
        </p>
      </div>
      
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
          className="mb-6"
          dismissible
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.apartmentForm.basicInfo')}</h2>
                
                <div className="space-y-4">
                  <Input
                    label={t('admin.apartmentForm.name')}
                    name="name"
                    value={apartment.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.apartmentForm.description')}
                    </label>
                    <textarea
                      name="description"
                      rows={5}
                      className={`
                        w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50
                        ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
                      `}
                      value={apartment.description}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t('admin.apartmentForm.price')}
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={apartment.price}
                      onChange={handleInputChange}
                      error={errors.price}
                      required
                    />
                    
                    <Input
                      label={t('admin.apartmentForm.size')}
                      name="size"
                      type="number"
                      min="0"
                      value={apartment.size}
                      onChange={handleInputChange}
                      error={errors.size}
                      helperText={t('admin.apartmentForm.sizeHelp')}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label={t('admin.apartmentForm.maxGuests')}
                      name="maxGuests"
                      type="number"
                      min="1"
                      value={apartment.maxGuests}
                      onChange={handleInputChange}
                      error={errors.maxGuests}
                      required
                    />
                    
                    <Input
                      label={t('admin.apartmentForm.bedrooms')}
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={apartment.bedrooms}
                      onChange={handleInputChange}
                      error={errors.bedrooms}
                      helperText={t('admin.apartmentForm.bedroomsHelp')}
                    />
                    
                    <Input
                      label={t('admin.apartmentForm.bathrooms')}
                      name="bathrooms"
                      type="number"
                      min="1"
                      step="0.5"
                      value={apartment.bathrooms}
                      onChange={handleInputChange}
                      error={errors.bathrooms}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={apartment.available}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                      {t('admin.apartmentForm.available')}
                    </label>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Amenities */}
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.apartmentForm.amenities')}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableAmenities.map((amenity) => (
                    <div 
                      key={amenity.id}
                      className={`
                        flex items-center p-3 border rounded-md cursor-pointer
                        ${apartment.amenities.includes(amenity.id) 
                          ? 'border-primary bg-primary-light text-primary' 
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                      onClick={() => handleAmenityToggle(amenity.id)}
                    >
                      <div className="mr-3">{amenity.icon}</div>
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            
            {/* Images */}
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.apartmentForm.images')}</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.apartmentForm.uploadImages')}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                        >
                          <span>{t('admin.apartmentForm.uploadButton')}</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">{t('admin.apartmentForm.dragDrop')}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {t('admin.apartmentForm.imageTypes')}
                      </p>
                    </div>
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                  )}
                </div>
                
                {/* Image previews */}
                {previewImages.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium mb-2">{t('admin.apartmentForm.preview')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previewImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className={`h-24 w-full object-cover rounded-md ${
                              apartment.mainImage === image ? 'ring-2 ring-primary' : ''
                            }`}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              className="p-1 bg-white rounded-full text-red-500 hover:text-red-700 mr-2"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <FaTrash size={14} />
                              <span className="sr-only">{t('admin.apartmentForm.remove')}</span>
                            </button>
                            <button
                              type="button"
                              className="p-1 bg-white rounded-full text-primary hover:text-primary-dark"
                              onClick={() => handleSetMainImage(index)}
                              disabled={apartment.mainImage === image}
                            >
                              <FaEye size={14} />
                              <span className="sr-only">{t('admin.apartmentForm.setMain')}</span>
                            </button>
                          </div>
                          {apartment.mainImage === image && (
                            <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs text-center py-1">
                              {t('admin.apartmentForm.mainImage')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.apartmentForm.actions')}</h2>
                
                <div className="space-y-4">
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={submitting}
                    disabled={submitting}
                  >
                    {isEditMode
                      ? t('admin.apartmentForm.updateButton')
                      : t('admin.apartmentForm.createButton')}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => navigate('/admin/apartments')}
                    disabled={submitting}
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            </Card>
            
            {isEditMode && (
              <Card className="overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">{t('admin.apartmentForm.dangerZone')}</h2>
                  
                  <div className="space-y-4">
                    <Button
                      type="button"
                      variant="danger"
                      fullWidth
                      onClick={() => {
                        if (window.confirm(t('admin.apartmentForm.deleteConfirmation'))) {
                          navigate(`/admin/apartments?delete=${id}`);
                        }
                      }}
                      disabled={submitting}
                    >
                      {t('admin.apartmentForm.deleteButton')}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
            
            <Card className="overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t('admin.apartmentForm.tips')}</h2>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p>{t('admin.apartmentForm.tipDescription')}</p>
                  <p>{t('admin.apartmentForm.tipAmenities')}</p>
                  <p>{t('admin.apartmentForm.tipImages')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ApartmentForm;