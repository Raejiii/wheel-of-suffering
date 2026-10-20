// Equipment types: each exercise needs one of these
export const EQUIPMENT = {
    bar: { label: 'Pull-up bar', icon: 'fa-grip-lines' },
    dumbbells: { label: 'Dumbbells', icon: 'fa-dumbbell' },
    body: { label: 'Bodyweight', icon: 'fa-person-running' },
}

// Rae's default wheel for home workouts with a pull-up bar and dumbbells
export const DEFAULT_EXERCISES = [
    { name: 'Pull-ups', amount: '6 reps', equipment: 'bar' },
    { name: 'Chin-ups', amount: '6 reps', equipment: 'bar' },
    { name: 'Hanging knee raises', amount: '10 reps', equipment: 'bar' },
    { name: 'Dead hang', amount: '30 sec', equipment: 'bar' },
    { name: 'Negative pull-ups', amount: '4 reps', equipment: 'bar' },
    { name: 'Goblet squats', amount: '12 reps', equipment: 'dumbbells' },
    { name: 'Dumbbell rows', amount: '10 each side', equipment: 'dumbbells' },
    { name: 'Shoulder press', amount: '10 reps', equipment: 'dumbbells' },
    { name: 'Romanian deadlifts', amount: '12 reps', equipment: 'dumbbells' },
    { name: 'Reverse lunges', amount: '10 each side', equipment: 'dumbbells' },
    { name: 'Bicep curls', amount: '12 reps', equipment: 'dumbbells' },
    { name: 'Thrusters', amount: '10 reps', equipment: 'dumbbells' },
    { name: 'Push-ups', amount: '15 reps', equipment: 'body' },
    { name: 'Burpees', amount: '10 reps', equipment: 'body' },
].map((exercise, index) => ({ ...exercise, id: `default-${index}`, enabled: true }))

// a random line shown with each spin result
export const FATE_LINES = [
    'The wheel has spoken.',
    'Natural 20. For the wheel, not for you.',
    'Roll for initiative. Then do it anyway.',
    'Your suffering has been chosen.',
    'The dungeon master shows no mercy.',
    'A critical hit to your arms.',
    'Saving throw failed. Start your set.',
    'The tavern can wait.',
]
