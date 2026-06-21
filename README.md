# Learning Card: Design Project
---

This is a LLM powered learning card generator API. Given a `board`, `grade` and `concept` the api generates a `learning_card` which represents a deeper, understandable and visualised form of the concept which can be later used with frontend applications to represent concepts in a more intuitive way.

### Usage or Testing
Please have the `GOOGLE_API_KEY` in your local .env file which is a gemini api key from google AI studio and `MODEL_NAME` which is the name of preferred model (gemini-3.1-flash-lite). For this project gemini has been used as the reasoning LLM.

To start the API server - 
```bash
# install the dependencies
npm install

# start the dev server
npm run dev
```

The using an API client like postman, insomnia or the good old cURL test the api
```bash
curl -X POST http://localhost:8000/learning-card --data '{"board": "CBSE", "grade": 9, "concept": "Slope-intercept form of a line (y = mx + c)"}'
```

### Learning Card Structure
Learning Card is designed in the following structure:
```json
{
    "title": "",            // string
    "description": "",      // string
    "concept":"",           // string
    "latex": "",            // string
    "visuals":{             // object
        "title":"",         // string
        "svgContent":"",    // string
        "description":"",   // string 
    },
    "bonus":{               // object
        "analogy": "",      // string
        "fact": "",         // string
        "questions": [      // array of objects
            {
                "question":"",      // string
                "options":[""]      // array of string
            }
        ]
    }
}
```

Key details about the structure - 
1. `title` - A title of the concept.
2. `description` - A short description about the concept, why it matters.
3. `concept` - An in-depth explanation of the concept appropriate for the `grade` and `board` level provided.
4. `latex` - A string containing latex's mathematical or scientific notations for rendering, transported with escape characters to ensure correct syntax for rendering.
5. `visuals`:
    * `title` - title for the diagram or visual.
    * `svgContent` - The visual for the concept in the form of svg graphic. SVG was chosen instead of image generation because it remains lightweight ,frontend-renderable, and easy to validate. It also allows educational diagrams to be modified or annotated by the frontend without requiring image processing. 
    * `description`: A short description of the visual explaining the details of the visual.
6. `bonus`:
    * `analogy`: Explanation of the concept using an easy to understand analogy, helpful for explaning complex topics.
    * `fact`: A fun and informative fact about the concept showing and explaining it's real world application and how it is used in a real world situation.
    * `questions`: A list of questions which can be asked as a quiz to solidify the understanding of the concept. The question is represented by a `question` property and an `options` property.



### API architecture
The API is designed in the REST architecture using the `fastify` framework with typescript. There are mainly two routes in the API.
1. **GET /health** -  to check the status of the server.
2. **POST /learning-card** - To generate the learning card.

For the query execution a concurrent strategy has been implemented. Instead of putting the entire query in one prompt, the task is broken down into 3 parts.
1. Key concept and field generation - (title, description, concept, latex).
2. visual fields generation - (title, svgContent, description).
3. Bonus fields generation - (analogy, fact, questions)

The LLM usage has been abstracted with `GeminiService` class implemented in [llm_service.ts](./src/llm_service.ts). The class methods are used to generated all 3 parts of the main tasks and are executed concurrently in [routes.ts](./src/routes.ts) using the following pattern. 

```typescript
const [concept, visuals, bonus] = await Promise.all([
    await geminiService.generate_concept(validatedRequest),
    await geminiService.generate_svg(validatedRequest),
    await geminiService.generate_bonus(validatedRequest)
])

return response.code(200).send({
    success: true,
    data: {
        ...concept,
        visuals: {
            ...visuals
        },
        bonus: {
            ...bonus
        }
    }
}
```

All Inputs and outputs are validated using `zod` library and native typescript `interfaces` the implementation details for validation are in [types.ts](./src/types.ts)


### Trade-offs
**Multi-step generation vs single prompt**
Pros:
* clearer separation of concerns
* reduced hallucination risk.
* lower prompt complexity
* faster execution - (13 to 15 seconds in single prompt or stepwise. 5 to 8 seconds in concurrent execution.)

Cons:
* increased token usage
* multiple API calls
* potential consistency drift between generated sections

**SVG vs Image Generation**
Pros:
* deterministic
* frontend friendly
* scalable

Cons:
* complex diagrams are harder to generate
* limited visual richness compared to generated images

### What I'd do with more time
* Introduce retry and fallback handling for malformed LLM responses.
* Cache frequently requested concepts.
* Add support for multiple visual formats (graphs, tables, flowcharts).