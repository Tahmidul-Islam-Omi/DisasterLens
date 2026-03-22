import React, { useState } from 'react';
import { 
  Upload, Search, UserCircle, MapPin, Calendar, Clock, 
  Phone, AlertTriangle, CheckCircle, ChevronRight, Map,
  ZoomIn, ZoomOut, Users, Info
} from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useTranslation } from 'react-i18next';

const mockResults = [
  { id: 1, name: 'Ayesha Begum', age: 34, lastSeen: 'Sylhet Sadar, Zone A', date: '2023-10-24 14:30', status: 'Possible Match', score: 94, phone: '+880 1711-000000', img: 'https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?w=500&q=80' },
  { id: 2, name: 'Unknown Sighting', age: 30, lastSeen: 'Netrokona Camp 2', date: '2023-10-25 09:15', status: 'Unverified Sighting', score: 88, phone: 'Camp Admin: +880 1812-111111', img: 'https://images.unsplash.com/photo-1748200100199-fed2be4c31eb?w=500&q=80' },
  { id: 3, name: 'Fatima', age: 36, lastSeen: 'Sunamganj Sector 3', date: '2023-10-23 18:00', status: 'Reported Missing', score: 82, phone: '+880 1913-222222', img: 'https://images.unsplash.com/photo-1647980188230-acfc89a718bb?w=500&q=80' },
  { id: 4, name: 'Unidentified Female', age: 35, lastSeen: 'Habiganj Center', date: '2023-10-25 11:45', status: 'Rescued / Safe', score: 76, phone: 'Hospital Desk: +880 1614-333333', img: 'https://images.unsplash.com/flagged/photo-1579924711789-872f06ecf220?w=500&q=80' },
  { id: 5, name: 'Rina Akhtar', age: 32, lastSeen: 'Moulvibazar Route', date: '2023-10-22 16:20', status: 'Possible Match', score: 71, phone: '+880 1715-444444', img: 'https://images.unsplash.com/photo-1561165804-4ec46664a4cb?w=500&q=80' },
];

