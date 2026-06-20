import { GoogleGenAI } from "@google/genai";
import { 
    type validatedSchema, 
    type validatedLLMResponse,
    LearningCardResponse,
    type validatedSvg,
    svgResponse
 } from "./types.js";

export class GeminiService {
    private client: GoogleGenAI;
    private model: any

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({'apiKey': apiKey});
        this.model = "gemini-2.5-flash";
        
    }

    async generate_concept(request: validatedSchema): Promise<validatedLLMResponse> {
        const prompt = this.build_prompt(request);

        const response = await this.client.models.generateContent({
            model: this.model,
            contents: prompt,
            config:{
                responseMimeType: 'application/json',
                responseJsonSchema: LearningCardResponse.toJSONSchema()
            }
        })
        const text = response.text;

        if (!text) {
            throw new Error("Gemini returned empty response")
        }

        const parsed = JSON.parse(text)
        console.log(parsed.latex);
        return LearningCardResponse.parse(parsed)
    }

    async generate_svg(request: validatedSchema): Promise<validatedSvg> {
        const prompt = this.build_svg_prompt(request);

        const response = await this.client.models.generateContent({
            model: this.model,
            contents: prompt,
            config:{
                responseMimeType: 'application/json',
                responseJsonSchema: svgResponse.toJSONSchema()
            }
        });

        const text = response.text;

        if (!text) {
            throw new Error("gemini returned empty response");
        }

        const parsed = JSON.parse(text);

        return svgResponse.parse(parsed);

    }

    build_prompt(request: validatedSchema): string{
        return `You are a professional educational content generator tailored for CBSE, ICSE, and IB school boards.
You will receive the student's grade, the school board, and the specific concept to explain.

Generate a structured JSON response containing educational content for a learning card. 

### Input Parameters:
{
    "grade": "${request.grade}",
    "board": "${request.board}",
    "concept": "${request.concept}"
}

### Execution Rules:
1. Tone & Language: Use clear, age-appropriate, engaging language suited to the provided grade level and board standards.
2. Content Depth: The "concept" section should provide a thorough, easy-to-follow explanation using clear spacing or bullet points if necessary and make the explanations engaging and intuitively understandable so that any student should be able to understand regardless of Intelligence level.
3. Strict LaTeX Formatting: 
   - The "latex" field must contain ONLY pure mathematical formulas, equations, or scientific notations. 
   - Do NOT include text explanations or conversational words inside the "latex" field.
   - CRITICAL: Because this is a JSON string, you MUST double-escape all LaTeX backslashes. For example, write "\\frac{a}{b}" instead of "\frac{a}{b}", and "\\Delta" instead of "\Delta".
4. Output Format: Return ONLY a valid JSON object. Do not wrap it in markdown code blocks (like json). Do not add any introductory or concluding text.

### Required JSON Structure:
{
    "title": "Title of the concept",
    "description": "1-2 sentences explaining what the concept is or why it matters.",
    "concept": "Detailed explanation of the concept.",
    "latex": "Pure, double-escaped LaTeX string containing the core formulas/expressions."
}`
    }

    build_svg_prompt(request: validatedSchema): string{
        return ``
    }
}