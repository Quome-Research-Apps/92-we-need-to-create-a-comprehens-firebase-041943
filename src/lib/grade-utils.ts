import type { Course, Grade } from './types';

const GRADE_POINT_SCALE = [
  { grade: 93, point: 4.0 },
  { grade: 90, point: 3.7 },
  { grade: 87, point: 3.3 },
  { grade: 83, point: 3.0 },
  { grade: 80, point: 2.7 },
  { grade: 77, point: 2.3 },
  { grade: 73, point: 2.0 },
  { grade: 70, point: 1.7 },
  { grade: 67, point: 1.3 },
  { grade: 63, point: 1.0 },
  { grade: 60, point: 0.7 },
  { grade: 0, point: 0.0 },
];

export function getGradePoint(percentage: number | null): number {
  if (percentage === null) return 0.0;
  for (const scale of GRADE_POINT_SCALE) {
    if (percentage >= scale.grade) {
      return scale.point;
    }
  }
  return 0.0;
}

export function calculateCourseGrade(grades: Grade[]): { grade: number | null, weightCompleted: number } {
  if (grades.length === 0) {
    return { grade: null, weightCompleted: 0 };
  }

  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
  const weightedScore = grades.reduce((sum, g) => sum + (g.score * g.weight), 0);
  
  if (totalWeight === 0) {
    return { grade: null, weightCompleted: 0 };
  }
  
  const currentGrade = weightedScore / totalWeight;

  return { grade: currentGrade, weightCompleted: totalWeight };
}

export function calculateGpa(courses: Course[]): number {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        if (course.credits > 0) {
            const { grade } = calculateCourseGrade(course.grades);
            // We only count courses that have at least one grade
            if (grade !== null && course.grades.length > 0) {
                const gradePoint = getGradePoint(grade);
                totalPoints += gradePoint * course.credits;
                totalCredits += course.credits;
            }
        }
    });

    if (totalCredits === 0) {
        return 0.0;
    }

    const gpa = totalPoints / totalCredits;
    return isNaN(gpa) ? 0.0 : gpa;
}
