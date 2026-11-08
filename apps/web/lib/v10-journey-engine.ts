/**
 * WEEBLY V10 — UNIFIED LEARNING JOURNEY ENGINE (WATCH → LEARN → PLAY → IMPLEMENT → REFLECT)
 *
 * Pedagogical note:
 * WATCH → LEARN → PLAY → IMPLEMENT → REFLECT is a flexible, optional 5-stage sequence.
 * Learners and educators can start at any stage or skip stages when educationally appropriate.
 */

export type JourneyStageId = "watch" | "learn" | "play" | "implement" | "reflect";

export type ContentReviewStatus =
  | "Draft"
  | "Under Review"
  | "Approved"
  | "Published"
  | "Archived";

export interface WatchStageContent {
  title: string;
  format: "animated_story_slides" | "illustrated_walkthrough";
  narration_script: {
    en: string;
    ur: string;
    pa: string;
  };
  slides: Array<{
    slide_number: number;
    heading: string;
    caption: string;
    visual_cue: string;
  }>;
  accessible_transcript: string;
}

export interface LearnStageContent {
  mentor: "kai" | "mia" | "lumi" | "zayn";
  explanation: {
    en: string;
    ur: string;
    pa: string;
  };
  visual_examples: Array<{
    label: string;
    detail: string;
  }>;
  check_question: {
    prompt: string;
    options: string[];
    correct_index: number;
    encouragement: string;
  };
}

export interface PlayStageActivity {
  activity_type: "interactive_choice_puzzle" | "sequence_builder" | "pattern_matcher";
  instructions: string;
  rounds: Array<{
    id: string;
    prompt: string;
    choices: string[];
    correct_choice: string;
    hint: string;
  }>;
}

export interface ImplementStageTask {
  digital_or_physical: "both" | "digital_project" | "offline_family_or_classroom";
  title: string;
  step_by_step: string[];
  creator_tool_link?: string;
  offline_alternative: string;
}

export interface ReflectStageConfig {
  child_prompt: string;
  child_response_choices: Array<{
    id: string;
    label: string;
    emoji_or_symbol: string;
  }>;
  caregiver_teacher_observation_prompt: string;
}

export interface LearningJourney {
  journey_id: string;
  title: string;
  age_band: "2-4" | "5" | "6" | "7-9" | "10-12" | "13-15" | "16-18";
  grade: string;
  subject:
    | "Mathematics"
    | "Storytelling"
    | "Foundational Attention Practice"
    | "AI Literacy"
    | "Creative Project"
    | "Life Skills";
  learning_objective: string;
  developmental_skill: string;
  language: Array<"en" | "ur" | "pa">;
  accessibility_options: string[];
  content_license: string;
  watch_content: WatchStageContent;
  learn_content: LearnStageContent;
  play_activity: PlayStageActivity;
  implementation_task: ImplementStageTask;
  reflection: ReflectStageConfig;
  estimated_duration: string;
  required_materials: string[];
  completion_criteria: string;
  review_status: ContentReviewStatus;
  curriculum_mapping: string;
  version: string;
  world_id:
    | "learning-quest"
    | "creative-studio"
    | "sports-movement"
    | "cartoon-story-world"
    | "tech-coding-world"
    | "life-skills-feelings";
}

