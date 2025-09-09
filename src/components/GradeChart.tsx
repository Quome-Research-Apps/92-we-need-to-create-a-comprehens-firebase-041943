"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Grade } from "@/lib/types"

interface GradeChartProps {
    grades: Grade[]
}

export function GradeChart({ grades }: GradeChartProps) {
  const chartData = grades.map(g => ({
    name: g.name,
    score: g.score,
  }));
  
  return (
    <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip
            contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--card-foreground))",
                borderRadius: "var(--radius)",
            }}
            />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
