import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, Clock, MapPin, User } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

type EventLogItem = {
  id: string;
  source?: string;
  eventType?: string;
  volunteerName?: string;
  volunteerNameBn?: string;
  village?: string;
  villageBn?: string;
  timeOfActivity?: string;
  activityTypes?: string[];
  households?: number;
  peopleRescued?: number;
  reliefKits?: number;
  notes?: string;
  urgency?: string;
  created_at?: string;
};

function formatDateTime(value: string | undefined, locale: string): string {
  if (!value) {
    return '-';
  }
  const asDate = new Date(value);
  if (Number.isNaN(asDate.getTime())) {
    return value;
  }
  return asDate.toLocaleString(locale);
}

export function EventLogView() {
  const { token } = useAuth();
  const { t, d, lang, bnenconvert } = useLanguage();
  const [rows, setRows] = useState<EventLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.householdsReached += Number(row.households ?? 0);
        acc.peopleRescued += Number(row.peopleRescued ?? 0);
        acc.reliefDelivered += Number(row.reliefKits ?? 0);
        return acc;
      },
      {
        householdsReached: 0,
        peopleRescued: 0,
        reliefDelivered: 0,
      },
    );
  }, [rows]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<EventLogItem[]>('/authority/event-logs', token);
        setRows(data);
      } catch (error) {
        console.error('Failed to load event logs', error);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [token]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('event_log')}</h1>
          <p className="text-gray-600 mt-1">{t('event_log_desc')}</p>
        </div>

        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('households_reached')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{bnenconvert(summary.householdsReached)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('people_rescued')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{bnenconvert(summary.peopleRescued)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('relief_delivered')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{bnenconvert(summary.reliefDelivered)}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-sm text-gray-600">{t('loading_event_logs')}</div>
        ) : rows.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{t('no_events_logged')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      {row.activityTypes && row.activityTypes.length > 0 ? row.activityTypes.join(', ') : t('volunteer_activity')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {row.eventType === 'volunteer_activity' ? t('volunteer_activity') : row.eventType || t('volunteer_activity')}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      row.urgency === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {t(row.urgency || 'routine').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {d(row.volunteerName || '-', row.volunteerNameBn || row.volunteerName || '-')}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {d(row.village || '-', row.villageBn || row.village || '-')}</p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {bnenconvert(row.timeOfActivity || '-')} ({formatDateTime(row.created_at, lang === 'bn' ? 'bn-BD' : 'en-US')})</p>
                  <p>{t('households')}: <span className="font-semibold">{bnenconvert(row.households ?? 0)}</span> | {t('rescued')}: <span className="font-semibold">{bnenconvert(row.peopleRescued ?? 0)}</span> | {t('relief_kits')}: <span className="font-semibold">{bnenconvert(row.reliefKits ?? 0)}</span></p>
                </div>

                {row.notes ? (
                  <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-700">
                    {row.notes}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
