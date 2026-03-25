import { useState } from 'react';
import { Search, X, Send, AlertCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { mockQueries } from '../data/mockData';

export function QueriesView() {
  const { t, d } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('All Queries');
  const [selectedQuery, setSelectedQuery] = useState<typeof mockQueries[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [t('all_queries'), t('local_authorities'), t('volunteers'), t('community_members')];

  const filteredQueries = mockQueries.filter((query) => {
    const matchesFilter = 
      selectedFilter === t('all_queries') ||
      (selectedFilter === t('local_authorities') && query.role === 'Local Authority') ||
      (selectedFilter === t('volunteers') && query.role === 'Volunteer') ||
      (selectedFilter === t('community_members') && query.role === 'Community Member');

    const matchesSearch = 
      d(query.senderName, query.senderNameBn).toLowerCase().includes(searchTerm.toLowerCase()) ||
      d(query.message, query.messageBn).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleSendReply = () => {
    if (replyText.trim()) {
      // Handle sending reply
      console.log('Sending reply:', replyText);
      setReplyText('');
      setSelectedQuery(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Local Authority':
        return '#1E3A8A';
      case 'Volunteer':
        return '#0EA5E9';
      case 'Community':
        return '#16A34A';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_queries')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[200px] justify-between"
              >
                <span className="text-sm text-gray-700">{selectedFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedFilter(option);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        selectedFilter === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Query Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200" style={{ backgroundColor: '#F8FAFC' }}>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('sender_name')}</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('role')}</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('region')}</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('query_message')}</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('time_submitted')}</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('status')}</th>
                  <th className="text-left py-4 px-6 text-sm text-gray-600">{t('action')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((query) => (
                  <tr 
                    key={query.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{d(query.senderName, query.senderNameBn)}</span>
                        {query.priority === 'high' && (
                          <AlertCircle className="w-4 h-4" style={{ color: '#DC2626' }} />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs text-white"
                        style={{ backgroundColor: getRoleBadgeColor(query.role) }}
                      >
                        {d(query.role, query.roleBn)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{query.role}</td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-md">
                        {d(query.message, query.messageBn)}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{d(query.timeSubmitted, query.timeSubmittedBn)}</td>
                    <td className="py-4 px-6">
                      <span 
                        className={`inline-block px-3 py-1 rounded-full text-xs ${
                          !query.answered 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {!query.answered ? t('pending') : t('answered')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedQuery(query)}
                        className="text-sm font-medium hover:underline"
                        style={{ color: '#1E3A8A' }}
                      >
                        {!query.answered ? t('reply') : t('view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredQueries.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">{t('no_queries_found')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Query Details Panel */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{t('query_details')}</h2>
              <button
                onClick={() => setSelectedQuery(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-6">
              {/* Sender Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900 font-semibold">{d(selectedQuery.senderName, selectedQuery.senderNameBn)}</h3>
                    <p className="text-sm text-gray-600 mt-1">{d(selectedQuery.role, selectedQuery.roleBn)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs text-white"
                      style={{ backgroundColor: getRoleBadgeColor(selectedQuery.role) }}
                    >
                      {d(selectedQuery.role, selectedQuery.roleBn)}
                    </span>
                    {selectedQuery.priority === 'high' && (
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#DC2626' }}>
                        <AlertCircle className="w-3 h-3" />
                        <span>{t('high_priority')}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {t('submitted')}: {d(selectedQuery.timeSubmitted, selectedQuery.timeSubmittedBn)}
                </div>
              </div>

              {/* Full Query Message */}
              <div>
                <h4 className="text-gray-900 font-semibold mb-2">{t('query_message_label')}</h4>
                <p className="text-gray-700 leading-relaxed">{d(selectedQuery.message, selectedQuery.messageBn)}</p>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-gray-900 font-semibold mb-2">{t('status')}</h4>
                <span 
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                    !selectedQuery.answered 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {!selectedQuery.answered ? t('pending') : t('answered')}
                </span>
              </div>

              {/* Reply Section */}
              {!selectedQuery.answered && (
                <div>
                  <h4 className="text-gray-900 font-semibold mb-3">{t('send_response')}</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={t('type_response')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={6}
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => setSelectedQuery(null)}
                      className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="px-5 py-2.5 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#1E3A8A' }}
                    >
                      <Send className="w-4 h-4" />
                      {t('send_response_btn')}
                    </button>
                  </div>
                </div>
              )}

              {/* If already answered, show read-only status */}
              {selectedQuery.answered && selectedQuery.response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-medium mb-2">✓ {t('query_answered')}</p>
                  <p className="text-sm text-gray-700">{d(selectedQuery.response, selectedQuery.responseBn || '')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}