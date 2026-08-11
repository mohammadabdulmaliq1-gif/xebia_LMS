"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Card, { CardBody } from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { assessmentService } from "../../../services/api";
import { useSession } from "next-auth/react";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await assessmentService.getAssessmentById(params.id);
      setAssessment(data);
    }
    if (params?.id) load();
  }, [params?.id]);

  const totalQuestions = useMemo(() => assessment?.questions?.length || 0, [assessment]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await assessmentService.submitAssessment(params.id, {
        learnerId: session?.user?.id || "learner-1",
        answers,
      });
      router.push("/results");
    } finally {
      setSubmitting(false);
    }
  };

  if (!assessment) {
    return <><div className="text-sm text-text-muted">Loading assessment...</div></>;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">{assessment.title}</h1>
          <p className="text-sm text-text-muted">{assessment.description}</p>
        </div>

        <Card>
          <CardBody className="p-6 space-y-6">
            {assessment.questions?.map((question, index) => (
              <div key={question.id} className="space-y-3 border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="font-semibold text-foreground">{index + 1}. {question.prompt}</p>
                <div className="grid gap-2">
                  {question.options?.map((option) => (
                    <label key={option} className="flex items-center gap-2 text-sm text-text-muted">
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{totalQuestions} questions</span>
              <Button onClick={handleSubmit} loading={submitting} variant="primary">
                Submit Assessment
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
