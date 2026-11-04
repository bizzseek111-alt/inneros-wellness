"""Specialist-Approved Curriculum & Content Data for Educational Support Center.

STRICT NON-CLINICAL SAFEGUARDS:
1. No ADHD/autism probability scores or medical labeling.
2. Stimming and harmless self-regulation behaviors are respected, NEVER suppressed.
3. Eye-contact is never forced or rewarded over genuine communication.
4. Progress is reported strictly as educational skills demonstrated, never behavioral compliance or diagnosis.
"""

from typing import List
from app.domains.educational_support.schemas import (
    TaskBreakdown,
    MicroStep,
    AACSymbol,
    ClassroomAccommodation,
    CognitiveGameItem,
    CaregiverGuidanceArticle,
    SpecialInterestCategory,
)

# ---------------------------------------------------------------------------
# MODULE A: ADHD-Friendly Task Breakdowns (Visual Schedules & Micro-Steps)
# ---------------------------------------------------------------------------
CURATED_TASK_BREAKDOWNS: List[TaskBreakdown] = [
    TaskBreakdown(
        id="task_morning_launch",
        task_name="Calm Morning Launch",
        category="morning",
        estimated_minutes=15,
        micro_steps=[
            MicroStep(
                id="ms_m1",
                step_number=1,
                title="Wiggle toes and stretch arms like a sleepy bear",
                title_ur="پاؤں کی انگلیاں ہلائیں اور بازو اوپر کر کے انگڑائی لیں",
                title_pa="پیراں دیاں انگلیاں ہلاؤ تے بازو اتے کر کے انگڑائی لئو",
                visual_icon="🐻",
            ),
            MicroStep(
                id="ms_m2",
                step_number=2,
                title="Take 3 sips of cool water",
                title_ur="ٹھنڈے پانی کے ۳ گھونٹ پییں",
                title_pa="ٹھنڈے پانی دے ۳ گھٹ پیئو",
                visual_icon="💧",
            ),
            MicroStep(
                id="ms_m3",
                step_number=3,
                title="Put shoes and backpack by the front door",
                title_ur="جوتے اور بستہ دروازے کے پاس رکھیں",
                title_pa="جوتے تے بستہ بوہے اگے رکھو",
                visual_icon="🎒",
            ),
            MicroStep(
                id="ms_m4",
                step_number=4,
                title="Give your trusted adult a high-five or gentle nod",
                title_ur="امی یا ابو کو ہاتھ ملائیں یا سر ہلا کر مسکرائیں",
                title_pa="امی یا ابو نوں ہتھ ملاؤ یا سر ہلا کے ہنسو",
                visual_icon="✋",
            ),
        ],
    ),
    TaskBreakdown(
        id="task_homework_sprint",
        task_name="Homework 10-Minute Focus Sprint",
        category="homework",
        estimated_minutes=10,
        micro_steps=[
            MicroStep(
                id="ms_h1",
                step_number=1,
                title="Clear the desk so only ONE notebook is open",
                title_ur="میز صاف کریں تاکہ صرف ایک کاپی سامنے ہو",
                title_pa="میز صاف کرو تاں جے صرف اک کاپی سامنے ہووے",
                visual_icon="📖",
            ),
            MicroStep(
                id="ms_h2",
                step_number=2,
                title="Start the 10-minute visual disc timer",
                title_ur="۱۰ منٹ کا بصری ڈسک ٹائمر شروع کریں",
                title_pa="۱۰ منٹ دا ٹائمر شروع کرو",
                visual_icon="⏳",
            ),
            MicroStep(
                id="ms_h3",
                step_number=3,
                title="Complete first 3 problems or read first 2 paragraphs",
                title_ur="پہلے ۳ سوال حل کریں یا ۲ پیراگراف پڑھیں",
                title_pa="پہلے ۳ سوال کرو یا ۲ پیراگراف پڑھو",
                visual_icon="✏️",
            ),
            MicroStep(
                id="ms_h4",
                step_number=4,
                title="2-Minute Brain Break: Drink water, wiggle shoulders, shake hands",
                title_ur="۲ منٹ کا دماغی وقفہ: پانی پییں اور ہاتھ جھٹکیں",
                title_pa="۲ منٹ دا وقفہ: پانی پیئو تے ہتھ ہلائو",
                visual_icon="🧘",
            ),
        ],
    ),
]

