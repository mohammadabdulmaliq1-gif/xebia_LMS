"use client";

import React, { useEffect, useState } from "react";
import Card, { CardBody } from "../../components/common/Card";
import { assessmentService } from "../../services/api";
import { Trophy } from "lucide-react";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await assessmentService.getResults();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground">Assessment Results</h1>
          <p className="text-sm text-text-muted">Review completed submissions and score summaries.</p>
        </div>

        {loading ? (
          <div className="text-sm text-text-muted">Loading results...</div>
        ) : results.length === 0 ? (
          <Card>
            <CardBody className="p-6 text-sm text-text-muted">No submissions have been recorded yet.</CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {results.map((result) => (
              <Card key={result.id}>
                <CardBody className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-accent/10 p-3 text-accent">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-black text-foreground">Submission {result.id}</h2>
                      <p className="text-sm text-text-muted">Marks: {result.marksObtained}/{result.totalMarks}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">{result.status}</span>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
