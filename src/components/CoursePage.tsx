"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useData } from "@/contexts/data-context";
import { calculateCourseGrade } from "@/lib/grade-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, PlusCircle, Sparkles, AlertTriangle } from "lucide-react";
import { GradeList } from "./GradeList";
import { GradeForm } from "./GradeForm";
import { GradePredictionModal } from "./GradePredictionModal";
import { GradeChart } from "./GradeChart";

interface CoursePageProps {
  courseId: string;
}

export default function CoursePage({ courseId }: CoursePageProps) {
  const { getCourseById } = useData();
  const [isMounted, setIsMounted] = useState(false);
  const [isGradeFormOpen, setIsGradeFormOpen] = useState(false);
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const course = getCourseById(courseId);

  if (!isMounted) {
    return null; // or a loading skeleton
  }

  if (!course) {
    return (
      <div className="container mx-auto p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold">Course Not Found</h1>
        <p className="mt-2 text-muted-foreground">The course you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const { grade, weightCompleted } = calculateCourseGrade(course.grades);
  const displayGrade = grade !== null ? `${grade.toFixed(2)}%` : "N/A";
  const remainingWeight = 100 - weightCompleted;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.name}</h1>
          <p className="text-lg text-muted-foreground">{course.credits} Credits</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsPredictionModalOpen(true)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Predict Grade
            </Button>
            <Button onClick={() => setIsGradeFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Grade
            </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
            <CardHeader>
                <CardTitle>Current Grade</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-primary">{displayGrade}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Weight Completed</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{weightCompleted.toFixed(0)}%</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Remaining Weight</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold">{remainingWeight.toFixed(0)}%</p>
            </CardContent>
        </Card>
      </div>

      {course.grades.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Your scores on individual assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <GradeChart grades={course.grades} />
          </CardContent>
        </Card>
      )}

      <GradeList courseId={course.id} grades={course.grades} />

      <GradeForm open={isGradeFormOpen} onOpenChange={setIsGradeFormOpen} courseId={course.id} />
      <GradePredictionModal 
        open={isPredictionModalOpen} 
        onOpenChange={setIsPredictionModalOpen} 
        currentGrade={grade}
        remainingWeight={remainingWeight}
      />
    </div>
  );
}
