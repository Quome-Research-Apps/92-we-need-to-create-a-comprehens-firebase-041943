"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { courseSchema } from "@/lib/schemas";
import { useData } from "@/contexts/data-context";
import type { Course } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseFormProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
}

export function CourseForm({ children, open, onOpenChange, course }: CourseFormProps) {
  const { addCourse, updateCourse } = useData();
  const { toast } = useToast();
  const isEditing = !!course;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      credits: 3,
    },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        name: course.name,
        credits: course.credits,
      });
    } else {
        form.reset({
            name: "",
            credits: 3,
        });
    }
  }, [course, open, form]);

  function onSubmit(data: CourseFormValues) {
    if (isEditing) {
      updateCourse(course.id, data);
      toast({
        title: "Course Updated",
        description: `"${data.name}" has been successfully updated.`,
      });
    } else {
      addCourse(data);
      toast({
        title: "Course Added",
        description: `"${data.name}" has been added to your dashboard.`,
      });
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Course" : "Add New Course"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the details for your course." : "Enter the details for your new course."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Psychology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{isEditing ? "Save Changes" : "Add Course"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
