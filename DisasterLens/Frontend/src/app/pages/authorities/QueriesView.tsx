import { useState } from 'react';
import { Search, X, Send, AlertCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface Query {
  id: number;
  senderName: string;
  role: 'Local Authority' | 'Volunteer' | 'Community';
  region: string;
  message: string;
  fullMessage: string;
  weatherData?: string;
  timeSubmitted: string;
  status: 'Pending' | 'Answered';
  priority: 'high' | 'normal';
}

const mockQueries: Query[] = [
  { id: 1, senderName: 'District Commissioner John David', role: 'Local Authority', region: 'Eastern Province', message: 'Urgent: Need immediate flood risk assessment for coastal areas', fullMessage: 'We are experiencing unprecedented rainfall in the Eastern Province coastal belt. Local communities are reporting rapidly rising water levels. We urgently need a comprehensive flood risk assessment and evacuation recommendations for the next 48 hours.', weatherData: 'Rainfall: 120mm in last 6 hours, Wind Speed: 45 km/h', timeSubmitted: '15 mins ago', status: 'Pending', priority: 'high' },
  { id: 2, senderName: 'Sarah Williams', role: 'Volunteer', region: 'Northern District', message: 'Request for weather forecast for relief distribution activities', fullMessage: 'Our volunteer team is planning relief distribution in flood-affected areas of Northern District. We need detailed weather forecasts for the next 3 days to plan our logistics and ensure volunteer safety.', weatherData: 'Temperature: 28°C, Humidity: 75%', timeSubmitted: '1 hour ago', status: 'Pending', priority: 'normal' },
  { id: 3, senderName: 'Chief Officer Michael Brown', role: 'Local Authority', region: 'Central Region', message: 'Clarification needed on cyclone alert severity levels', fullMessage: 'The recent cyclone alert classification for Central Region needs clarification. Our emergency response team requires specific information about wind speeds, expected landfall time, and recommended evacuation zones.', weatherData: 'Alert Level: Orange, Wind Speed Forecast: 85 km/h', timeSubmitted: '2 hours ago', status: 'Answered', priority: 'high' },
  { id: 4, senderName: 'Community Leader Priya Sharma', role: 'Community', region: 'Southern Coast', message: 'Query about storm surge predictions', fullMessage: 'Our coastal community is concerned about potential storm surge. Can you provide detailed predictions and safety guidelines for residents living within 500 meters of the coastline?', weatherData: 'Sea Level: Normal +0.3m, Tide: High at 18:00', timeSubmitted: '3 hours ago', status: 'Pending', priority: 'normal' },
  { id: 5, senderName: 'Ahmed Hassan', role: 'Volunteer', region: 'Western Region', message: 'Information needed for community awareness program', fullMessage: 'We are conducting a weather preparedness workshop for rural communities. Please provide simplified weather alert interpretation guidelines and early warning system information.', timeSubmitted: '5 hours ago', status: 'Answered', priority: 'normal' },
  { id: 6, senderName: 'Deputy Administrator Lisa Chen', role: 'Local Authority', region: 'Mountain District', message: 'Landslide risk assessment request', fullMessage: 'Heavy rainfall in Mountain District has raised concerns about landslide risks. We need immediate geological and weather correlation analysis for vulnerable hillside communities.', weatherData: 'Rainfall: 95mm, Soil Moisture: Critical', timeSubmitted: '6 hours ago', status: 'Pending', priority: 'high' },
];

const filterOptions = ['All Queries', 'Local Authorities', 'Volunteers', 'Community Members'];
const roleColors: Record<string, string> = { 'Local Authority': '#1E3A8A', 'Volunteer': '#0EA5E9', 'Community': '#16A34A' };

export default function QueriesView() {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('All Queries');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filtered = mockQueries.filter(q => {
    const matchesFilter =
      selectedFilter === 'All Queries' ||
      (selectedFilter === 'Local Authorities' && q.role === 'Local Authority') ||
      (selectedFilter === 'Volunteers' && q.role === 'Volunteer') ||
      (selectedFilter === 'Community Members' && q.role === 'Community');
    const matchesSearch = q.senderName.toLowerCase().includes(searchTerm.toLowerCase()) || q.message.toLowerCase().includes(searchTerm.toLowerCase()) || q.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 p-8 overflow-auto bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder={t('authority.searchQueries')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 min-w-[200px] justify-between">
                <span className="text-sm text-gray-700">{selectedFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filterOptions.map(opt => (
                    <button key={opt} onClick={() => { setSelectedFilter(opt); setShowDropdown(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${selectedFilter === opt ? 'bg-blue-50 text-blue-700' : 'text-gray-700'} first:rounded-t-lg last:rounded-b-lg`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50">
                  {[t('authority.senderName'), t('authority.role'), t('authority.region'), t('authority.queryMessage'), t('authority.timeSubmitted'), t('authority.status'), t('common.action')].map(h => (
                    <th key={h} className="text-left py-4 px-6 text-sm text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{q.senderName}</span>
                        {q.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-600" />}
                      </div>
                    </td>
                    <td className="py-4 px-6"><span className="inline-block px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: roleColors[q.role] }}>{q.role}</span></td>
                    <td className="py-4 px-6 text-sm text-gray-700">{q.region}</td>
                    <td className="py-4 px-6"><p className="text-sm text-gray-900 line-clamp-2 max-w-md">{q.message}</p></td>
                    <td className="py-4 px-6 text-sm text-gray-600">{q.timeSubmitted}</td>
                    <td className="py-4 px-6"><span className={`inline-block px-3 py-1 rounded-full text-xs ${q.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{q.status}</span></td>
                    <td className="py-4 px-6"><button onClick={() => setSelectedQuery(q)} className="text-sm font-medium text-blue-900 hover:underline">{q.status === 'Pending' ? 'Reply' : 'View'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="py-12 text-center"><p className="text-gray-500">{t('authority.noQueriesFound')}</p></div>}
          </div>
        </div>
      </div>

      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('authority.queryDetails')}</h2>
              <button onClick={() => setSelectedQuery(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900 font-semibold">{selectedQuery.senderName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedQuery.region}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: roleColors[selectedQuery.role] }}>{selectedQuery.role}</span>
                    {selectedQuery.priority === 'high' && <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white bg-red-600"><AlertCircle className="w-3 h-3" />High Priority</div>}
                  </div>
                </div>
                <div className="text-sm text-gray-500">Submitted: {selectedQuery.timeSubmitted}</div>
              </div>
              <div>
                <h4 className="text-gray-900 font-semibold mb-2">Query Message</h4>
                <p className="text-gray-700 leading-relaxed">{selectedQuery.fullMessage}</p>
              </div>
              {selectedQuery.weatherData && (
                <div>
                  <h4 className="text-gray-900 font-semibold mb-2">Weather Data Reference</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm text-gray-700">{selectedQuery.weatherData}</p></div>
                </div>
              )}
              <div>
                <h4 className="text-gray-900 font-semibold mb-2">Status</h4>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${selectedQuery.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{selectedQuery.status}</span>
              </div>
              {selectedQuery.status === 'Pending' ? (
                <div>
                  <h4 className="text-gray-900 font-semibold mb-3">Send Response</h4>
                  <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Type your response here..." className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={6} />
                  <div className="flex justify-end gap-3 mt-3">
                    <button onClick={() => setSelectedQuery(null)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => { setReplyText(''); setSelectedQuery(null); }} disabled={!replyText.trim()} className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-900 flex items-center gap-2 disabled:opacity-50"><Send className="w-4 h-4" />Send Response</button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-sm text-green-700 font-medium">✓ Query has been answered</p></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
