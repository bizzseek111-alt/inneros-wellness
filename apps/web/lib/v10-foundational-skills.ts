/**
 * WEEBLY V10 — PHASE 5: FOUNDATIONAL SKILLS LAB
 *
 * Non-Clinical Educational Skill-Practice Activities:
 * Covers Attention, Working Memory, Flexible Thinking, Response Control,
 * Planning, Sequencing, Communication, Social Problem-Solving,
 * Emotion Vocabulary, and Persistence.
 *
 * STRICT INVARIANT:
 * These are educational skill-practice activities. Weebly never claims to
 * diagnose, cure, rewire, or clinically treat a child's brain, and never
 * generates hidden ADHD/autism probability scores from gameplay.
 */

export interface FoundationalSkillActivity {
  id: string;
  title: string;
  skill_domain:
    | "Attention"
    | "Working Memory"
    | "Flexible Thinking"
    | "Response Control"
    | "Planning"
    | "Sequencing"
    | "Communication"
    | "Social Problem-Solving"
    | "Emotion Vocabulary"
    | "Persistence";
  learning_objective: string;
  age_appropriateness: string;
  instructions: string;
  completion_criteria: string;
  optional_offline_activity: string;
  accessible_controls: string[];
  rounds: Array<{
    level: "Warm-Up" | "Practice" | "Stretch";
    prompt: string;
    options: string[];
    correct_option: string;
    gentle_feedback: string;
  }>;
}

