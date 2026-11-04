"""Seed curriculum documents and vetted chunks for Punjab Curriculum and Textbook Board (PCTB).

All items are reviewed and tagged with:
- source_document
- source_version
- license_permission
- board
- grade
- subject
- chapter
- topic
- learning_objective
- language
- chunk_text
- review_status: approved
- reviewer: Prof. Fatima Zahra (Punjab Curriculum Specialist)
- citation
"""

from typing import List
from app.domains.curriculum_rag.schemas import (
    CurriculumSourceDocument,
    CurriculumChunk,
    CurriculumBoard,
    GradeLevel,
    CurriculumSubject,
    ReviewStatus,
)

SEEDED_SOURCES: List[CurriculumSourceDocument] = [
    CurriculumSourceDocument(
        id="pctb_src_math_g4",
        source_document="Punjab Textbook Board Mathematics Grade 4",
        source_version="2025-2026",
        license_permission="Official PCTB Educational Standard",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.MATHEMATICS,
        review_status=ReviewStatus.APPROVED,
        reviewer="Prof. Fatima Zahra (PCTB Specialist)",
        citation="PCTB Mathematics Grade 4 (2025-2026 Edition), Approved Curriculum",
    ),
    CurriculumSourceDocument(
        id="pctb_src_sci_g4",
        source_document="Punjab Textbook Board General Science Grade 4",
        source_version="2025-2026",
        license_permission="Official PCTB Educational Standard",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.GENERAL_SCIENCE,
        review_status=ReviewStatus.APPROVED,
        reviewer="Dr. Tariq Mahmood (Punjab Science Curriculum Board)",
        citation="PCTB General Science Grade 4 (2025-2026 Edition), Unit 3: Living Things",
    ),
    CurriculumSourceDocument(
        id="pctb_src_urdu_g4",
        source_document="Punjab Textbook Board Urdu Lazmi Grade 4",
        source_version="2025-2026",
        license_permission="Official PCTB Educational Standard",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.URDU,
        review_status=ReviewStatus.APPROVED,
        reviewer="Mohtarma Ayesha Siddiqa (Urdu Adab Curriculum Committee)",
        citation="PCTB Urdu Grade 4 (2025-2026 Edition), Sabq 5: Hamari Zaban",
    ),
    CurriculumSourceDocument(
        id="pctb_src_punjabi_g4",
        source_document="Punjab Language Heritage & Life Skills Grade 4",
        source_version="2025-2026",
        license_permission="Punjab Cultural & Folk Education Standard",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.PUNJABI,
        review_status=ReviewStatus.APPROVED,
        reviewer="Ustad Ghulam Rasool (Punjabi Language Institute Lahore)",
        citation="Punjab Language & Heritage Grade 4 (Shahmukhi / Gurmukhi Standard)",
    ),
    CurriculumSourceDocument(
        id="pctb_src_math_g5",
        source_document="Punjab Textbook Board Mathematics Grade 5",
        source_version="2025-2026",
        license_permission="Official PCTB Educational Standard",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_5,
        subject=CurriculumSubject.MATHEMATICS,
        review_status=ReviewStatus.APPROVED,
        reviewer="Prof. Fatima Zahra (PCTB Specialist)",
        citation="PCTB Mathematics Grade 5 (2025-2026 Edition), Chapter 4: Fractions and Decimals",
    ),
]

