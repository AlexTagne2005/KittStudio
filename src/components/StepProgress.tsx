import React from 'react';
import { Camera, Wand2, LayoutGrid, CheckCircle2, ChevronRight } from 'lucide-react';
import { Language } from '../types';
import { getT } from '../utils/i18n';

interface StepProgressProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxAccessibleStep: number;
  language: Language;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  onSelectStep,
  maxAccessibleStep,
  language,
}) => {
  const t = getT(language);

  const steps = [
    { num: 1, label: t.step1, icon: Camera },
    { num: 2, label: t.step2, icon: Wand2 },
    { num: 3, label: t.step3, icon: LayoutGrid },
    { num: 4, label: t.step4, icon: CheckCircle2 },
  ];

  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 overflow-x-auto no-scrollbar">
      <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[540px] md:min-w-0">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;
          const isClickable = step.num <= maxAccessibleStep;

          return (
            <React.Fragment key={step.num}>
              <button
                disabled={!isClickable}
                onClick={() => onSelectStep(step.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                    : isCompleted
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : isClickable
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                <span>{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-700 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
