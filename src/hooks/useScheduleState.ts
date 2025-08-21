import { useState, useEffect, useCallback } from 'react';
import {
  ScheduleFilters,
  Course,
  saveScheduleFilters,
  loadScheduleFilters,
  saveSelectedCourse,
  loadSelectedCourse,
  dateToStorageString,
  dateFromStorageString,
  clearScheduleData
} from '@/utils/localStorage';

export interface UseScheduleStateReturn {
  // Filter states
  searchQ: string;
  activeCampus: string;
  selectedLecturer: string;
  filterByDate: boolean;
  selectedDate: Date | null;
  viewMonth: number;
  viewYear: number;
  selectedCourse: Course | null;

  // Setters
  setSearchQ: (value: string) => void;
  setActiveCampus: (value: string) => void;
  setSelectedLecturer: (value: string) => void;
  setFilterByDate: (value: boolean) => void;
  setSelectedDate: (value: Date | null) => void;
  setViewMonth: (value: number) => void;
  setViewYear: (value: number) => void;
  setSelectedCourse: (value: Course | null) => void;

  // Actions
  clearAllFilters: () => void;
  resetToDefaults: () => void;
}

export const useScheduleState = (): UseScheduleStateReturn => {
  // Initialize states from localStorage
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchQ, setSearchQState] = useState("");
  const [activeCampus, setActiveCampusState] = useState("all");
  const [selectedLecturer, setSelectedLecturerState] = useState("all");
  const [filterByDate, setFilterByDateState] = useState(false);
  const [selectedDate, setSelectedDateState] = useState<Date | null>(null);
  const [viewMonth, setViewMonthState] = useState(new Date().getMonth());
  const [viewYear, setViewYearState] = useState(new Date().getFullYear());
  const [selectedCourse, setSelectedCourseState] = useState<Course | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const filters = loadScheduleFilters();
    const course = loadSelectedCourse();

    setSearchQState(filters.searchQ);
    setActiveCampusState(filters.activeCampus);
    setSelectedLecturerState(filters.selectedLecturer);
    setFilterByDateState(filters.filterByDate);
    setSelectedDateState(dateFromStorageString(filters.selectedDate));
    setViewMonthState(filters.viewMonth);
    setViewYearState(filters.viewYear);
    setSelectedCourseState(course);
    
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const filters: ScheduleFilters = {
      searchQ,
      activeCampus,
      selectedLecturer,
      filterByDate,
      selectedDate: dateToStorageString(selectedDate),
      viewMonth,
      viewYear
    };

    saveScheduleFilters(filters);
  }, [isInitialized, searchQ, activeCampus, selectedLecturer, filterByDate, selectedDate, viewMonth, viewYear]);

  useEffect(() => {
    if (!isInitialized) return;
    saveSelectedCourse(selectedCourse);
  }, [isInitialized, selectedCourse]);

  // Wrapped setters that update state
  const setSearchQ = useCallback((value: string) => {
    setSearchQState(value);
  }, []);

  const setActiveCampus = useCallback((value: string) => {
    setActiveCampusState(value);
  }, []);

  const setSelectedLecturer = useCallback((value: string) => {
    setSelectedLecturerState(value);
  }, []);

  const setFilterByDate = useCallback((value: boolean) => {
    setFilterByDateState(value);
  }, []);

  const setSelectedDate = useCallback((value: Date | null) => {
    setSelectedDateState(value);
  }, []);

  const setViewMonth = useCallback((value: number) => {
    setViewMonthState(value);
  }, []);

  const setViewYear = useCallback((value: number) => {
    setViewYearState(value);
  }, []);

  const setSelectedCourse = useCallback((value: Course | null) => {
    setSelectedCourseState(value);
    // Reset lecturer filter when course changes
    if (value !== selectedCourse) {
      setSelectedLecturerState("all");
    }
  }, [selectedCourse]);

  // Clear all filters but keep them in sync
  const clearAllFilters = useCallback(() => {
    setSearchQState("");
    setActiveCampusState("all");
    setSelectedLecturerState("all");
    setFilterByDateState(false);
    setSelectedDateState(null);
    setSelectedCourseState(null);
  }, []);

  // Reset to defaults and clear localStorage
  const resetToDefaults = useCallback(() => {
    clearScheduleData();
    const today = new Date();
    setSearchQState("");
    setActiveCampusState("all");
    setSelectedLecturerState("all");
    setFilterByDateState(false);
    setSelectedDateState(null);
    setViewMonthState(today.getMonth());
    setViewYearState(today.getFullYear());
    setSelectedCourseState(null);
  }, []);

  return {
    // States
    searchQ,
    activeCampus,
    selectedLecturer,
    filterByDate,
    selectedDate,
    viewMonth,
    viewYear,
    selectedCourse,

    // Setters
    setSearchQ,
    setActiveCampus,
    setSelectedLecturer,
    setFilterByDate,
    setSelectedDate,
    setViewMonth,
    setViewYear,
    setSelectedCourse,

    // Actions
    clearAllFilters,
    resetToDefaults
  };
};