# ---------------------------------------------------------------------------
# MODULE A: Classroom Accommodation Suggestions (For Teachers & IEPs)
# ---------------------------------------------------------------------------
CLASSROOM_ACCOMMODATIONS: List[ClassroomAccommodation] = [
    ClassroomAccommodation(
        id="acc_fidget_sensory",
        area="sensory_regulation",
        title="Quiet Fidget & Movement Tool Policy",
        description="Allows quiet sensory items (kneaded putty, textured strips under desk, wobble cushions) during seated instruction.",
        classroom_strategy="Designate a 'Sensory Corner' and allow subtle hand fidgets without requiring the child to be completely motionless.",
        why_it_helps="Proprioceptive input helps ADHD and sensory-seeking nervous systems regulate arousal and maintain active listening without shame.",
        printable_iep_note="Student is permitted to utilize quiet, non-disruptive tactile fidget tools during direct instruction and independent seatwork.",
    ),
    ClassroomAccommodation(
        id="acc_chunked_tasks",
        area="executive_function",
        title="Chunked Assignment Delivery (Step-by-Step Checklists)",
        description="Breaking multi-step worksheets into 2–3 visual segments rather than presenting a full page of 20 tasks simultaneously.",
        classroom_strategy="Provide a fold-over sheet or index card checklist so only the current task is visually prominent.",
        why_it_helps="Reduces cognitive overwhelm, visual crowding, and working memory fatigue.",
        printable_iep_note="Multi-step assignments will be segmented into 2-step chunks with visual check-boxes to support working memory.",
    ),
    ClassroomAccommodation(
        id="acc_transition_warning",
        area="attention_focus",
        title="2-Minute Transition Advance Warning",
        description="Providing a predictable 2-minute visual or verbal heads-up before changing from high-interest activities to academic tasks.",
        classroom_strategy="Use a visual countdown sand timer or gentle chime. Say: 'In 2 minutes, we are closing math books and putting on jackets.'",
        why_it_helps="Prevents abrupt set-shifting distress and autonomic fight-or-flight reactions to unexpected transitions.",
        printable_iep_note="Student will receive an individualized 2-minute advance auditory/visual warning prior to major classroom activity transitions.",
    ),
]

