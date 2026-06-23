export interface StaticSiteVisit {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export interface InsertSiteVisit {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  serviceType?: string | null;
  notes?: string | null;
}

const STORAGE_KEY = 'signflow_site_visits';

// Get all site visit requests from localStorage
export const getStoredSiteVisits = (): StaticSiteVisit[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading site visits from localStorage:', error);
    return [];
  }
};

// Save site visit requests to localStorage
const saveSiteVisits = (visits: StaticSiteVisit[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  } catch (error) {
    console.error('Error saving site visits to localStorage:', error);
  }
};

// Create a new site visit request
export const createStaticSiteVisit = async (data: InsertSiteVisit): Promise<StaticSiteVisit> => {
  const visits = getStoredSiteVisits();

  const newVisit: StaticSiteVisit = {
    ...data,
    serviceType: data.serviceType ?? null,
    notes: data.notes ?? null,
    id: `sv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  visits.unshift(newVisit);
  saveSiteVisits(visits);

  return newVisit;
};

// Get all site visit requests
export const getAllStaticSiteVisits = async (): Promise<StaticSiteVisit[]> => {
  return getStoredSiteVisits();
};
