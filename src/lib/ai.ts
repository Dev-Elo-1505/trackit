// // lib/ai.ts
// import axios from "axios";

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// export const getHabitSuggestions = async (existingHabits: string[]) => {
// const prompt = `
// You are a helpful habit coach. A user already tracks: ${existingHabits.length ? existingHabits.join(", ") : "nothing yet"}.
// Suggest 3 simple and healthy daily habits that are **not** already tracked.

// Respond ONLY with a JSON array of strings. Do not include any explanation or additional text. Example:

// [
//   "Take a 10-minute walk",
//   "Read 5 pages of a book",
//   "Do 10 pushups"
// ]
// `;

//   try {
//     const response = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }],
//           },
//         ],
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     // Debugging step — helpful while testing
//     console.log("Gemini raw response:", text);

//     const jsonMatch = text.match(/\[.*?\]/s); // Lazy match
//     if (!jsonMatch) throw new Error("No JSON array found in response");

//     const parsed = JSON.parse(jsonMatch[0]);
//     if (!Array.isArray(parsed)) throw new Error("Not an array");

//     return parsed;
//   } catch (error) {
//     console.error("Gemini AI error:", error);
//     throw new Error("Failed to get valid habit suggestions");
//   }
// };

// lib/ai.ts



// Real one
import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getHabitSuggestions = async (existingHabits: string[]) => {
  const prompt = `You are a habit recommendation expert. Suggest 3 simple and healthy daily habits for someone who already tracks: ${
    existingHabits.join(", ") || "no habits yet"
  }.
Return ONLY a JSON array of habit names. Format must be: ["Habit 1", "Habit 2", "Habit 3"]
Do not include any additional text, explanations, or markdown. Only the JSON array.`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the JSON string from response
    const textResponse =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    // Try to parse the response directly
    try {
      return JSON.parse(textResponse);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from text
      const jsonMatch = textResponse.match(/\[[^\]]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("Couldn't parse JSON response");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to get habit suggestions. Please try again.");
  }
};



// Add this to ai.ts
export const testGeminiConnection = async () => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: "Hello" }]
        }]
      },
      {
        headers: { 
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Gemini Connection Error:", error.response?.data || error.message);
    throw error;
  }
};

// Call this in DashboardPage.tsx
