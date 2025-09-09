"use client";

import { useState } from "react";
import { useData } from "@/contexts/data-context";
import { calculateGpa } from "@/lib/grade-utils";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { CourseForm } from "./CourseForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Dashboard() {
  const { courses } = useData();
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const gpa = calculateGpa(courses);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-2xl font-semibold text-muted-foreground">
              GPA: {gpa.toFixed(2)}
            </p>
        </div>
        <CourseForm open={isCourseFormOpen} onOpenChange={setIsCourseFormOpen}>
          <Button onClick={() => setIsCourseFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </CourseForm>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Welcome to GradePal!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">You haven't added any courses yet.</p>
                <CourseForm open={isCourseFormOpen} onOpenChange={setIsCourseFormOpen}>
                <Button onClick={() => setIsCourseFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Course
                </Button>
                </CourseForm>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