export default function MissingPersonsView() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'map' | 'report' | 'search'>('map');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mapZoomLevel, setMapZoomLevel] = useState<'zoomed-out' | 'zoomed-in'>('zoomed-out');

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-[#1E3A8A]" />
              {t('missing_persons_title')}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{t('missing_persons_desc')}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('missing_person_map')}
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'search' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('search_by_image')}
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'report' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t('report_missing_person')}
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">
        {activeTab === 'map' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[700px]">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#1E3A8A]" /> 
                  {t('area_distribution_map')}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{t('click_cluster_zoom')}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setMapZoomLevel('zoomed-out')}
                  className={`p-2 rounded border ${mapZoomLevel === 'zoomed-out' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'} transition-colors`}
                  title="Zoom Out (Cluster View)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setMapZoomLevel('zoomed-in')}
                  className={`p-2 rounded border ${mapZoomLevel === 'zoomed-in' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'} transition-colors`}
                  title="Zoom In (Individual Pins)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 relative bg-blue-50/30 overflow-hidden group">
              {/* Simulated Map Background */}
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-10 pointer-events-none transition-transform duration-700 ease-in-out" style={{ transform: mapZoomLevel === 'zoomed-in' ? 'scale(2.5) translate(-10%, -10%)' : 'scale(1)' }}>
                <defs>
                  <pattern id="mainGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1E3A8A" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mainGrid)" />
                <path d="M 100 200 Q 300 150 500 300 T 900 250" fill="none" stroke="#1E3A8A" strokeWidth="3" opacity="0.3" className="hidden sm:block" />
                <path d="M 200 400 Q 400 350 600 500 T 1000 450" fill="none" stroke="#1E3A8A" strokeWidth="3" opacity="0.3" className="hidden sm:block" />
              </svg>

              {/* Map Data Visualization */}
              {mapZoomLevel === 'zoomed-out' ? (
                // Clustered View (Showing how many missing per area)
                <div className="absolute inset-0 transition-opacity duration-500 opacity-100">
                  <div 
                    className="absolute top-[30%] left-[25%] flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setMapZoomLevel('zoomed-in')}
                  >
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg">
                        14
                      </div>
                    </div>
                    <span className="mt-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 border border-gray-200 shadow-sm text-center">
                      Sylhet Sadar<br/><span className="text-[10px] text-gray-500 font-medium">{t('critical_zone')}</span>
                    </span>
                  </div>

                  <div 
                    className="absolute top-[50%] left-[60%] flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setMapZoomLevel('zoomed-in')}
                  >
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg text-sm">
                        5
                      </div>
                    </div>
                    <span className="mt-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 border border-gray-200 shadow-sm text-center">
                      Sunamganj<br/><span className="text-[10px] text-gray-500 font-medium">{t('river_belt')}</span>
                    </span>
                  </div>

                  <div 
                    className="absolute top-[20%] left-[70%] flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setMapZoomLevel('zoomed-in')}
                  >
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg text-xs">
                        2
                      </div>
                    </div>
                    <span className="mt-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-900 border border-gray-200 shadow-sm text-center">
                      Netrokona
                    </span>
                  </div>
                </div>
              ) : (
                // Zoomed In View (Individual Pins)
                <div className="absolute inset-0 transition-opacity duration-500 opacity-100 animate-in fade-in zoom-in-95">
                  {/* Individual Pin 1 */}
                  <div className="absolute top-[25%] left-[20%] group">
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer hover:scale-125 transition-transform"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="flex gap-2">
                        <img src="https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?w=100&q=80" alt="Person" className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Ayesha Begum, 34</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Pin 2 */}
                  <div className="absolute top-[32%] left-[28%] group">
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer hover:scale-125 transition-transform"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400"><UserCircle className="w-6 h-6" /></div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Unknown Male, ~40</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> 5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Pin 3 */}
                  <div className="absolute top-[28%] left-[32%] group">
                    <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer hover:scale-125 transition-transform"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="flex gap-2">
                        <img src="https://images.unsplash.com/photo-1647980188230-acfc89a718bb?w=100&q=80" alt="Person" className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Fatima, 36</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> 1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Pin 4 (Sunamganj Area) */}
                  <div className="absolute top-[48%] left-[58%] group">
                    <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-lg relative z-10 cursor-pointer hover:scale-125 transition-transform"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="flex gap-2">
                        <img src="https://images.unsplash.com/photo-1561165804-4ec46664a4cb?w=100&q=80" alt="Person" className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Rina Akhtar, 32</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> 3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Context Note when zoomed in */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200 text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#1E3A8A]" />
                    {t('hover_pins_detail')}
                  </div>
                </div>
              )}
            </div>

            {/* Map Legend & Summary */}
            <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-3 gap-4 shrink-0">
              <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{t('total_missing_active')}</p>
                  <p className="text-lg font-bold text-gray-900">21</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-around">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full shadow-sm"></div>
                  <span className="text-xs text-gray-600 font-medium">{t('high_density')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full shadow-sm"></div>
                  <span className="text-xs text-gray-600 font-medium">{t('medium_density')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                  <span className="text-xs text-gray-600 font-medium">{t('low_density')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'search' ? (
          <div className="space-y-8">
            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('facial_recognition_search')}</h3>
                  <p className="text-sm text-gray-500 mb-6">{t('upload_photo_desc')}</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50/50 relative">
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#1E3A8A] animate-spin mb-4"></div>
                        <p className="text-sm font-medium text-[#1E3A8A]">{t('analyzing_features')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('cross_referencing')}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm font-medium text-gray-900">{t('click_upload')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('file_types')}</p>
                      </>
                    )}
                  </div>
                  
                  {!isSearching && !showResults && (
                    <button 
                      onClick={handleSearch}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-[#1E3A8A] text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      {t('run_ai_search')}
                    </button>
                  )}
                </div>
                
                {/* Info / Map Placeholder */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-[#1E3A8A]" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('high_trust_database')}</h4>
                  <p className="text-sm text-gray-600 max-w-sm">{t('high_trust_desc')}</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {showResults && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{t('top_potential_matches')}</h3>
                  <button className="text-sm font-medium text-[#1E3A8A] hover:text-blue-800">{t('export_report')}</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockResults.map((result) => (
                    <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                        <ImageWithFallback src={result.img} alt={result.name} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-[#1E3A8A] shadow-sm">
                          {result.score}% {t('match')}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-bold text-gray-900 truncate">{result.name}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                              result.status === 'Rescued / Safe' ? 'bg-green-100 text-green-700' :
                              result.status === 'Possible Match' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {result.status}
                            </span>
                          </div>
                          <div className="space-y-1 mt-2">
                            <p className="text-xs text-gray-600 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {result.lastSeen}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {result.date}
                            </p>
                            <p className="text-xs text-gray-600 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {result.phone}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button className="text-xs font-medium text-[#1E3A8A] flex items-center hover:underline">
                            {t('view_full_details')} <ChevronRight className="w-3 h-3 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Map className="w-5 h-5 text-gray-500" />
                    {t('last_seen_locations')}
                  </h4>
                  <div className="h-48 bg-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center">
                    {/* Map placeholder */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A8A" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mapGrid)" />
                      </svg>
                    </div>
                    {/* Match Pins */}
                    <div className="absolute top-[40%] left-[30%] w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                    <div className="absolute top-[60%] left-[50%] w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-[50%] left-[70%] w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow-md"></div>
                    <div className="absolute top-[45%] left-[80%] w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{t('report_missing_title')}</h3>
              <p className="text-sm text-gray-500">{t('report_missing_desc')}</p>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('full_name')}</label>
                      <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="e.g. John Doe" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('age')}</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder="e.g. 35" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white">
                          <option>{t('select')}</option>
                          <option>{t('male')}</option>
                          <option>{t('female')}</option>
                          <option>{t('other')}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('last_seen_location')}</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('area_village_landmark')} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('date_last_seen')}</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="date" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('time_last_seen')}</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="time" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('photo_recommended')}</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                        <Upload className="w-6 h-6 text-gray-400 mb-2" />
                        <p className="text-xs font-medium text-gray-900">{t('upload_photo')}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{t('clear_face_photo')}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('clothing_description')}</label>
                       <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('clothing_placeholder')} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('your_contact_info')}</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" placeholder={t('phone_number')} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('additional_notes')}</label>
                   <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none" placeholder={t('additional_notes_placeholder')}></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    {t('cancel')}
                  </button>
                  <button type="button" className="px-5 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-lg hover:bg-red-700 flex items-center gap-2 shadow-sm">
                    <CheckCircle className="w-4 h-4" />
                    {t('submit_report')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}