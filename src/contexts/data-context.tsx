"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Course, Grade } from '@/lib/types';
import { usePersistentState } from '@/hooks/use-persistent-state';

interface DataContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'grades'>) => void;
  updateCourse: (courseId: string, updatedData: Partial<Omit<Course, 'id' | 'grades'>>) => void;
  deleteCourse: (courseId: string) => void;
  addGrade: (courseId: string, grade: Omit<Grade, 'id'>) => void;
  updateGrade: (courseId: string, gradeId: string, updatedData: Partial<Omit<Grade, 'id'>>) => void;
  deleteGrade: (courseId: string, gradeId: string) => void;
  getCourseById: (courseId: string) => Course | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = usePersistentState<Course[]>('gradepal-courses', []);

  const addCourse = (course: Omit<Course, 'id' | 'grades'>) => {
    const newCourse: Course = {
      ...course,
      id: crypto.randomUUID(),
      grades: [],
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (courseId: string, updatedData: Partial<Omit<Course, 'id' | 'grades'>>) => {
    setCourses(prev => prev.map(c => (c.id === courseId ? { ...c, ...updatedData } : c)));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  const addGrade = (courseId: string, grade: Omit<Grade, 'id'>) => {
    const newGrade: Grade = {
      ...grade,
      id: crypto.randomUUID(),
    };
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, grades: [...c.grades, newGrade] } : c
    ));
  };

  const updateGrade = (courseId: string, gradeId: string, updatedData: Partial<Omit<Grade, 'id'>>) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, grades: c.grades.map(g => 
        g.id === gradeId ? { ...g, ...updatedData } : g
      )} : c
    ));
  };

  const deleteGrade = (courseId: string, gradeId: string) => {
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, grades: c.grades.filter(g => g.id !== gradeId) } : c
    ));
  };
  
  const getCourseById = (courseId: string) => {
    return courses.find(c => c.id === courseId);
  }

  const value = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    addGrade,
    updateGrade,
    deleteGrade,
    getCourseById,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
