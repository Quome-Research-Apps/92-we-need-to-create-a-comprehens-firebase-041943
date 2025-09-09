"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

import type { Course } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { calculateCourseGrade } from "@/lib/grade-utils";
import { CourseForm } from "./CourseForm";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { deleteCourse } = useData();
  const [isEditing, setIsEditing] = useState(false);
  
  const { grade } = calculateCourseGrade(course.grades);
  const displayGrade = grade !== null ? `${grade.toFixed(2)}%` : "N/A";

  return (
    <>
      <Card className="flex flex-col transition-shadow hover:shadow-lg">
        <CardHeader className="flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
            <CardDescription>{course.credits} credits</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the course "{course.name}" and all its grades. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCourse(course.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Current Grade</p>
            <p className="text-5xl font-bold text-primary">{displayGrade}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" variant="outline">
            <Link href={`/courses/${course.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
      <CourseForm open={isEditing} onOpenChange={setIsEditing} course={course} />
    </>
  );
}