export const WEEBLY_V10_JOURNEYS: LearningJourney[] = [
  // 1. MATHEMATICS
  {
    journey_id: "jrn_math_fair_share_mangoes",
    title: "The Mango Basket Bridge: Equal Sharing & Division",
    age_band: "7-9",
    grade: "Grade 2–3",
    subject: "Mathematics",
    learning_objective: "Partition 12 and 15 objects equally among 3 and 4 groups using visual grouping.",
    developmental_skill: "Working memory & quantitative reasoning",
    language: ["en", "ur", "pa"],
    accessibility_options: ["Spoken Audio Narration", "Visual Counting Tokens", "AAC Quick Tap", "Reduced Motion"],
    content_license: "Weebly Original Educational Content (CC-BY-NC 4.0)",
    estimated_duration: "12 mins",
    required_materials: ["None required (Optional: 12 small pebbles, buttons, or spoons at home)"],
    completion_criteria: "Complete at least 1 interactive stage and submit child reflection.",
    review_status: "Published",
    curriculum_mapping: "PCTB Grade 2–3 Mathematics SLO: Equal Grouping & Division Readiness",
    version: "v10.0.0",
    world_id: "learning-quest",
    watch_content: {
      title: "How Three Friends Shared Twelve Multan Mangoes",
      format: "animated_story_slides",
      narration_script: {
        en: "Kai and his two friends found a basket of twelve sweet mangoes. Let's watch how they deal one mango at a time into three baskets so everyone gets an equal share!",
        ur: "کائی اور اس کے دو دوستوں کو بارہ میٹھے آم ملے۔ آؤ دیکھیں وہ تین ٹوکریوں میں برابر آم کیسے بانٹتے ہیں!",
        pa: "کائی تے اوہدے دو دوستاں نوں باراں مٹھے امب ملے۔ آؤ ویکھیئے اوہناں نے تن ٹوکریاں وچ برابر امب کیویں ونڈے!",
      },
      slides: [
        {
          slide_number: 1,
          heading: "12 Sweet Mangoes in One Big Basket",
          caption: "Three friends want to share 12 mangoes fairly so nobody feels left out.",
          visual_cue: "🧺 12 Mangoes → 3 Friends",
        },
        {
          slide_number: 2,
          heading: "One for You, One for Me",
          caption: "Placing 1 mango in each of the 3 baskets uses 3 mangoes per round.",
          visual_cue: "Round 1: [1] [1] [1] • Round 2: [2] [2] [2]",
        },
        {
          slide_number: 3,
          heading: "Four Mangoes Each!",
          caption: "After 4 rounds, all 12 mangoes are shared equally: 12 ÷ 3 = 4.",
          visual_cue: "Basket A: 4 • Basket B: 4 • Basket C: 4",
        },
      ],
      accessible_transcript:
        "Animated slide sequence showing 12 mangoes distributed one-by-one into 3 baskets, resulting in 4 mangoes per basket (12 divided by 3 equals 4).",
    },
    learn_content: {
      mentor: "kai",
      explanation: {
        en: "Division means fair sharing! When we have a total number of items and share them equally into groups, every group gets the exact same amount.",
        ur: "تقسیم کا مطلب ہے برابر بانٹنا! جب ہم چیزوں کو برابر گروپوں میں رکھتے ہیں تو ہر حصے میں ایک جتنی تعداد آتی ہے۔",
        pa: "ونڈ دا مطلب اے برابر حصے کرنا! جدوں اسیں شیواں نوں برابر ٹولیاں وچ رکھدے آں تے ہر ٹولی وچ اکو جنے حصے آؤندے نیں۔",
      },
      visual_examples: [
        { label: "8 Apples ÷ 2 Baskets", detail: "4 apples in each basket (4 + 4 = 8)" },
        { label: "12 Mangoes ÷ 4 Friends", detail: "3 mangoes for each friend (3 + 3 + 3 + 3 = 12)" },
      ],
      check_question: {
        prompt: "If we share 10 pencils equally between 2 classmates, how many pencils does each classmate get?",
        options: ["3 pencils", "5 pencils", "8 pencils"],
        correct_index: 1,
        encouragement: "Spot on! 5 plus 5 makes 10, so each classmate receives 5 pencils.",
      },
    },
    play_activity: {
      activity_type: "interactive_choice_puzzle",
      instructions: "Help Kai pack the picnic baskets equally in each round!",
      rounds: [
        {
          id: "m_r1",
          prompt: "Share 12 mangoes equally among 4 friends. How many mangoes does each friend get?",
          choices: ["2 mangoes", "3 mangoes", "4 mangoes"],
          correct_choice: "3 mangoes",
          hint: "Try counting by 4s: 4, 8, 12!",
        },
        {
          id: "m_r2",
          prompt: "Share 15 samosas equally onto 3 plates. How many samosas go on each plate?",
          choices: ["5 samosas", "6 samosas", "3 samosas"],
          correct_choice: "5 samosas",
          hint: "3 plates × 5 samosas = 15 samosas!",
        },
      ],
    },
    implementation_task: {
      digital_or_physical: "both",
      title: "Real-World Kitchen Fair-Share Mission",
      step_by_step: [
        "Gather 12 spoons, crayons, or dry chickpeas on a table.",
        "Make 3 equal piles for 3 family members.",
        "Count how many items are in each pile and tell a parent or teacher!",
      ],
      offline_alternative: "Count plates and spoons at dinner time and divide them equally around the mat or table.",
    },
    reflection: {
      child_prompt: "How did you feel while solving the mango sharing puzzles today?",
      child_response_choices: [
        { id: "confident", label: "I figured it out!", emoji_or_symbol: "🌟" },
        { id: "practicing", label: "I liked using hints", emoji_or_symbol: "🧩" },
        { id: "more_help", label: "Let's practice again together", emoji_or_symbol: "🤝" },
      ],
      caregiver_teacher_observation_prompt:
        "Did the child count one-by-one or group items mentally during the sharing task?",
    },
  },

  // 2. STORYTELLING
  {
    journey_id: "jrn_story_brave_rickshaw_bird",
    title: "The Little Sparrow & the Colorful Rickshaw: Building a Story",
    age_band: "6",
    grade: "Grade 1–2",
    subject: "Storytelling",
    learning_objective: "Construct a 3-part narrative (Beginning, Problem, Kind Resolution) with character dialogue.",
    developmental_skill: "Expressive language, narrative sequencing & perspective-taking",
    language: ["en", "ur", "pa"],
    accessibility_options: ["Bilingual Read-Aloud", "Picture Story Cards", "AAC Choice Buttons"],
    content_license: "Weebly Original Educational Content (CC-BY-NC 4.0)",
    estimated_duration: "10 mins",
    required_materials: ["Paper and crayons (or Weebly AI Story Maker)"],
    completion_criteria: "Complete story sequencing choices and save or narrate a story ending.",
    review_status: "Published",
    curriculum_mapping: "Early Childhood & Primary Oral Language and Narrative Structure",
    version: "v10.0.0",
    world_id: "cartoon-story-world",
    watch_content: {
      title: "Chirpy the Sparrow Loses Her Nest Twig",
      format: "animated_story_slides",
      narration_script: {
        en: "Every great story has three parts: a Beginning where we meet a friend, a Middle where a tricky problem happens, and an Ending where kindness helps solve it!",
        ur: "ہر اچھی کہانی کے تین حصے ہوتے ہیں: آغاز، درمیان میں ایک چھوٹا مسئلہ، اور آخر میں محبت سے حل!",
        pa: "ہر سوہنی کہانی دے تن حصے ہوندے نیں: شروع، وچکار اک نکا مسئلہ، تے اخیر وچ پیار نال حل!",
      },
      slides: [
        {
          slide_number: 1,
          heading: "Part 1: The Beginning (Setting & Character)",
          caption: "Meet Chirpy the sparrow in a sunny courtyard in Lahore.",
          visual_cue: "🐦 Sunny Courtyard",
        },
        {
          slide_number: 2,
          heading: "Part 2: The Middle (A Tricky Moment)",
          caption: "The wind blows Chirpy's favorite twig onto the roof of a painted rickshaw!",
          visual_cue: "💨🛺 Twig on the Roof",
        },
        {
          slide_number: 3,
          heading: "Part 3: The Ending (Working Together)",
          caption: "Kind Uncle Driver lifts the twig back up so Chirpy can finish her cozy nest.",
          visual_cue: "🌿🏡 Cozy Nest Complete",
        },
      ],
      accessible_transcript:
        "Three-part illustrated story showing Beginning (meeting Chirpy), Middle (wind blows twig onto rickshaw), and Ending (driver helps return the twig).",
    },
    learn_content: {
      mentor: "mia",
      explanation: {
        en: "When we invent a story, we ask three magic questions: Who is our character? What problem do they face? How do they solve it kindly?",
        ur: "کہانی بناتے وقت ہم تین سوال پوچھتے ہیں: ہمارا کردار کون ہے؟ اسے کیا مشکل پیش آئی؟ اور مسئلہ کیسے حل ہوا؟",
        pa: "کہانی بناندے ویلے اسیں تن سوال پچھدے آں: ساڈا کردار کون اے؟ اوہنوں کیہڑی اوکھ آئی؟ تے گل کیویں بنی؟",
      },
      visual_examples: [
        { label: "Beginning", detail: "Introduce who and where (e.g., A curious cat in a garden)" },
        { label: "Middle & Ending", detail: "A lost ball is found by asking a friend for help" },
      ],
      check_question: {
        prompt: "Which part of a story introduces our main character and where they live?",
        options: ["The Beginning", "The Middle", "The Credits"],
        correct_index: 0,
        encouragement: "Wonderful! The Beginning welcomes readers into our character's world.",
      },
    },
    play_activity: {
      activity_type: "sequence_builder",
      instructions: "Pick the best next scene to build a kind, exciting adventure!",
      rounds: [
        {
          id: "s_r1",
          prompt: "Two friends both want to ride the blue bicycle first. What is a kind story ending?",
          choices: [
            "They take turns using a 5-minute timer",
            "They hide the bicycle so nobody rides",
            "They argue all afternoon",
          ],
          correct_choice: "They take turns using a 5-minute timer",
          hint: "Which choice lets both friends enjoy riding fairly?",
        },
        {
          id: "s_r2",
          prompt: "A little kitten is afraid of thunder. How can Mia help in the middle of the story?",
          choices: [
            "Sing a soft song and wrap a warm blanket",
            "Make louder noises",
            "Leave the kitten outside",
          ],
          correct_choice: "Sing a soft song and wrap a warm blanket",
          hint: "Think about what helps someone feel safe and calm.",
        },
      ],
    },
    implementation_task: {
      digital_or_physical: "both",
      title: "Create Your Own Illustrated Story in AI Story Maker",
      step_by_step: [
        "Open the Weebly AI Story Maker tool (or fold a sheet of paper into 3 boxes).",
        "Pick your hero, setting, and a friendly goal.",
        "Save your story to your private Skills & Creations Passport!",
      ],
      creator_tool_link: "/youth/creator?tool=story_maker",
      offline_alternative: "Tell a 3-sentence bedtime story aloud to a parent or sibling tonight.",
    },
    reflection: {
      child_prompt: "What was your favorite part of storytelling today?",
      child_response_choices: [
        { id: "characters", label: "Picking the characters", emoji_or_symbol: "🦊" },
        { id: "ending", label: "Choosing a kind ending", emoji_or_symbol: "💖" },
        { id: "listening", label: "Listening to the voice story", emoji_or_symbol: "🎧" },
      ],
      caregiver_teacher_observation_prompt:
        "Record any new vocabulary words or creative ideas the child shared aloud.",
    },
  },

  // 3. FOUNDATIONAL ATTENTION PRACTICE
  {
    journey_id: "jrn_attention_lantern_freeze_go",
    title: "Lantern Freeze & Go: Mindful Attention & Impulse Control",
    age_band: "5",
    grade: "Early Years / KG–Grade 1",
    subject: "Foundational Attention Practice",
    learning_objective: "Practice stopping, waiting for a cue, and shifting attention when rules change.",
    developmental_skill: "Focused attention, response inhibition & flexible thinking (non-clinical practice)",
    language: ["en", "ur", "pa"],
    accessibility_options: ["Low-Stimulation Palette", "Audio + Shape Cues (Not Color Alone)", "Self-Paced Timer"],
    content_license: "Weebly Original Educational Content (CC-BY-NC 4.0)",
    estimated_duration: "8 mins",
    required_materials: ["Clear floor space for standing and freezing"],
    completion_criteria: "Complete the Watch, Learn, or Play attention rounds at your own comfortable pace.",
    review_status: "Published",
    curriculum_mapping: "Early Childhood Executive Function & Self-Regulation Foundations",
    version: "v10.0.0",
    world_id: "sports-movement",
    watch_content: {
      title: "How Lumi's Lantern Helps Us Pause and Listen",
      format: "illustrated_walkthrough",
      narration_script: {
        en: "When Lumi shows the Green Circle Star, we wiggle and march! When Lumi shows the Purple Hexagon Moon, we freeze like a calm statue and take one slow breath.",
        ur: "جب لومی سبز ستارہ دکھائے تو ہم حرکت کرتے ہیں، اور جب جامنی چاند آئے تو ہم پرسکون مجسمے کی طرح رک جاتے ہیں!",
        pa: "جدوں لومی ہرا تارا وکھائے تے اسیں ہلدے آں، تے جدوں جامنی چن آوے تے اسیں رک کے اک لمبا ساہ لیندے آں!",
      },
      slides: [
        {
          slide_number: 1,
          heading: "Look & Listen for the Cue",
          caption: "Our eyes and ears work like detectives watching for the signal.",
          visual_cue: "👀👂 Notice the Signal",
        },
        {
          slide_number: 2,
          heading: "Green Star = Move Gently",
          caption: "Tap or march when you see the Star icon.",
          visual_cue: "🟢⭐ GO!",
        },
        {
          slide_number: 3,
          heading: "Purple Moon = Freeze & Breathe",
          caption: "Pause your hands and take a slow belly breath when the Moon appears.",
          visual_cue: "🟣🌙 FREEZE!",
        },
      ],
      accessible_transcript:
        "Walkthrough explaining dual shape-and-color signals: Green Star means Go, Purple Moon means Freeze and take a slow breath.",
    },
    learn_content: {
      mentor: "lumi",
      explanation: {
        en: "Pausing before we tap helps our brain notice details! Even if we tap too fast by mistake, we just smile, take a breath, and try the next turn.",
        ur: "کام کرنے سے پہلے ایک لمحہ رک کر دیکھنے سے ہماری توجہ مضبوط ہوتی ہے!",
        pa: "کجھ کرن توں پہلے اک پل رک کے ویکھن نال ساڈا دھیان پکا ہوندا اے!",
      },
      visual_examples: [
        { label: "Rule 1 (Normal Mode)", detail: "Green Star = Tap Go • Purple Moon = Wait" },
        { label: "Rule 2 (Switch Mode)", detail: "When we play 'Opposite Day', Purple Moon means Go!" },
      ],
      check_question: {
        prompt: "What do we do when we see the Purple Moon in Normal Mode?",
        options: ["Freeze and take one slow breath", "Tap as fast as possible", "Close the app"],
        correct_index: 0,
        encouragement: "Yes! Freezing like a calm statue gives us time to think.",
      },
    },
    play_activity: {
      activity_type: "pattern_matcher",
      instructions: "Follow the signal rule for each round!",
      rounds: [
        {
          id: "a_r1",
          prompt: "Signal shown: 🟢⭐ Green Star (Normal Rule). What is your move?",
          choices: ["Tap GO!", "Freeze & Wait"],
          correct_choice: "Tap GO!",
          hint: "Green Star is our Go signal!",
        },
        {
          id: "a_r2",
          prompt: "Signal shown: 🟣🌙 Purple Moon (Normal Rule). What is your move?",
          choices: ["Freeze & Wait", "Tap GO!"],
          correct_choice: "Freeze & Wait",
          hint: "Purple Moon means pause like a calm statue.",
        },
      ],
    },
    implementation_task: {
      digital_or_physical: "both",
      title: "Play Living-Room Freeze Dance or Open Foundational Skills Lab",
      step_by_step: [
        "Open the Freeze & Go game in the Foundational Skills Lab, OR",
        "Play Clapping Freeze with a parent: clap while they hum, and freeze when they stop humming!",
      ],
      creator_tool_link: "/youth/skills-lab?skill=freeze_and_go",
      offline_alternative: "Play a 2-minute statue freeze game in the courtyard or classroom.",
    },
    reflection: {
      child_prompt: "How did your body feel after practicing Freeze & Go?",
      child_response_choices: [
        { id: "calm", label: "Calm and steady", emoji_or_symbol: "🌿" },
        { id: "energized", label: "Happy and awake", emoji_or_symbol: "⚡" },
        { id: "ready_break", label: "Ready for a water break", emoji_or_symbol: "💧" },
      ],
      caregiver_teacher_observation_prompt:
        "Note which sensory pace (slow vs. standard) was most comfortable for the child.",
    },
  },

  // 4. AI LITERACY
  {
    journey_id: "jrn_ai_literacy_what_is_ai",
    title: "Young AI Inventors & Detectives: How Computers Learn From Patterns",
    age_band: "7-9",
    grade: "Grade 2–5",
    subject: "AI Literacy",
    learning_objective: "Distinguish human feelings from computer pattern-matching and spot when AI makes a mistake.",
    developmental_skill: "Critical thinking, digital safety & algorithmic literacy",
    language: ["en", "ur", "pa"],
    accessibility_options: ["Spoken Explanations", "Visual Comparison Cards", "Dyslexia-Friendly Typography"],
    content_license: "Weebly Original Educational Content (Aligned with UNESCO AI Competency Concepts)",
    estimated_duration: "12 mins",
    required_materials: ["None required"],
    completion_criteria: "Complete the AI Detective check and test a rule in AI Creator Academy.",
    review_status: "Published",
    curriculum_mapping: "Age-Based AI Learning Pathway: Understand • Apply • Create",
    version: "v10.0.0",
    world_id: "tech-coding-world",
    watch_content: {
      title: "Is Zayn a Real Person or a Helpful Computer Program?",
      format: "illustrated_walkthrough",
      narration_script: {
        en: "Hi, I'm Zayn! I can talk and help you learn, but I don't have a real heart or eat breakfast. Humans built me using computer code and examples called data!",
        ur: "سلام، میں زین ہوں! میں آپ کے ساتھ بات کر سکتا ہوں، لیکن میں انسان نہیں بلکہ کمپیوٹر پروگرام ہوں جو پیٹرن سے سیکھتا ہے!",
        pa: "سلام، میں زین آں! میں تہاڈے نال گل کر سکدا آں پر میں انسان نئیں، سگوں اک کمپیوٹر پروگرام آں!",
      },
      slides: [
        {
          slide_number: 1,
          heading: "What AI Is",
          caption: "AI is a computer tool trained on many examples to notice patterns and follow instructions.",
          visual_cue: "🤖 Pattern Helper",
        },
        {
          slide_number: 2,
          heading: "What AI Is Not",
          caption: "AI is not a real human friend, doctor, or parent—and sometimes it guesses wrong!",
          visual_cue: "🔍 Always Double-Check",
        },
        {
          slide_number: 3,
          heading: "Keep Private Info Safe",
          caption: "Never share your home address, school password, or family secrets with any AI tool.",
          visual_cue: "🛡️ Privacy Shield",
        },
      ],
      accessible_transcript:
        "Three-slide guide explaining what AI is (a computer pattern tool), what AI is not (not a human, can make mistakes), and how to protect personal privacy.",
    },
    learn_content: {
      mentor: "zayn",
      explanation: {
        en: "Sometimes an AI invents a silly answer that sounds real—scientists call this an 'AI hallucination' or mistake. That's why an AI Detective always checks trusted books, teachers, and parents!",
        ur: "کبھی کبھی اے آئی غلط جواب بھی دے سکتا ہے۔ اس لیے ہمیشہ اپنے والدین، اساتذہ اور کتابوں سے تصدیق کریں!",
        pa: "کدی کدی اے آئی غلط جواب وی دے سکدا اے۔ ایس لئی ہمیشہ اپنے ماں پیو تے استاد کولوں پکا کرو!",
      },
      visual_examples: [
        { label: "AI Fact Check", detail: "If AI says 'Elephants can fly with their ears', we check a science book!" },
        { label: "Privacy Rule", detail: "Share your favorite dinosaur, NOT your home street address." },
      ],
      check_question: {
        prompt: "If an AI companion tells you a surprising fact that sounds strange, what should an AI Detective do?",
        options: [
          "Check with a trusted adult, teacher, or reliable book",
          "Believe everything computers say automatically",
          "Share your password with the computer",
        ],
        correct_index: 0,
        encouragement: "Bravo, Detective! Checking sources with trusted adults keeps us smart and safe.",
      },
    },
    play_activity: {
      activity_type: "interactive_choice_puzzle",
      instructions: "Spot the AI mistake or privacy rule in each detective case!",
      rounds: [
        {
          id: "ai_r1",
          prompt: "Case 1: A computer bot claims 'The sun is made of frozen mango ice cream.' Is this true or an AI mistake?",
          choices: ["AI Mistake (Hallucination)", "100% True Science Fact"],
          correct_choice: "AI Mistake (Hallucination)",
          hint: "Is the sun cold or blazing hot?",
        },
        {
          id: "ai_r2",
          prompt: "Case 2: Which of these is safe to type into a creative story generator?",
          choices: [
            "A story about a friendly robot in space",
            "My real home address and phone number",
          ],
          correct_choice: "A story about a friendly robot in space",
          hint: "Keep personal family contact details private!",
        },
      ],
    },
    implementation_task: {
      digital_or_physical: "digital_project",
      title: "Build a Visual Block Game in AI Creator Academy",
      step_by_step: [
        "Open the AI Game Maker or AI Detective lab in AI Creator Academy.",
        "Snap visual blocks ('When Tapped', 'Move', 'If Touching Star → Score +1') to see how computers follow exact rules.",
        "Test your game and save it to your Passport!",
      ],
      creator_tool_link: "/youth/creator?tool=game_maker",
      offline_alternative: "Play 'Robot Programmer' at home: give a family member exact step-by-step instructions to walk to a chair.",
    },
    reflection: {
      child_prompt: "What is the most important rule you learned as an AI Detective?",
      child_response_choices: [
        { id: "check_facts", label: "AI can make mistakes—always check!", emoji_or_symbol: "🕵️" },
        { id: "privacy", label: "Keep private info safe", emoji_or_symbol: "🔒" },
        { id: "instructions", label: "Computers follow step-by-step blocks", emoji_or_symbol: "🧱" },
      ],
      caregiver_teacher_observation_prompt:
        "Did the learner explain in their own words why AI is a computer tool rather than a person?",
    },
  },

  // 5. CREATIVE PROJECT
  {
    journey_id: "jrn_creative_kindness_cartoon",
    title: "Kindness Storyboard & Art Studio: Designing Characters & Scenes",
    age_band: "6",
    grade: "Grade 1–3",
    subject: "Creative Project",
    learning_objective: "Design an original character and 3-scene storyboard expressing empathy and cooperation.",
    developmental_skill: "Visual composition, creative agency & expressive communication",
    language: ["en", "ur", "pa"],
    accessibility_options: ["Large Color Swatches", "Touch & Keyboard Drawing", "Voice Narration"],
    content_license: "Weebly Original Educational Content (CC-BY-NC 4.0)",
    estimated_duration: "15 mins",
    required_materials: ["Touchscreen, mouse, or paper sketchbook"],
    completion_criteria: "Create and save a scene in Cartoon Studio or Art Lab.",
    review_status: "Published",
    curriculum_mapping: "Visual Arts & Creative Expression — Human Creativity First",
    version: "v10.0.0",
    world_id: "creative-studio",
    watch_content: {
      title: "How Animators Turn Simple Shapes into Expressive Characters",
      format: "illustrated_walkthrough",
      narration_script: {
        en: "Every cartoon starts with your own imagination! A circle, a triangle, and two expressive eyebrows can show whether a character feels curious, excited, or calm.",
        ur: "ہر کارٹون آپ کے اپنے تخیل سے شروع ہوتا ہے! سادہ اشکال اور رنگوں سے آپ اپنے کردار بنا سکتے ہیں۔",
        pa: "ہر کارٹون تہاڈے اپنے خیال توں شروع ہوندا اے! سادہ شکلاں تے رنگاں نال تسیں اپنے کردار بنا سکدے او۔",
      },
      slides: [
        {
          slide_number: 1,
          heading: "Step 1: Pick Your Background Scene",
          caption: "Choose a sunny park, a starry sky, or a classroom stage.",
          visual_cue: "🏞️ Scene Stage",
        },
        {
          slide_number: 2,
          heading: "Step 2: Place Characters & Speech Bubbles",
          caption: "Add characters and write or record what they say to each other.",
          visual_cue: "💬 Dialogue & Action",
        },
        {
          slide_number: 3,
          heading: "Step 3: Play Back Your Cartoon!",
          caption: "Watch your scenes transition in order and save them to your private gallery.",
          visual_cue: "🎬 Playback Timeline",
        },
      ],
      accessible_transcript:
        "Guide showing how to pick a background scene, add characters with speech bubbles, and play back a 3-scene cartoon timeline.",
    },
    learn_content: {
      mentor: "mia",
      explanation: {
        en: "In Weebly, your human creativity always comes first! AI can suggest a fun prompt if you get stuck, but YOU are the director who chooses the colors, scenes, and words.",
        ur: "ویبلی میں آپ کی اپنی تخلیقی صلاحیت سب سے پہلے ہے! آپ خود اپنے کارٹون کے ڈائریکٹر ہیں۔",
        pa: "ویبلی وچ تہاڈی اپنی سوچ سب توں پہلے اے! تسیں آپ اپنے کارٹون دے ڈائریکٹر او۔",
      },
      visual_examples: [
        { label: "Warm Colors (Amber, Coral)", detail: "Great for sunny mornings, energy, and celebration scenes" },
        { label: "Cool Colors (Sky, Mint, Lavender)", detail: "Great for calm night skies, ocean adventures, and quiet talks" },
      ],
      check_question: {
        prompt: "Who is the real artist and director when you use Weebly Creative Studio?",
        options: ["You (the child creator)!", "Only the computer", "Nobody"],
        correct_index: 0,
        encouragement: "Exactly! Tools help us build, but the imagination belongs to you.",
      },
    },
    play_activity: {
      activity_type: "sequence_builder",
      instructions: "Choose the storyboard elements to complete a 2-scene friendship cartoon!",
      rounds: [
        {
          id: "c_r1",
          prompt: "Scene 1: Kai arrives at the park with a kite, but there is no wind. What should Scene 2 show?",
          choices: [
            "Mia and Kai run together to launch the kite into the breeze",
            "Kai throws the kite in the trash",
          ],
          correct_choice: "Mia and Kai run together to launch the kite into the breeze",
          hint: "Teamwork helps the kite catch the air!",
        },
      ],
    },
    implementation_task: {
      digital_or_physical: "both",
      title: "Build a 3-Scene Cartoon or Art Piece",
      step_by_step: [
        "Open Cartoon Studio or Art Lab inside AI Creator Academy.",
        "Add 3 scenes with characters, backgrounds, and dialogue.",
        "Press Play to preview your animation and save it to your Passport!",
      ],
      creator_tool_link: "/youth/creator?tool=cartoon_studio",
      offline_alternative: "Draw a 3-panel comic strip on paper and show it to your family.",
    },
    reflection: {
      child_prompt: "What did you enjoy creating most today?",
      child_response_choices: [
        { id: "cartoon", label: "Making characters talk in scenes", emoji_or_symbol: "🎬" },
        { id: "drawing", label: "Painting with colors and brushes", emoji_or_symbol: "🎨" },
        { id: "both", label: "Combining drawing and stories", emoji_or_symbol: "✨" },
      ],
      caregiver_teacher_observation_prompt:
        "Note the themes or feelings the child expressed through their artwork or storyboard.",
    },
  },

  // 6. LIFE SKILLS
  {
    journey_id: "jrn_life_calm_morning_routine",
    title: "My Calm Morning & Helping Hands: Planning & Feelings",
    age_band: "5",
    grade: "Early Years / Grade 1–2",
    subject: "Life Skills",
    learning_objective: "Sequence a 4-step daily routine and practice naming feelings and asking for help.",
    developmental_skill: "Daily independence, sequencing, emotional vocabulary & help-seeking",
    language: ["en", "ur", "pa"],
    accessibility_options: ["First-Then Visual Cards", "AAC Tap-to-Speak", "Gentle Somatic Breathing Guide"],
    content_license: "Weebly Original Educational Content (CC-BY-NC 4.0)",
    estimated_duration: "10 mins",
    required_materials: ["None required"],
    completion_criteria: "Complete the morning sequence and practice one calm breath or help phrase.",
    review_status: "Published",
    curriculum_mapping: "CASEL Self-Management & UNICEF Everyday Life Skills Alignment",
    version: "v10.0.0",
    world_id: "life-skills-feelings",
    watch_content: {
      title: "First We Get Ready, Then We Play!",
      format: "illustrated_walkthrough",
      narration_script: {
        en: "Having a visual plan makes mornings peaceful! First we brush our teeth and get dressed, then we eat breakfast, and then we are ready to learn and play.",
        ur: "تصویری شیڈول سے صبح کا وقت بہت پرسکون ہو جاتا ہے! پہلے دانت صاف کریں، ناشتہ کریں اور پھر سیکھنے کے لیے تیار!",
        pa: "تصویراں والے شیڈول نال سویر دا ویلا بڑا سوکھا ہو جاندا اے! پہلے دند صاف کرو، ناشتہ کرو تے فیر کھیڈن لئی تیار!",
      },
      slides: [
        {
          slide_number: 1,
          heading: "Step 1: Wash Up & Brush Teeth",
          caption: "Refreshing water wakes up our face and smile.",
          visual_cue: "🪥 Wash & Brush",
        },
        {
          slide_number: 2,
          heading: "Step 2: Get Dressed & Pack Bag",
          caption: "Put shoes and schoolbook in their spot.",
          visual_cue: "🎒 Ready to Go",
        },
        {
          slide_number: 3,
          heading: "Step 3: Ask for Help Whenever Needed",
          caption: "If a button or shoelace feels tricky, say: 'Can you help me show how?'",
          visual_cue: "🗣️ Ask a Trusted Adult",
        },
      ],
      accessible_transcript:
        "Three-step visual routine walkthrough covering washing up, packing a bag, and using calm words to ask a trusted adult for help.",
    },
    learn_content: {
      mentor: "lumi",
      explanation: {
        en: "Everyone feels frustrated sometimes when a task is tricky. Naming how we feel—like saying 'I feel stuck, may I have help please?'—turns a big worry into a team solution!",
        ur: "جب کوئی کام مشکل لگے تو پریشان ہونے کے بجائے آرام سے کہیں: 'مجھے تھوڑی مدد چاہیے۔'",
        pa: "جدوں کوئی کم اوکھا لگے تے گھبران دی بجائے پیار نال آکھو: 'مینوں تھوڑی مدد چاہیدی اے۔'",
      },
      visual_examples: [
        { label: "First → Then", detail: "FIRST put toys in basket → THEN listen to a story" },
        { label: "Calm Help Phrase", detail: "'I tried twice, can we do the next step together?'" },
      ],
      check_question: {
        prompt: "If your shoelace gets tangled in a knot, what is a helpful thing to do?",
        options: [
          "Take one slow breath and ask a parent or teacher for help",
          "Throw the shoe across the room",
          "Give up on going outside forever",
        ],
        correct_index: 0,
        encouragement: "Wonderful! A slow breath and asking for help solves tricky knots together.",
      },
    },
    play_activity: {
      activity_type: "sequence_builder",
      instructions: "Put the daily routine steps in a helpful order!",
      rounds: [
        {
          id: "l_r1",
          prompt: "Before bedtime story time, what is a helpful 'First' step?",
          choices: [
            "Brush teeth and put on pajamas",
            "Eat spicy snacks in bed",
          ],
          correct_choice: "Brush teeth and put on pajamas",
          hint: "Clean teeth and cozy pajamas help us rest!",
        },
      ],
    },
    implementation_task: {
      digital_or_physical: "both",
      title: "Build Your Own Visual Plan in Foundational Skills Lab",
      step_by_step: [
        "Open 'Plan My Day' in the Foundational Skills Lab or `/youth/routines`.",
        "Pick 3 routine cards for today and check them off as you finish them!",
      ],
      creator_tool_link: "/youth/skills-lab?skill=plan_my_day",
      offline_alternative: "Choose one small household helper job today—like putting books neatly on a shelf.",
    },
    reflection: {
      child_prompt: "Which helper skill did you practice today?",
      child_response_choices: [
        { id: "routine", label: "Following my visual steps", emoji_or_symbol: "📋" },
        { id: "breathing", label: "Taking slow balloon breaths", emoji_or_symbol: "🎈" },
        { id: "asking_help", label: "Using kind words to ask for help", emoji_or_symbol: "💬" },
      ],
      caregiver_teacher_observation_prompt:
        "Note how visual 'First → Then' prompts supported transitions today.",
    },
  },
];

export function getJourneyById(journeyId: string): LearningJourney | undefined {
  return WEEBLY_V10_JOURNEYS.find((j) => j.journey_id === journeyId);
}
