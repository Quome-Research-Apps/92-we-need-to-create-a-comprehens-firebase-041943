"use client";
import { useState } from 'react';
import { predictFinalGrade, PredictFinalGradeOutput } from '@/ai/flows/predict-final-grade';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface GradePredictionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGrade: number | null;
  remainingWeight: number;
}

export function GradePredictionModal({
  open,
  onOpenChange,
  currentGrade,
  remainingWeight,
}: GradePredictionModalProps) {
  const [optimisticScenario, setOptimisticScenario] = useState('I will study hard for the final exam and complete all remaining assignments to the best of my ability.');
  const [pessimisticScenario, setPessimisticScenario] = useState('I will not study much for the final exam and might miss one of the remaining small assignments.');
  const [prediction, setPrediction] = useState<PredictFinalGradeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (currentGrade === null || remainingWeight <= 0) {
      toast({
        variant: 'destructive',
        title: 'Cannot Make Prediction',
        description: 'Need a current grade and remaining assignments to make a prediction.',
      });
      return;
    }
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictFinalGrade({
        currentGrade,
        remainingWeight,
        optimisticScenario,
        pessimisticScenario,
      });
      setPrediction(result);
    } catch (error) {
      console.error('Error predicting grade:', error);
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: 'An error occurred while communicating with the AI. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Grade Predictor
          </DialogTitle>
          <DialogDescription>
            See potential outcomes for your final grade based on different effort scenarios for the remaining {remainingWeight.toFixed(0)}% of your coursework.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <Label htmlFor="optimistic">Optimistic Scenario</Label>
            <Textarea
              id="optimistic"
              value={optimisticScenario}
              onChange={(e) => setOptimisticScenario(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="pessimistic">Pessimistic Scenario</Label>
            <Textarea
              id="pessimistic"
              value={pessimisticScenario}
              onChange={(e) => setPessimisticScenario(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
        </div>

        {prediction && (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <Card className="text-center bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <CardHeader><CardTitle className="text-green-800 dark:text-green-300">Optimistic</CardTitle></CardHeader>
                    <CardContent className="text-4xl font-bold text-green-600 dark:text-green-400">{prediction.optimisticPrediction.toFixed(1)}%</CardContent>
                </Card>
                <Card className="text-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                    <CardHeader><CardTitle className="text-red-800 dark:text-red-300">Pessimistic</CardTitle></CardHeader>
                    <CardContent className="text-4xl font-bold text-red-600 dark:text-red-400">{prediction.pessimisticPrediction.toFixed(1)}%</CardContent>
                </Card>
             </div>
             <Card>
                <CardHeader><CardTitle>AI Advisor's Note</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{prediction.advice}</p>
                </CardContent>
             </Card>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handlePredict} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              'Predict Final Grade'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
