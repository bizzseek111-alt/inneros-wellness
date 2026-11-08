export type V10EventType =
  | "journey_started"
  | "journey_completed"
  | "activity_completed"
  | "project_created"
  | "project_updated"
  | "learning_objective_practiced";

export interface EducationalActivityEvent {
  id: string;
  event_type?: V10EventType;
  student_pseudonymous_id: string;
  student_name?: string;
  activity_id: string;
  activity_title?: string;
  category?: string;
  learning_objective: string;
  completion_status: "completed" | "in_progress" | "reviewed";
  hints_used_count: number;
  language_used: "en" | "ur" | "pa";
  duration_seconds: number;
  curriculum_version: string;
  created_at: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __weeblyV10ActivityEvents: EducationalActivityEvent[] | undefined;
}

export function getActivityEventsStore(): EducationalActivityEvent[] {
  if (!globalThis.__weeblyV10ActivityEvents) {
    globalThis.__weeblyV10ActivityEvents = [
      {
        id: "evt_demo_01",
        event_type: "activity_completed",
        student_pseudonymous_id: "std_ayan_7y",
        student_name: "Ayan (Fictional Demo)",
        activity_id: "q_emot_0001",
        activity_title: "Somatic Body Butterflies Recognition",
        category: "emotional_vocabulary",
        learning_objective: "Identify and label bodily cues of apprehension",
        completion_status: "completed",
        hints_used_count: 1,
        language_used: "en",
        duration_seconds: 145,
        curriculum_version: "v2.4.0",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "evt_demo_02",
        event_type: "learning_objective_practiced",
        student_pseudonymous_id: "std_zainab_10y",
        student_name: "Zainab (Fictional Demo)",
        activity_id: "q_scie_0001",
        activity_title: "Light Speed vs Sound Speed Inquiry",
        category: "science_and_discovery",
        learning_objective: "Explain differences in propagation speeds of light and sound",
        completion_status: "completed",
        hints_used_count: 0,
        language_used: "ur",
        duration_seconds: 210,
        curriculum_version: "v2.4.0",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      },
      {
        id: "evt_demo_03",
        event_type: "journey_completed",
        student_pseudonymous_id: "std_ayan_7y",
        student_name: "Ayan (Fictional Demo)",
        activity_id: "q_math_0001",
        activity_title: "Fair-Share Mango Division",
        category: "mathematics",
        learning_objective: "Equal partition division into 3 groups",
        completion_status: "completed",
        hints_used_count: 0,
        language_used: "pa",
        duration_seconds: 180,
        curriculum_version: "v2.4.0",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  }
  return globalThis.__weeblyV10ActivityEvents;
}

export function recordServerActivityEvent(
  input: Partial<EducationalActivityEvent> & {
    event_type?: V10EventType;
    child_id?: string;
    skill_domain?: string;
  }
): EducationalActivityEvent {
  const store = getActivityEventsStore();
  const eventId = input.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newEvent: EducationalActivityEvent = {
    id: eventId,
    event_type: input.event_type || "activity_completed",
    student_pseudonymous_id:
      input.student_pseudonymous_id || input.child_id || "std_ayan_7y",
    student_name: input.student_name || "Ayan (Fictional Demo)",
    activity_id: input.activity_id || "q_interactive_activity",
    activity_title: input.activity_title || "Interactive SEL Activity",
    category: input.category || input.skill_domain || "emotional_vocabulary",
    learning_objective: input.learning_objective || "Practice cooperative problem solving",
    completion_status: input.completion_status || "completed",
    hints_used_count: Number(input.hints_used_count || 0),
    language_used: (input.language_used as "en" | "ur" | "pa") || "en",
    duration_seconds: Number(input.duration_seconds || 120),
    curriculum_version: input.curriculum_version || "v2.4.0",
    created_at: input.created_at || new Date().toISOString(),
  };
  store.unshift(newEvent);
  return newEvent;
}
