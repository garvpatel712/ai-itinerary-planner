'use client';

import { useState, useEffect, useRef } from 'react';

// Icons
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.467-.22-2.121-.659-1.172-.879-1.172-2.303 0-3.182C10.464 7.68 11.232 7.5 12 7.5c.768 0 1.536.22 2.121.659l.879-.659" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

// Sample destination data for autocomplete
const SAMPLE_DESTINATIONS = [
  { id: 1, name: 'Paris, France', country: 'France', type: 'City' },
  { id: 2, name: 'Tokyo, Japan', country: 'Japan', type: 'City' },
  { id: 3, name: 'New York, USA', country: 'United States', type: 'City' },
  { id: 4, name: 'London, UK', country: 'United Kingdom', type: 'City' },
  { id: 5, name: 'Barcelona, Spain', country: 'Spain', type: 'City' },
  { id: 6, name: 'Rome, Italy', country: 'Italy', type: 'City' },
  { id: 7, name: 'Amsterdam, Netherlands', country: 'Netherlands', type: 'City' },
  { id: 8, name: 'Sydney, Australia', country: 'Australia', type: 'City' },
  { id: 9, name: 'Bali, Indonesia', country: 'Indonesia', type: 'Island' },
  { id: 10, name: 'Santorini, Greece', country: 'Greece', type: 'Island' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

const TRAVELER_OPTIONS = [
  { value: 1, label: 'Just me' },
  { value: 2, label: '2 travelers' },
  { value: 3, label: '3 travelers' },
  { value: 4, label: '4 travelers' },
  { value: 5, label: '5+ travelers' },
];

const THEMES = [
  { id: 'chill', label: 'Chill', emoji: '🏖️', description: 'Relaxing and laid-back' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', description: 'Exciting and active' },
  { id: 'culture', label: 'Culture', emoji: '🏛️', description: 'Museums and history' },
  { id: 'backpacker', label: 'Backpacker', emoji: '🎒', description: 'Budget-friendly' },
];

interface FormData {
  destination: string;
  origin: string;
  dateType: 'dates' | 'duration';
  startDate: string;
  endDate: string;
  duration: string;
  budget: string;
  currency: string;
  travelers: number;
  theme: string;
}

interface FormErrors {
  destination?: string;
  origin?: string;
  dates?: string;
  duration?: string;
  budget?: string;
  theme?: string;
}

export default function TripForm() {
  const [formData, setFormData] = useState<FormData>({
    destination: '',
    origin: '',
    dateType: 'dates',
    startDate: '',
    endDate: '',
    duration: '',
    budget: '',
    currency: 'USD',
    travelers: 2,
    theme: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState(SAMPLE_DESTINATIONS);
  const [filteredOrigins, setFilteredOrigins] = useState(SAMPLE_DESTINATIONS);

  const destinationRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const travelersRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Auto-detect user location (mock)
  useEffect(() => {
    // Integration point: Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock: Set a default origin based on location
          setFormData(prev => ({ ...prev, origin: 'New York, USA' }));
        },
        (error) => {
          // Fallback to default
          setFormData(prev => ({ ...prev, origin: 'New York, USA' }));
        }
      );
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationDropdown(false);
      }
      if (originRef.current && !originRef.current.contains(event.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) {
        setShowTravelersDropdown(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDestinationSearch = (value: string) => {
    setFormData(prev => ({ ...prev, destination: value }));
    setFilteredDestinations(
      SAMPLE_DESTINATIONS.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowDestinationDropdown(value.length > 0);
  };

  const handleOriginSearch = (value: string) => {
    setFormData(prev => ({ ...prev, origin: value }));
    setFilteredOrigins(
      SAMPLE_DESTINATIONS.filter(dest =>
        dest.name.toLowerCase().includes(value.toLowerCase())
      )
    );
    setShowOriginDropdown(value.length > 0);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (formData.dateType === 'dates') {
      if (!formData.startDate || !formData.endDate) {
        newErrors.dates = 'Both start and end dates are required';
      } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.dates = 'End date must be after start date';
      }
    } else {
      if (!formData.duration || parseInt(formData.duration) < 1) {
        newErrors.duration = 'Duration must be at least 1 day';
      }
    }

    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    if (!formData.theme) {
      newErrors.theme = 'Please select a travel theme';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Integration point: API call to planning service
      const response = await fetch('/api/mock/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const result = await response.json();
      console.log('Generated itinerary:', result);
      
      // Integration point: Redirect to generated itinerary
      // router.push(`/trip/${result.id}`);
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      // Integration point: Show error notification
    } finally {
      // Simulate API delay for demo
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Field */}
        <div ref={destinationRef} className="relative">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
            Where to? <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="destination"
              value={formData.destination}
              onChange={(e) => handleDestinationSearch(e.target.value)}
              onFocus={() => setShowDestinationDropdown(formData.destination.length > 0)}
              placeholder="e.g., Paris, Tokyo, New York"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.destination ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.destination ? 'destination-error' : undefined}
            />
          </div>
          
          {/* Destination Dropdown */}
          {showDestinationDropdown && filteredDestinations.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredDestinations.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, destination: destination.name }));
                    setShowDestinationDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0"
                >
                  <div className="font-medium">{destination.name}</div>
                  <div className="text-sm text-gray-500">{destination.type} • {destination.country}</div>
                </button>
              ))}
            </div>
          )}
          
          {errors.destination && (
            <p id="destination-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.destination}
            </p>
          )}
        </div>

        {/* Origin Field */}
        <div ref={originRef} className="relative">
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
            From <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              id="origin"
              value={formData.origin}
              onChange={(e) => handleOriginSearch(e.target.value)}
              onFocus={() => setShowOriginDropdown(formData.origin.length > 0)}
              placeholder="Your current location"
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.origin ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.origin ? 'origin-error' : undefined}
            />
          </div>
          
          {/* Origin Dropdown */}
          {showOriginDropdown && filteredOrigins.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredOrigins.map((origin) => (
                <button
                  key={origin.id}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, origin: origin.name }));
                    setShowOriginDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0"
                >
                  <div className="font-medium">{origin.name}</div>
                  <div className="text-sm text-gray-500">{origin.type} • {origin.country}</div>
                </button>
              ))}
            </div>
          )}
          
          {errors.origin && (
            <p id="origin-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.origin}
            </p>
          )}
        </div>

        {/* Date Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">When?</label>
          <div className="flex bg-gray-100 rounded-lg p-1 mb-3">
            <button
              type="button"
              onClick={() => handleInputChange('dateType', 'dates')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                formData.dateType === 'dates'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Specific Dates
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('dateType', 'duration')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                formData.dateType === 'duration'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Duration
            </button>
          </div>

          {formData.dateType === 'dates' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">Start</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.dates ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">End</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="endDate"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.dates ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Number of days"
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.duration ? 'border-red-300' : 'border-gray-300'
                }`}
                aria-describedby={errors.duration ? 'duration-error' : undefined}
              />
            </div>
          )}
          
          {errors.dates && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.dates}
            </p>
          )}
          {errors.duration && (
            <p id="duration-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.duration}
            </p>
          )}
        </div>

        {/* Budget Field */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <div ref={currencyRef} className="relative">
              <button
                type="button"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {CURRENCIES.find(c => c.code === formData.currency)?.symbol}
                <ChevronDownIcon className="ml-1 h-3 w-3" />
              </button>
              
              {showCurrencyDropdown && (
                <div className="absolute z-10 left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {CURRENCIES.map((currency) => (
                    <button
                      key={currency.code}
                      type="button"
                      onClick={() => {
                        handleInputChange('currency', currency.code);
                        setShowCurrencyDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0 text-sm"
                    >
                      {currency.symbol} {currency.code}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex-1">
              <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                id="budget"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="2000"
                min="0"
                step="50"
                className={`w-full pl-10 pr-4 py-2.5 border border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.budget ? 'border-red-300' : 'border-gray-300'
                }`}
                aria-describedby={errors.budget ? 'budget-error' : undefined}
              />
            </div>
          </div>
          
          {errors.budget && (
            <p id="budget-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.budget}
            </p>
          )}
        </div>

        {/* Travelers Dropdown */}
        <div ref={travelersRef} className="relative">
          <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">
            Travelers
          </label>
          <button
            type="button"
            onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-left"
            aria-expanded={showTravelersDropdown}
            aria-haspopup="listbox"
          >
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span>
                {TRAVELER_OPTIONS.find(t => t.value === formData.travelers)?.label}
              </span>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>
          
          {showTravelersDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {TRAVELER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleInputChange('travelers', option.value);
                    setShowTravelersDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b last:border-b-0 ${
                    formData.travelers === option.value ? 'bg-primary/5 text-primary' : ''
                  }`}
                  role="option"
                  aria-selected={formData.travelers === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Travel Style <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleInputChange('theme', theme.id)}
                className={`p-3 border rounded-lg text-left transition-all hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  formData.theme === theme.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                aria-pressed={formData.theme === theme.id}
              >
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">{theme.emoji}</span>
                  <span className="font-medium text-sm">{theme.label}</span>
                </div>
                <p className="text-xs text-gray-500">{theme.description}</p>
              </button>
            ))}
          </div>
          
          {errors.theme && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.theme}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/90 text-white'
          }`}
          aria-describedby={isSubmitting ? 'loading-message' : undefined}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
              <span id="loading-message">Generating Itinerary...</span>
            </>
          ) : (
            <>
              <span>Generate Itinerary</span>
              <PlayIcon className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Loading Skeleton */}
        {isSubmitting && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50" aria-live="polite">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