export const FOUNDATIONAL_SKILLS_ACTIVITIES: FoundationalSkillActivity[] = [
  {
    id: "freeze_and_go",
    title: "1. Freeze & Go",
    skill_domain: "Response Control",
    learning_objective: "Practice waiting for a visual/spoken signal and stopping action on cue.",
    age_appropriateness: "Ages 3–9 (Readiness-Adaptive)",
    instructions: "Watch the lantern cue! Tap GO on Green Star (🟢⭐), and tap PAUSE on Purple Moon (🟣🌙).",
    completion_criteria: "Complete 2 practice rounds at your comfortable pace.",
    optional_offline_activity: "Play 2 minutes of musical or clapping freeze dance in the living room.",
    accessible_controls: ["Shape + Color Dual Cues", "Spoken Audio Prompts", "No Penalty Timer"],
    rounds: [
      {
        level: "Warm-Up",
        prompt: "Signal: 🟢⭐ Green Star! What should we do?",
        options: ["Tap GO!", "Pause & Wait"],
        correct_option: "Tap GO!",
        gentle_feedback: "Great noticing! Green Star is our Go cue.",
      },
      {
        level: "Practice",
        prompt: "Signal: 🟣🌙 Purple Moon! What should we do?",
        options: ["Pause & Wait", "Tap GO!"],
        correct_option: "Pause & Wait",
        gentle_feedback: "Calm and steady! You paused right on the Purple Moon.",
      },
    ],
  },
  {
    id: "memory_garden",
    title: "2. Memory Garden",
    skill_domain: "Working Memory",
    learning_objective: "Hold a short sequence of garden items in mind and recall them in order.",
    age_appropriateness: "Ages 4–12",
    instructions: "Read or listen to the garden list, then pick the matching sequence!",
    completion_criteria: "Complete the recall rounds with or without hints.",
    optional_offline_activity: "Place 3 household objects on a tray, cover them with a cloth, and recall them together.",
    accessible_controls: ["Audio Repeat Button", "Visual Icons", "Self-Paced"],
    rounds: [
      {
        level: "Warm-Up",
        prompt: "Remember these 2 garden friends in order: 🌻 Sunflower → 🦋 Butterfly. Which came first?",
        options: ["🌻 Sunflower", "🦋 Butterfly"],
        correct_option: "🌻 Sunflower",
        gentle_feedback: "You remembered! Sunflower came first in the garden.",
      },
      {
        level: "Stretch",
        prompt: "Remember 3 items in order: 🌧️ Raindrop → 🌱 Sprout → 🌷 Tulip. Which was in the middle?",
        options: ["🌱 Sprout", "🌧️ Raindrop", "🌷 Tulip"],
        correct_option: "🌱 Sprout",
        gentle_feedback: "Wonderful recall! Raindrop, then Sprout, then Tulip.",
      },
    ],
  },
  {
    id: "pattern_detective",
    title: "3. Pattern Detective",
    skill_domain: "Attention",
    learning_objective: "Notice repeating visual and numeric patterns and choose what comes next.",
    age_appropriateness: "Ages 4–12",
    instructions: "Look closely at the pattern row and pick the next symbol!",
    completion_criteria: "Solve 2 pattern sequences.",
    optional_offline_activity: "Arrange forks and spoons in an ABAB pattern on the dining table.",
    accessible_controls: ["High-Contrast Symbols", "Read-Aloud Pattern"],
    rounds: [
      {
        level: "Warm-Up",
        prompt: "Pattern: 🔴 Circle, 🔷 Diamond, 🔴 Circle, 🔷 Diamond, ... What comes next?",
        options: ["🔴 Circle", "🔷 Diamond", "⭐ Star"],
        correct_option: "🔴 Circle",
        gentle_feedback: "Sharp eyes, Detective! Circle comes after Diamond.",
      },
      {
        level: "Practice",
        prompt: "Pattern: 2, 4, 6, 8, ... What number comes next?",
        options: ["10", "9", "12"],
        correct_option: "10",
        gentle_feedback: "Spot on! Counting by twos leads to 10.",
      },
    ],
  },
  {
    id: "switch_the_rule",
    title: "4. Switch the Rule",
    skill_domain: "Flexible Thinking",
    learning_objective: "Practice shifting smoothly from sorting by color to sorting by shape.",
    age_appropriateness: "Ages 5–14",
    instructions: "In Round 1 we match by COLOR. In Round 2 we switch and match by SHAPE!",
    completion_criteria: "Complete both the Color Rule and Shape Rule rounds.",
    optional_offline_activity: "Sort laundry or blocks first by color, then switch and sort by size.",
    accessible_controls: ["Explicit Transition Banner", "Spoken Rule Reminder"],
    rounds: [
      {
        level: "Warm-Up",
        prompt: "RULE 1 — Match by COLOR: Which item matches the Blue Star (🔵⭐) by COLOR?",
        options: ["🔵 Blue Boat", "🟡⭐ Yellow Star"],
        correct_option: "🔵 Blue Boat",
        gentle_feedback: "Yes! Both the Blue Star and Blue Boat share the color blue.",
      },
      {
        level: "Practice",
        prompt: "RULE SWITCH — Match by SHAPE: Now which item matches the Blue Star (🔵⭐) by SHAPE?",
        options: ["🟡⭐ Yellow Star", "🔵 Blue Boat"],
        correct_option: "🟡⭐ Yellow Star",
        gentle_feedback: "Flexible thinking! You switched smoothly from color to shape.",
      },
    ],
  },
  {
    id: "plan_my_day",
    title: "5. Plan My Day",
    skill_domain: "Planning",
    learning_objective: "Organize daily tasks into a calm 'First → Next → Then' plan.",
    age_appropriateness: "Ages 4–16",
    instructions: "Pick the most helpful order to get ready for a school or weekend project!",
    completion_criteria: "Complete a daily plan sequence.",
    optional_offline_activity: "Draw 3 sticky-note checklists for today's afternoon routine.",
    accessible_controls: ["First-Then Visual Layout", "AAC Compatible"],
    rounds: [
      {
        level: "Practice",
        prompt: "You want to paint a picture and keep your table clean. What is the best 'First' step?",
        options: [
          "First lay down paper and water cup, then start painting",
          "Paint on the table first, then look for paper",
        ],
        correct_option: "First lay down paper and water cup, then start painting",
        gentle_feedback: "Great planning! Preparing your space first makes painting smooth and fun.",
      },
    ],
  },
  {
    id: "story_sequencer",
    title: "6. Story Sequencer",
    skill_domain: "Sequencing",
    learning_objective: "Order cause-and-effect events from beginning to end.",
    age_appropriateness: "Ages 4–11",
    instructions: "Put the story steps in order from 1 to 3!",
    completion_criteria: "Complete the sequence round.",
    optional_offline_activity: "Retell how to make a sandwich or cup of lassi in 3 ordered steps.",
    accessible_controls: ["Numbered Step Badges", "Spoken Narration"],
    rounds: [
      {
        level: "Practice",
        prompt: "A seed grows into a sunflower. What is the correct order?",
        options: [
          "1. Plant seed → 2. Water sprout → 3. Tall yellow flower blooms",
          "1. Flower blooms → 2. Plant seed → 3. Water sprout",
        ],
        correct_option: "1. Plant seed → 2. Water sprout → 3. Tall yellow flower blooms",
        gentle_feedback: "You sequenced it clearly from tiny seed to blooming flower!",
      },
    ],
  },
  {
    id: "friendship_choices",
    title: "7. Friendship Choices",
    skill_domain: "Social Problem-Solving",
    learning_objective: "Practice fair turn-taking, empathy, and repairing small misunderstandings.",
    age_appropriateness: "Ages 4–14",
    instructions: "Choose the response that helps both friends feel respected and heard.",
    completion_criteria: "Complete the friendship scenario.",
    optional_offline_activity: "Practice giving a genuine compliment or sharing a game with a sibling or classmate.",
    accessible_controls: ["Bilingual Read-Aloud", "Nonjudgmental Hints"],
    rounds: [
      {
        level: "Practice",
        prompt: "You accidentally bump into a classmate's block tower and two blocks fall. What is a helpful response?",
        options: [
          "'I'm sorry! Let me help you rebuild the top part together.'",
          "Run away and pretend nothing happened",
        ],
        correct_option: "'I'm sorry! Let me help you rebuild the top part together.'",
        gentle_feedback: "Kind words and helping hands repair accidents right away.",
      },
    ],
  },
  {
    id: "puzzle_builder",
    title: "8. Puzzle Builder",
    skill_domain: "Persistence",
    learning_objective: "Try a second strategy calmly when the first puzzle piece doesn't fit.",
    age_appropriateness: "Ages 5–15",
    instructions: "Pick the missing piece and practice helpful self-talk when puzzles take two tries!",
    completion_criteria: "Complete the puzzle strategy round.",
    optional_offline_activity: "Complete a jigsaw puzzle or tangram together without rushing.",
    accessible_controls: ["Calm Self-Talk Prompts", "Untimed"],
    rounds: [
      {
        level: "Practice",
        prompt: "A puzzle piece doesn't fit on the first try. What can we say to ourselves?",
        options: [
          "'Let me rotate the piece or try a different corner!'",
          "'I can never do any puzzles ever'",
        ],
        correct_option: "'Let me rotate the piece or try a different corner!'",
        gentle_feedback: "That's persistence! Trying a new angle helps us solve tricky puzzles.",
      },
    ],
  },
  {
    id: "follow_the_steps",
    title: "9. Follow the Steps",
    skill_domain: "Communication",
    learning_objective: "Listen to or read a 2-step instruction and carry it out in order.",
    age_appropriateness: "Ages 4–12",
    instructions: "Read or listen to the 2-step instruction carefully, then pick the matching action!",
    completion_criteria: "Complete the multi-step instruction check.",
    optional_offline_activity: "Play 'Simon Says' or 'Kai Says' with 2-step movements.",
    accessible_controls: ["Replay Audio Instruction", "Visual Step Breakdown"],
    rounds: [
      {
        level: "Practice",
        prompt: "Instruction: 'First tap the Green Book (📗), then tap the Yellow Pencil (✏️).'",
        options: ["📗 Green Book → ✏️ Yellow Pencil", "✏️ Yellow Pencil → 📗 Green Book"],
        correct_option: "📗 Green Book → ✏️ Yellow Pencil",
        gentle_feedback: "Great listening! You followed Step 1 and Step 2 in exact order.",
      },
    ],
  },
  {
    id: "create_a_strategy",
    title: "10. Create a Strategy",
    skill_domain: "Emotion Vocabulary",
    learning_objective: "Name feelings accurately and choose a comforting coping strategy.",
    age_appropriateness: "Ages 4–16",
    instructions: "Match the feeling with a helpful, safe strategy!",
    completion_criteria: "Select a feeling word and strategy.",
    optional_offline_activity: "Practice 3 slow balloon breaths before homework or bedtime.",
    accessible_controls: ["Feelings Icons", "AAC Tap-to-Speak"],
    rounds: [
      {
        level: "Practice",
        prompt: "Before a big school presentation, your tummy feels fluttery ('butterflies'). What strategy helps?",
        options: [
          "Name the feeling ('I feel a little nervous and excited') and take 3 slow breaths",
          "Keep the worry bottled up alone",
        ],
        correct_option:
          "Name the feeling ('I feel a little nervous and excited') and take 3 slow breaths",
        gentle_feedback: "Naming our feelings and breathing slowly helps our body feel supported.",
      },
    ],
  },
];
