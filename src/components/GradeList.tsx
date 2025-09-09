"use client";

import { useState } from "react";
import type { Grade } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { GradeForm } from "./GradeForm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GradeListProps {
  courseId: string;
  grades: Grade[];
}

export function GradeList({ courseId, grades }: GradeListProps) {
  const { deleteGrade } = useData();
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);

  if (grades.length === 0) {
    return (
        <Card className="text-center py-10">
            <CardHeader>
                <CardTitle>No Grades Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Add your first grade to see it here.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.name}</TableCell>
                  <TableCell className="text-right">{grade.score.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{grade.weight.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingGrade(grade)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This will permanently delete the grade for "{grade.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteGrade(courseId, grade.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <GradeForm
        open={!!editingGrade}
        onOpenChange={(isOpen) => !isOpen && setEditingGrade(null)}
        courseId={courseId}
        grade={editingGrade ?? undefined}
      />
    </>
  );
}
