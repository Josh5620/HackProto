import { supabaseClient } from "./supabaseClient";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDS0xD0cAxMFyLioBEpZNCKLnK_higX3I4",
});

async function getUsers() {
  const { data, error } = await supabaseClient.from("users").select("*");

  if (error) console.error(error);
  else console.log(data);
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
                  systemInstruction: `You are an algorithm used to match Students with their buddies
        based on their profiles and preferences. 

        Analyze the list of students and identify the top 3 most compatible matches 
        for each given student. For each match, return:
        - the matched student's name,
        - a compatibility score (0–100 as integer),
        - and a one-sentence explanation of why they are compatible.

        Important: Respond ONLY in strict JSON format, no text outside JSON.

        Example response:
        {
          "matches": [
            { "id": "01", "name": "Jason", "score": 85, "reason": "Both prefer Math and share the same availability on Mon and Tue." },
            { "id": "02", "name": "Lim", "score": 54, "reason": "They both study Science but have fewer overlapping days." },
            { "id": "03", "name": "Yingxin", "score": 32, "reason": "They share English as a subject but have different schedules." }
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

export { getUsers, Student };
