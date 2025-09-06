import { supabaseClient } from "./supabaseClient";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDS0xD0cAxMFyLioBEpZNCKLnK_higX3I4",
});

async function getUsers() {
  const { data, error } = await supabaseClient.from("users").select("*");

  if (error) console.error(error);
  return data;
}

class Student {
  constructor(
    id,
    full_name,
    subjects,
    availability,
    preferred_lang,
    school,
    special,
    created_by
  ) {
    this.id = id;
    this.full_name = full_name;
    this.subjects = subjects;
    this.availability = availability;
    this.preferred_lang = preferred_lang;
    this.school = school;
    this.special = special;
    this.created_by = created_by;
  }

  async getMatch(studentList = []) {
    console.log("Finding best match...");
    const payload = JSON.stringify(studentList, null, 2);
    const prompt = `
      Find me a study partner from the following list of students:

        ${payload}

        My criteria:
        - Subjects: ${this.subjects}
        - Availability: ${this.availability}
        - Preferred Language: ${this.preferred_lang}
        - School: ${this.school}
        - Special Requirements: ${this.special}

        Please match me with the most compatible student(s) for effective studying together.`;

            try {
              const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                  systemInstruction: `You are an algorithm designed to match students with their most compatible study buddies based on their profiles and preferences.

          Given a list of students in JSON format, analyze their attributes (subjects, availability, preferred language, school, and special requirements). Identify the top 3 most compatible matches for the given student.

          For each match, return:
          - "id": the matched student's ID,
          - "name": the matched student's name,
          - "score": an integer between 0–100 representing compatibility,
          - "reason": a 2–3 sentence explanation that highlights specific factors such as shared subjects, overlapping availability, same school, common languages, or similar special requirements.
          - Ensure the explanations are varied: each of the top 3 matches should emphasize slightly different aspects of compatibility.

          ⚠️ Respond ONLY in strict JSON format, no extra text, no explanations outside the JSON.

          Example response:
          {
            "matches": [
              {
                "id": 1,
                "name": "Jason",
                "score": 85,
                "reason": "Jason and the student both study Math and Science, and they share weekend availability. Their similar focus on STEM subjects makes them highly compatible as study partners."
              },
              {
                "id": 2,
                "name": "Lim",
                "score": 72,
                "reason": "Lim overlaps in English and prefers the same language of instruction. Although their schedules match only twice a week, this shared communication style makes collaboration smooth."
              },
              {
                "id": 3,
                "name": "Yingxin",
                "score": 60,
                "reason": "Yingxin attends the same school and is available during overlapping weekdays. While they have fewer subject overlaps, their school connection and shared environment still make them a viable match."
              }
            ]
          }`,
        responseMimeType: "application/json"
        }});

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No text content from Gemini");

      const parsed = JSON.parse(text);

      const topMatch = parsed.matches;
      return topMatch
      
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

async function signUp(newStudent) {
  const { data, error } = await supabaseClient
    .from("users")
    .insert({
      full_name: newStudent.full_name,
      subjects: newStudent.subjects,         // e.g. ["Math", "English"]
      availability: newStudent.availability, // e.g. ["Saturday", "Sunday"]
      preferred_lang: newStudent.preferred_lang,
      school: newStudent.school,
      special: newStudent.special ?? null
    })
    .select()
    .single(); // since you're inserting one row

  if (error) {
    console.error("Sign up failed:", error);
    return { ok: false, error };
  }

  console.log("Inserted new user: ", data);
  return { ok: true, data };
}

export { getUsers, Student, signUp };