# ---------------------------------------------------------------------------
# MODULE B: Autism-Friendly Picture AAC Communication Symbols
# ---------------------------------------------------------------------------
AAC_SYMBOLS: List[AACSymbol] = [
    # Sensory
    AACSymbol(
        id="aac_s1",
        category="sensory",
        symbol_glyph="🎧",
        label_en="Too Loud",
        label_ur="بہت شور ہے",
        label_pa="بڑا شور اے",
        speech_phrase_en="It is too loud here. I need quiet headphones or a calm space.",
        speech_phrase_ur="یہاں بہت شور ہے۔ مجھے ہیڈفون یا پرسکون جگہ چاہیے۔",
        speech_phrase_pa="ایتھے بڑا شور اے۔ مینوں ہیڈ فون چاہیدے نیں۔",
        color_border="border-sky-300 bg-sky-50",
    ),
    AACSymbol(
        id="aac_s2",
        category="sensory",
        symbol_glyph="🛑",
        label_en="Need Break",
        label_ur="وقفہ چاہیے",
        label_pa="وقفہ چاہیدا اے",
        speech_phrase_en="I need a 5-minute quiet break to reset my senses.",
        speech_phrase_ur="مجھے اپنے حواس سنبھالنے کے لیے ۵ منٹ کا پرسکون وقفہ چاہیے۔",
        speech_phrase_pa="مینوں ۵ منٹ دا پرسکون وقفہ چاہیدا اے۔",
        color_border="border-rose-300 bg-rose-50",
    ),
    # Physical Need
    AACSymbol(
        id="aac_p1",
        category="physical_need",
        symbol_glyph="💧",
        label_en="Drink Water",
        label_ur="پانی پینا ہے",
        label_pa="پانی پینا اے",
        speech_phrase_en="I am thirsty. I would like a drink of water please.",
        speech_phrase_ur="مجھے پیاس لگی ہے۔ مجھے پانی پینا ہے۔",
        speech_phrase_pa="مینوں پیاس لگی اے۔ مینوں پانی پینا اے۔",
        color_border="border-emerald-300 bg-emerald-50",
    ),
    AACSymbol(
        id="aac_p2",
        category="physical_need",
        symbol_glyph="🚻",
        label_en="Bathroom",
        label_ur="واش روم",
        label_pa="واش روم",
        speech_phrase_en="I need to use the restroom please.",
        speech_phrase_ur="مجھے واش روم جانا ہے۔",
        speech_phrase_pa="مینوں واش روم جانا اے۔",
        color_border="border-amber-300 bg-amber-50",
    ),
    # Emotions
    AACSymbol(
        id="aac_e1",
        category="emotions",
        symbol_glyph="🌧️",
        label_en="Overwhelmed",
        label_ur="گھبراہٹ ہے",
        label_pa="گھبراہٹ اے",
        speech_phrase_en="My nervous system feels overwhelmed. Please give me gentle space.",
        speech_phrase_ur="مجھے گھبراہٹ ہو رہی ہے۔ برائے مہربانی مجھے پرسکون وقت دیں۔",
        speech_phrase_pa="مینوں گھبراہٹ ہو رہی اے۔ مینوں ہولی لاما لیند دیو۔",
        color_border="border-purple-300 bg-purple-50",
    ),
    AACSymbol(
        id="aac_e2",
        category="emotions",
        symbol_glyph="☀️",
        label_en="Happy & Ready",
        label_ur="خوش اور تیار",
        label_pa="خوش تے تیار",
        speech_phrase_en="I feel calm and happy right now. I am ready to explore.",
        speech_phrase_ur="میں اس وقت پرسکون اور خوش ہوں اور کھیلنے کے لیے تیار ہوں۔",
        speech_phrase_pa="میں اس ویلے راضی آں تے کجھ نواں سکھن لئی تیار آں۔",
        color_border="border-yellow-300 bg-yellow-50",
    ),
    # Social Boundaries (No forced eye contact or masking)
    AACSymbol(
        id="aac_b1",
        category="social_boundaries",
        symbol_glyph="🖐️",
        label_en="Not Right Now",
        label_ur="ابھی نہیں",
        label_pa="حالے نئیں",
        speech_phrase_en="I choose not to do this activity right now. I need space.",
        speech_phrase_ur="میں ابھی یہ کام نہیں کرنا چاہتا۔ مجھے وقت دیں۔",
        speech_phrase_pa="میں حالے ایہہ کم نئیں کرنا۔ مینوں ویلا دیو۔",
        color_border="border-indigo-300 bg-indigo-50",
    ),
    AACSymbol(
        id="aac_b2",
        category="social_boundaries",
        symbol_glyph="👁️‍🗨️",
        label_en="Listening (Looking Away)",
        label_ur="سن رہا ہوں (دیکھے بغیر)",
        label_pa="سن رہیا آں",
        speech_phrase_en="I am listening to your words, even when my eyes are looking elsewhere.",
        speech_phrase_ur="میں آپ کی بات سن رہا ہوں، اگرچہ میری آنکھیں دوسری طرف ہیں۔",
        speech_phrase_pa="میں تواڈی گل سن رہیا آں بھانویں میری اکھاں پرے نیں۔",
        color_border="border-teal-300 bg-teal-50",
    ),
]