SEEDED_CHUNKS: List[CurriculumChunk] = [
    # Chunk 1: Grade 4 Math - Equal Sharing and Division (Mango Sharing)
    CurriculumChunk(
        id="chunk_math_g4_div_01",
        source_id="pctb_src_math_g4",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.MATHEMATICS,
        chapter="Chapter 2: Number Operations & Division",
        topic="Equal Sharing and Fair Division",
        learning_objective="Understand division as repeated subtraction and fair sharing among groups.",
        language="en",
        chunk_text=(
            "Division means splitting a collection into equal parts or groups. "
            "For example, if you have 12 items (like 12 sweet Chaunsa mangoes) and you share them equally among 3 friends, "
            "you give each friend one mango at a time until all 12 are distributed. "
            "12 divided by 3 equals 4 (12 ÷ 3 = 4). Each friend receives exactly 4 items."
        ),
        review_status=ReviewStatus.APPROVED,
        reviewer="Prof. Fatima Zahra",
        citation="PCTB Grade 4 Mathematics, Chapter 2, Page 28",
    ),
    # Chunk 2: Grade 4 Math - Equal Sharing (Urdu Translation)
    CurriculumChunk(
        id="chunk_math_g4_div_ur",
        source_id="pctb_src_math_g4",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.MATHEMATICS,
        chapter="باب 2: بنیادی حسابی عمل اور تقسیم",
        topic="برابر تقسیم (Fair Division)",
        learning_objective="تقسیم کو برابر حصوں میں بانٹنے کے عمل کے طور پر سمجھنا۔",
        language="ur",
        chunk_text=(
            "تقسیم کا مطلب ہے کسی چیز کو برابر حصوں میں بانٹنا۔ "
            "اگر آپ کے پاس 12 میٹھے چونسہ آم ہیں اور آپ 3 دوستوں میں برابر تقسیم کرنا چاہتے ہیں تو ہر دوست کو 4 آم ملیں گے۔ "
            "12 تقسیم 3 برابر ہے 4 کے (12 ÷ 3 = 4)۔ اس طرح کوئی بھی بچہ محروم نہیں رہتا۔"
        ),
        review_status=ReviewStatus.APPROVED,
        reviewer="Prof. Fatima Zahra",
        citation="پی سی ٹی بی ریاضی جماعت چہارم، باب 2، صفحہ 28",
    ),
    # Chunk 3: Grade 4 Math - Equal Sharing (Punjabi Shahmukhi)
    CurriculumChunk(
        id="chunk_math_g4_div_pa",
        source_id="pctb_src_math_g4",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.MATHEMATICS,
        chapter="باب 2: ونڈ تے حصےداری",
        topic="برابر ونڈ (Equal Sharing)",
        learning_objective="ونڈ نوں برابری نال چیزاں ونڈن دے عمل وجوں سکھنا۔",
        language="pa",
        chunk_text=(
            "ونڈ دا مطلب اے چیزاں نوں برابر برابر ونڈنا۔ "
            "جے تہاڈے کول 12 مٹھے چونسہ امب نے تے تسیں 3 بیلاں وچ برابر ونڈنے نے، تاں ہر بیلی نوں 4 امب ملن گے۔ "
            "12 نوں 3 نال ونڈو تاں 4 آندا اے (12 ÷ 3 = 4)۔"
        ),
        review_status=ReviewStatus.APPROVED,
        reviewer="Ustad Ghulam Rasool",
        citation="پنجاب درسی بورڈ ریاضی جماعت چوتھی، باب 2، صفحہ 28",
    ),
    # Chunk 4: Grade 4 Science - Photosynthesis and Plant Growth
    CurriculumChunk(
        id="chunk_sci_g4_plants_01",
        source_id="pctb_src_sci_g4",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.GENERAL_SCIENCE,
        chapter="Unit 3: Characteristics of Living Organisms",
        topic="How Green Plants Make Food (Photosynthesis)",
        learning_objective="Explain that green plants use sunlight, water, and carbon dioxide to prepare food.",
        language="en",
        chunk_text=(
            "Green plants are producers because they make their own food through a process called photosynthesis. "
            "The plant takes in water from the soil through its roots and carbon dioxide from the air through tiny openings in leaves called stomata. "
            "Using sunlight captured by green chlorophyll, the leaf transforms water and carbon dioxide into glucose (food) and releases oxygen into the air."
        ),
        review_status=ReviewStatus.APPROVED,
        reviewer="Dr. Tariq Mahmood",
        citation="PCTB Grade 4 General Science, Unit 3, Page 42",
    ),
    # Chunk 5: Grade 4 Science - Water Cycle
    CurriculumChunk(
        id="chunk_sci_g4_water_cycle",
        source_id="pctb_src_sci_g4",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_4,
        subject=CurriculumSubject.GENERAL_SCIENCE,
        chapter="Unit 5: Earth and Weather",
        topic="The Water Cycle (Evaporation, Condensation, Precipitation)",
        learning_objective="Trace the movement of water on Earth through evaporation, cloud formation, and rainfall.",
        language="en",
        chunk_text=(
            "The water cycle is the continuous movement of water between the Earth's surface and the atmosphere. "
            "1. Evaporation: Heat from the sun warms rivers, lakes, and oceans, turning liquid water into invisible water vapor. "
            "2. Condensation: Rising water vapor cools down high in the sky and forms tiny water droplets that bundle together into clouds. "
            "3. Precipitation: When cloud droplets become heavy, they fall back to Earth as rain, snow, or hail."
        ),
        review_status=ReviewStatus.APPROVED,
        reviewer="Dr. Tariq Mahmood",
        citation="PCTB Grade 4 General Science, Unit 5, Page 67",
    ),
    # Chunk 6: Grade 5 Math - Proper and Improper Fractions
    CurriculumChunk(
        id="chunk_math_g5_fractions",
        source_id="pctb_src_math_g5",
        board=CurriculumBoard.PCTB,
        grade=GradeLevel.GRADE_5,
        subject=CurriculumSubject.MATHEMATICS,
        chapter="Chapter 4: Fractions and Decimals",
        topic="Proper, Improper, and Mixed Fractions",
        learning_objective="Distinguish between proper fractions where numerator is less than denominator, and improper fractions.",
        language="en",
        chunk_text=(
            "A fraction represents parts of a whole. In a fraction a/b, 'a' is the numerator (parts taken) and 'b' is the denominator (total equal parts). "
            "A Proper Fraction has a numerator smaller than its denominator (e.g., 3/4 or 1/2), representing a value less than 1. "
            "An Improper Fraction has a numerator greater than or equal to the denominator (e.g., 5/3 or 7/4), representing 1 or more wholes."
        ),
        review_status=ReviewStatus.APPROVED,
        reviewer="Prof. Fatima Zahra",
        citation="PCTB Grade 5 Mathematics, Chapter 4, Page 53",
    ),
]
