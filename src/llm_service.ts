import { GoogleGenAI } from "@google/genai";
import { 
    type validatedSchema, 
    type validatedLLMResponse,
    LearningCardResponse,
    type validatedSvg,
    svgResponse,
    type ValidatedBonus,
    BonusResponse
 } from "./types.js";

export class GeminiService {
    private client: GoogleGenAI;
    private model: any

    constructor(apiKey: string, model: string) {
        this.client = new GoogleGenAI({'apiKey': apiKey});
        this.model = model;
        
    }

    async generate_concept(request: validatedSchema): Promise<validatedLLMResponse> {
        
        try {
            
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
                throw new Error("Gemini returned empty response");
            }
    
            const parsed = JSON.parse(text);
            return LearningCardResponse.parse(parsed);
        } catch (error) {
            return LearningCardResponse.parse({
                title: "",
                description: "",
                latex: "",
                concept: ""
            })
        }
        
    }

    async generate_svg(request: validatedSchema): Promise<validatedSvg> {
        
        try {
            
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
            console.log(parsed.svgContent) 
            return svgResponse.parse(parsed);
        } catch (error) {
            return svgResponse.parse({
                title: "",
                svgContent: "",
                description: ""
            })
        }


    }

    async generate_bonus(request: validatedSchema): Promise<ValidatedBonus> {
        
        try {
            
            const prompt = this.build_bonus_prompt(request);
    
            const response = await this.client.models.generateContent({
                model: this.model,
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseJsonSchema: BonusResponse.toJSONSchema()
                }
            })
    
            const text = response.text;
    
            if (!text) {
                throw new Error("Gemini returned empty response");
            } 
    
            const parsed = JSON.parse(text);
            return BonusResponse.parse(parsed);
        } catch (error) {
            return BonusResponse.parse({
                analogy: "",
                fact: "",
                questions: []
            })
        }
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
        return `You are an expert educational content and vector graphics generator for school boards (CBSE, ICSE, IB). 
Your task is to generate a visual aid/diagram in SVG format, along with its metadata, to help a student understand a specific academic concept.

### Input Parameters:
{
    "grade": "${request.grade}",
    "board": "${request.board}",
    "concept": "${request.concept}"
}

### Execution Rules:
1. Visual Relevance: Create a clean, modern, educational diagram, chart, geometric shape, or visual metaphor that directly clarifies the given concept for the specified grade level.
2. SVG Technical Requirements:
   - Must be fully valid, self-contained SVG code. Do NOT include HTML wrappers, markdown code fences, or external asset links.
   - Use the viewBox attribute (e.g., viewBox="0 0 400 400") and omit explicit width and height attributes on the <svg> tag to ensure it is completely responsive.
   - Use clean, modern inline CSS or presentation attributes (fill, stroke, stroke-width, font-family="Arial, sans-serif") for styling. Use a visually appealing, student-friendly color palette with high contrast for text.
3. CRITICAL JSON Escaping: Because the SVG code will contain many double quotes ("), newlines, and backslashes, you MUST properly escape the entire SVG string so that it remains valid inside a JSON object. Escape all inner double quotes as \" and newlines as \n.
4. Output Format: Return ONLY a valid JSON object. Do not wrap it in markdown code blocks (like json). Do not add any introductory or concluding text.

### Required JSON Structure:
{
    "title": "A concise, clear title for the visual diagram",
    "description": "1-2 sentences explaining what the visual illustrates and how a student should interpret it.",
    "svgContent": "<svg viewBox=\"0 0 400 400\" xmlns=\"[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)\"><rect x=\"10\" y=\"10\" width=\"100\" height=\"100\" fill=\"#3498db\"/><text x=\"20\" y=\"40\" fill=\"white\">Example</text></svg>"
}`
    }

    build_bonus_prompt(request: validatedSchema): string {
        return `You are an expert educational content generator tailored for CBSE, ICSE, and IB school boards.
Your task is to generate supplemental interactive and contextual content for a learning card based on a specific academic concept.

### Input Parameters:
{
    "grade": "${request.grade}",
    "board": "${request.board}",
    "concept": "${request.concept}"
}

### Execution Rules:
1. Tone & Accessibility: Match the vocabulary and complexity perfectly to the specified grade level. The language should be clear, highly engaging, and student-friendly.
2. Analogy Guidance: Create a relatable, vivid comparison to an everyday object or scenario that bridges the gap between abstract theory and a student's lived experience.
3. Fact Guidance: Provide a surprising, memorable "did you know?" style fun fact that demonstrates a tangible, exciting real-world application of the concept.
4. Questions Guidance: 
   - Provide exactly 2 short, highly targeted multiple-choice questions that test understanding of the core concept.
   - Each question must have exactly 3 distinct, plausible options (no "all of the above" or obviously silly filler options).
5. Output Format: Return ONLY a valid JSON object. Do not wrap it in markdown code blocks (like json). Do not add any introductory or concluding text.

### Required JSON Structure:
{
    "analogy": "A simple, creative explanation of the concept using a relatable everyday comparison.",
    "fact": "A fascinating fun fact about the concept highlighting its real-world application or impact.",
    "questions": [
        {
            "question": "Clear question testing comprehension of the concept.",
            "options": ["Option A", "Option B", "Option C"]
        },
        {
            "question": "Another clear, conceptually different question testing the concept.",
            "options": ["Option A", "Option B", "Option C"]
        }
    ]
}`
    }
}