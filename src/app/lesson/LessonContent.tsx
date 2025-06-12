"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LessonContent({
  onSetLessonId,
}: {
  onSetLessonId: (id: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("lessonId");
    if (id) {
      onSetLessonId(id);
    }
  }, [searchParams, onSetLessonId]);

  return null;
}
