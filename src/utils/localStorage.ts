// Local storage keys
export const STORAGE_KEYS = {
  SCHEDULE_FILTERS: 'schedule_filters',
  SCHEDULE_SELECTED_COURSE: 'schedule_selected_course',
  SCHEDULE_VIEW_STATE: 'schedule_view_state',
  PERSONAL_SCHEDULE: 'personal_schedule',
  SELECTED_SEMESTER: 'selected_semester'
} as const;

// Schedule filter interface
export interface ScheduleFilters {
  searchQ: string;
  activeCampus: string;
  selectedLecturer: string;
  filterByDate: boolean;
  selectedDate: string | null; // ISO string format
  viewMonth: number;
  viewYear: number;
}

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  list_group?: Array<{
    lt_group: string;
    lecturer?: string;
    bt_lecturer?: string;
    schedules?: Array<{
      thu?: string;
      tiet?: string;
      phong?: string;
      cs?: string;
      tuan_hoc?: string;
    }>;
  }>;
}

// Generic localStorage utilities
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.warn(`Failed to save to localStorage with key "${key}":`, error);
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.warn(`Failed to load from localStorage with key "${key}":`, error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove from localStorage with key "${key}":`, error);
  }
};

// Schedule-specific localStorage functions
export const saveScheduleFilters = (filters: ScheduleFilters): void => {
  saveToLocalStorage(STORAGE_KEYS.SCHEDULE_FILTERS, filters);
};

export const loadScheduleFilters = (): ScheduleFilters => {
  const today = new Date();
  const defaultFilters: ScheduleFilters = {
    searchQ: "",
    activeCampus: "all",
    selectedLecturer: "all",
    filterByDate: false,
    selectedDate: null,
    viewMonth: today.getMonth(),
    viewYear: today.getFullYear()
  };
  
  return loadFromLocalStorage(STORAGE_KEYS.SCHEDULE_FILTERS, defaultFilters);
};

export const saveSelectedCourse = (course: Course | null): void => {
  saveToLocalStorage(STORAGE_KEYS.SCHEDULE_SELECTED_COURSE, course);
};

export const loadSelectedCourse = (): Course | null => {
  return loadFromLocalStorage<Course | null>(STORAGE_KEYS.SCHEDULE_SELECTED_COURSE, null);
};

export const clearScheduleData = (): void => {
  removeFromLocalStorage(STORAGE_KEYS.SCHEDULE_FILTERS);
  removeFromLocalStorage(STORAGE_KEYS.SCHEDULE_SELECTED_COURSE);
  removeFromLocalStorage(STORAGE_KEYS.SCHEDULE_VIEW_STATE);
};

// Personal schedule types and functions
export interface PersonalScheduleEntry {
  semester: string;
  course_code: string;
  course_name: string;
  credits: number;
  practice_credits: number;
  group: string;
  day: string;
  period: string;
  time: string;
  room: string;
  campus: string;
  weeks: string;
}

export const savePersonalSchedule = (schedule: PersonalScheduleEntry[]): void => {
  saveToLocalStorage(STORAGE_KEYS.PERSONAL_SCHEDULE, schedule);
};

export const loadPersonalSchedule = (): PersonalScheduleEntry[] => {
  return loadFromLocalStorage<PersonalScheduleEntry[]>(STORAGE_KEYS.PERSONAL_SCHEDULE, []);
};

export const saveSelectedSemester = (semester: string): void => {
  saveToLocalStorage(STORAGE_KEYS.SELECTED_SEMESTER, semester);
};

export const loadSelectedSemester = (): string => {
  return loadFromLocalStorage<string>(STORAGE_KEYS.SELECTED_SEMESTER, '');
};

// Helper to convert Date to/from ISO string for localStorage
export const dateToStorageString = (date: Date | null): string | null => {
  return date ? date.toISOString() : null;
};

export const dateFromStorageString = (dateString: string | null): Date | null => {
  if (!dateString) return null;
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
};
