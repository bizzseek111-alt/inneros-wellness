import { redirect } from "next/navigation";

export default function TeacherPageRedirect() {
  redirect("/teacher/dashboard");
}
