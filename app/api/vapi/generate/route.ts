import { NextRequest } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: NextRequest) {
    const { type, role, level, techStack, amount, userId } = await request.json();

    if (!userId) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { text: questions } = await generateText({
            model: google("gemini-1.5-flash"),
            prompt: `
        Generate interview questions for the following job description, and return ONLY the questions in format like this: [question1, question2, question3].
        Job Type: ${type}
        Role: ${role}
        Level: ${level}
        Tech Stack: ${techStack}
        Number of Questions: ${amount}
      `,
        });

        const interview = {
            role,
            type,
            level,
            techstack: techStack.split(","),
            questions: JSON.parse(questions),
            userId, // ✅ Save correct UID here
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);

        return Response.json({ success: true, questions }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