# ---------------------------------------------------------------------------
# MODULE D: Cognitive Development & Executive Function Practice Games
# ---------------------------------------------------------------------------
COGNITIVE_GAMES: List[CognitiveGameItem] = [
    CognitiveGameItem(
        id="game_sequencing_morning",
        title="First-Then Story Sequencing",
        domain="sequencing",
        difficulty="gentle",
        special_interest=SpecialInterestCategory.STARS,
        instruction_literal="Put the 3 steps in order: What happens first, next, and last?",
        instruction_ur="تینوں تصویروں کو ترتیب دیں: پہلے کیا ہوتا ہے، پھر کیا، اور آخر میں کیا؟",
        cards_or_steps=[
            {"step_id": "step_1", "correct_order": 1, "text": "1. Wake up & stretch like a star ⭐", "icon": "🛌"},
            {"step_id": "step_2", "correct_order": 2, "text": "2. Wash face & brush teeth 🪥", "icon": "🚿"},
            {"step_id": "step_3", "correct_order": 3, "text": "3. Put on warm socks and backpack 🎒", "icon": "👟"},
        ],
    ),
    CognitiveGameItem(
        id="game_space_packing",
        title="Astronaut Backpack Planning Game",
        domain="planning",
        difficulty="gentle",
        special_interest=SpecialInterestCategory.SPACE,
        instruction_literal="You are getting ready for a quiet space mission. Select the 3 helpful items to pack.",
        instruction_ur="آپ خلائی سفر پر جا رہے ہیں۔ بستہ تیار کرنے کے لیے ۳ درست چیزیں چنیں۔",
        cards_or_steps=[
            {"item_id": "it_1", "name": "Cool Water Bottle", "helpful": True, "icon": "💧"},
            {"item_id": "it_2", "name": "Soft Blanket / Calm Fidget", "helpful": True, "icon": "🧸"},
            {"item_id": "it_3", "name": "Salty Soup Bowl (Spills!)", "helpful": False, "icon": "🥣"},
            {"item_id": "it_4", "name": "Reading Book", "helpful": True, "icon": "📚"},
        ],
    ),
    CognitiveGameItem(
        id="game_gentle_memory_stars",
        title="Quiet Pattern Match",
        domain="working_memory",
        difficulty="gentle",
        special_interest=SpecialInterestCategory.STARS,
        instruction_literal="Match the two twin stars. There is no timer and no rush.",
        instruction_ur="ایک جیسے دو ستاروں کو آپس میں جوڑیں۔ کوئی وقت کی پابندی نہیں ہے۔",
        cards_or_steps=[
            {"pair_id": "p1", "symbol": "🌟 Golden Star", "match": "p1"},
            {"pair_id": "p2", "symbol": "🪐 Purple Planet", "match": "p2"},
            {"pair_id": "p3", "symbol": "🚀 Friendly Rocket", "match": "p3"},
        ],
    ),
]

# ---------------------------------------------------------------------------
# MODULE E: Caregiver Guidance & School Collaboration Resources
# ---------------------------------------------------------------------------
CAREGIVER_ARTICLES: List[CaregiverGuidanceArticle] = [
    CaregiverGuidanceArticle(
        id="guide_coregulation",
        title="The Power of Co-Regulation (Calm Nervous Systems Connect)",
        category="co_regulation",
        summary="Children cannot learn to self-regulate in isolation; their nervous systems sync with our calm presence first.",
        key_takeaways=[
            "Before addressing behavior, lower your own vocal volume and uncross your shoulders.",
            "Say less: A distressed child's verbal processing brain is offline; use short 3-word sentences.",
            "Respect stimming: Rocking, humming, or hand-flapping during stress is healthy autonomic discharge, not disobedience.",
            "Connection before direction: Offer a soft sip of water or sit quietly side-by-side before giving instructions.",
        ],
        sample_dialogue_or_script="Instead of 'Stop shouting and calm down right now!', say softly: 'I am right here with you. We are safe. Let's take a slow breath together.'",
    ),
    CaregiverGuidanceArticle(
        id="guide_visual_home_routines",
        title="Implementing Visual Schedules Without Power Struggles",
        category="routine_building",
        summary="How to build predictable visual anchors for mornings and evenings that empower children with ownership.",
        key_takeaways=[
            "Co-create the schedule with your child using pictures or icons, not just words.",
            "Keep the morning routine under 4 micro-steps to prevent working-memory exhaustion.",
            "Pair non-preferred tasks (homework) with immediate preferred sensory activities (trampoline, drawing).",
            "Avoid punitive streak resets: Missing a step one day is just data, not a failure.",
        ],
        sample_dialogue_or_script="'Let's check our First/Then board together: First 5 minutes of math, then 10 minutes of building your favorite train track!'",
    ),
    CaregiverGuidanceArticle(
        id="guide_assessment_referral",
        title="Navigating Professional Developmental Evaluations (When & How)",
        category="referral_guidance",
        summary="A compassionate, non-alarmist guide to seeking multidisciplinary professional assessments when your child needs extra support.",
        key_takeaways=[
            "Evaluations are not about putting labels or limits on your child; they unlock classroom rights, legal accommodations, and personalized therapies.",
            "Consult your pediatrician first for a referral to a Developmental-Behavioral Pediatrician or Child Neuropsychologist.",
            "Occupational Therapy (OT) helps with sensory processing and fine motor regulation; Speech-Language Pathology (SLP) helps with pragmatic communication.",
            "Public schools offer free IEP evaluations under IDEA; you have the legal right to request an assessment in writing.",
        ],
        sample_dialogue_or_script="Sample school letter: 'I am requesting a comprehensive multidisciplinary educational evaluation for my child to identify accommodations in attention, executive function, and sensory regulation.'",
    ),
]
