import { NextResponse } from "next/server";

function extractJSON(text: string) {
  // remove markdown code blocks
  const cleaned = text.replace(/```json|```/g, "").trim();

  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]") + 1;

  if (start === -1 || end === -1) return null;

  return cleaned.slice(start, end);
}

const fallbackQuiz = [
  {
    question: "What is phishing?",
    options: [
      "A cyberattack using fake emails to steal data",
      "A firewall configuration",
      "A password manager",
      "A type of encryption"
    ],
    answer: 0,
    hint: "It usually involves fake emails."
  },
  {
    question: "What does HTTPS provide?",
    options: [
      "Encryption",
      "Faster internet",
      "Email protection",
      "Virus scanning"
    ],
    answer: 0,
    hint: "It secures communication using TLS."
  }
];

export async function GET() {
  const prompt = `
Generate 10 cybersecurity multiple choice quiz questions.

Return ONLY a JSON array.

Format:
[
{
"question":"...",
"options":["A","B","C","D"],
"answer":0,
"hint":"..."
}
]
`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6
        })
      }
    );

    const data = await response.json();

    const raw = data?.choices?.[0]?.message?.content ?? "";

    const extracted = extractJSON(raw);

    if (!extracted) {
      console.error("[QuizExtractError]", raw);
      return NextResponse.json(fallbackQuiz);
    }

    try {
      const parsed = JSON.parse(extracted);
      return NextResponse.json(parsed);
    } catch (err) {
      console.error("[QuizParseError]", extracted);
      return NextResponse.json(fallbackQuiz);
    }
  } catch (err) {
    console.error("[QuizAPIError]", err);
    return NextResponse.json(fallbackQuiz);
  }
}