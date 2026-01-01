// This purely local 'AI' analyzes user data to give personalized feedback.
// It ensures 100% uptime and 0 cost.

const TIPS_BEGINNER = [
  "Start small! Consistency is more important than intensity.",
  "Don't break the chain! Try to get at least one checkmark today.",
  "Focus on just showing up. The rest will follow.",
  "A 1% improvement every day adds up to big results over time.",
  "Make your habit obvious. Put your running shoes by the bed!",
];

const TIPS_STRUGGLING = [
  "Missed a day? Don't worry, just get back on track today.",
  "Be kind to yourself. Progress is not always a straight line.",
  "Maybe lower your goal slightly? Success breeds success.",
  "Identify what stopped you yesterday and remove that obstacle today.",
  "Two minute rule: tell yourself you'll just do it for 2 minutes.",
];

const TIPS_MASTERY = [
  "You're crushing it! Time to crave a new challenge?",
  "You've built a solid routine. Can you increase the intensity?",
  "Inspire others! Share your streak with a friend.",
  "Now that this is automatic, what other habit can you stack onto it?",
  "Great job maintaining consistency. You are becoming a new person.",
];

const QUOTES = [
  "\"We are what we repeatedly do. Excellence, then, is not an act, but a habit.\"",
  "\"Success is the sum of small efforts, repeated day in and day out.\"",
  "\"The only way to do great work is to love what you do.\"",
  "\"It does not matter how slowly you go as long as you do not stop.\"",
  "\"Your future is created by what you do today, not tomorrow.\"",
  "\"Discipline is choosing between what you want now and what you want most.\"",
];

export const generateSmartInsights = async (
  userName: string,
  habits: { name: string; goal: number; completedDates?: string[] }[]
): Promise<string> => {
  // Simulate AI "thinking" time for better UX
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (habits.length === 0) {
    return `Hey ${userName}! 👋\n\nI see you haven't started tracking any habits yet.\n\nTip: Start with one simple habit today. Even drinking a glass of water counts!\n\n"${QUOTES[0]}"`;
  }

  // 1. Analyze Data
  let totalCompleted = 0;
  let totalGoal = 0;
  let bestHabit = habits[0];
  let worstHabit = habits[0];

  habits.forEach((h) => {
    const completed = h.completedDates?.length || 0;
    totalCompleted += completed;
    totalGoal += h.goal;

    if (
      (completed / h.goal) >
      ((bestHabit.completedDates?.length || 0) / bestHabit.goal)
    ) {
      bestHabit = h;
    }

    if (
      (completed / h.goal) <
      ((worstHabit.completedDates?.length || 0) / worstHabit.goal)
    ) {
      worstHabit = h;
    }
  });

  const overallProgress = totalGoal > 0 ? (totalCompleted / totalGoal) : 0;

  // 2. Determine User State & Select Content
  let summary = "";
  let tip = "";

  if (overallProgress < 0.2) {
    summary = `You're just getting started, ${userName}. Every checkmark is a victory!`;
    tip = TIPS_BEGINNER[Math.floor(Math.random() * TIPS_BEGINNER.length)];
  } else if (overallProgress < 0.6) {
    summary = `You're making solid progress, ${userName}. Keep pushing through the resistance.`;
    tip = TIPS_STRUGGLING[Math.floor(Math.random() * TIPS_STRUGGLING.length)];
  } else {
    summary = `Amazing work, ${userName}! You are really dialing in your routine.`;
    tip = TIPS_MASTERY[Math.floor(Math.random() * TIPS_MASTERY.length)];
  }

  // Add specific habit context
  if (bestHabit && (bestHabit.completedDates?.length || 0) > 0) {
    summary += ` You're doing especially well with "${bestHabit.name}".`;
  }

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return `${summary}\n\n💡 Tip: ${tip}\n\n${quote}`;
};
