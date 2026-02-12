import { useState } from 'react';
import { RotateCcw, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { InboxView } from './inbox-view';
import { NextActionsView } from './next-actions-view';
import { ProjectsView } from './projects-view';
import { WaitingForView } from './waiting-for-view';
import { SomedayMaybeView } from './someday-maybe-view';
import { CalendarView } from './calendar-view';
import { db } from '../../db/database';

const STEPS = [
  {
    title: 'Clear Your Inbox',
    description: 'Process every item. Move to the right list or delete.',
    component: InboxView,
  },
  {
    title: 'Review Next Actions',
    description: 'Are these still relevant? Complete or remove stale items.',
    component: NextActionsView,
  },
  {
    title: 'Review Projects',
    description: 'Does each project have at least one next action?',
    component: ProjectsView,
  },
  {
    title: 'Review Waiting For',
    description: 'Follow up needed? Any items overdue?',
    component: WaitingForView,
  },
  {
    title: 'Review Someday/Maybe',
    description: 'Anything ready to activate? Remove items no longer interesting.',
    component: SomedayMaybeView,
  },
  {
    title: 'Review Calendar',
    description: 'Check upcoming dates and deadlines.',
    component: CalendarView,
  },
];

export function WeeklyReviewView() {
  const [step, setStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = async () => {
    await db.settings.update(1, {
      lastWeeklyReview: new Date().toISOString(),
    });
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-surface-900 mb-2">
          Weekly Review Complete!
        </h2>
        <p className="text-surface-500">
          Great job. Your system is up to date.
        </p>
      </div>
    );
  }

  const currentStep = STEPS[step];
  const StepComponent = currentStep.component;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <RotateCcw className="w-5 h-5 text-primary-500" />
        <div>
          <h2 className="text-xl font-semibold text-surface-900">
            Weekly Review
          </h2>
          <p className="text-sm text-surface-500">
            Step {step + 1} of {STEPS.length}: {currentStep.title}
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-primary-500' : 'bg-surface-200'
            }`}
          />
        ))}
      </div>

      <div className="bg-primary-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-primary-800">{currentStep.description}</p>
      </div>

      <StepComponent />

      <div className="flex items-center justify-between mt-8 pt-4 border-t border-surface-200">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm text-surface-600 hover:text-surface-900 disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Complete Review
          </button>
        )}
      </div>
    </div>
  );
}
