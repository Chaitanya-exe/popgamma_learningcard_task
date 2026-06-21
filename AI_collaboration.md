# AI_COLLABORATION.md

## Overview

I used a combination of Claude, ChatGPT, and Gemini during the development process. My goal was not to generate the entire project automatically, but to use AI as a design and implementation collaborator while retaining ownership of architecture, implementation decisions, debugging, and trade-off analysis.

The final codebase was written and assembled manually.

---

## How I Used AI

### 1. Architecture Exploration (Claude)

At the beginning of the project, I experimented with Claude by providing the assignment and asking it to generate a complete solution.

This produced a working architecture, but it had issues like outdated library usage. The generated solution introduced additional abstractions and implementation layers that increased complexity without clearly improving the core requirements.

Rather than adopting the generated implementation directly, I used it as a reference for understanding possible project structures and implementation patterns.

The final architecture was simplified substantially and redesigned manually around the requirements of the assignment.

### What Worked Well

* Rapid exploration of possible architectures.
* Exposure to implementation patterns and project organization approaches.
* Fast generation of initial ideas.

### What Didn't Work Well

* The generated architecture was more complex than necessary.
* The resulting design was harder to explain and maintain.
* The code contained outdated library usage, causing unexpected bugs and errors.

---

### 2. Backend Development and Learning (ChatGPT)

While building the project, I used ChatGPT to better understand Fastify concepts.

Examples included:

* Fastify request and response schemas.
* Understanding why Fastify runtime schemas do not automatically become TypeScript types.
* Debugging response serialization issues.
* Project structure reviews and architecture discussions.

The primary value was educational rather than code generation. I used these interactions to understand concepts better to implement realiable code.

### What Worked Well

* Helped bridge knowledge gaps quickly.
* Useful for understanding framework behavior.
* Helpful for debugging unexpected Fastify behavior.

### What Didn't Work Well

* AI explanations occasionally required verification against official documentation.
* Generated examples sometimes needed adaptation to fit the project's architecture.

---

### 3. Prompt Development and Content Generation (Gemini)

Gemini was used as the target model for the application itself, but it was also used during development to experiment with prompt design.

I iteratively tested prompts to understand:

* How consistently structured JSON could be produced.
* How educational content quality changed with prompt wording.
* How SVG generation behaved for different concepts.
* How reliably mathematical notation could be generated.

Prompt refinement was an iterative process involving multiple test generations and manual inspection of outputs.

### What Worked Well

* Structured JSON generation.
* Age and board appropriate educational explanations.
* Consistent SVG generation for simpler educational visuals.

### What Didn't Work Well

* SVG quality varied across concepts.
* Some generated visuals required prompt adjustments.
* Output consistency improved significantly only after introducing stricter output constraints.

---

## Examples of AI Failure and Verification

### Example 1: Over-Engineering

An early Claude generated implementation introduced significantly more abstraction than required for the assignment.

I identified this by reviewing the generated architecture against the actual requirements and simplifying the design to focus on maintainability and explainability.

### Example 2: Fastify Response Serialization

During development, I encountered issues where response objects were not being returned in expected format.

Initial assumptions suggested a request parsing issue, but debugging showed the request body was correct.

Further investigation revealed a schema-definition mistake that caused Fastify's serializer to strip the nested object contents.

This was resolved through manual debugging and verification rather than relying solely on AI suggestions.

### Example 3: Prompt Reliability

Early prompts occasionally produced inconsistent results.

I improved reliability by separating generation into smaller responsibilities (concept generation, visualization generation, and bonus content generation) and validating outputs against predefined schemas using external libraries.

---

## My Decisions

The following decisions were made manually:

* Learning card schema design.
* Selection of SVG as the visual representation format.
* API structure and route design.
* Concurrent execution strategy.
* TypeScript project structure.
* Fastify implementation.
* Trade-off decisions around complexity versus maintainability.

AI assisted in exploration ,learning and debugging, but final design and implementation decisions were made manually.

---

## Key Takeaway

The most valuable use of AI during this project was not code generation but accelerating exploration, learning, and debugging.

I found AI most effective when used as a collaborator for discussing architecture, understanding unfamiliar concepts, and reviewing implementation ideas rather than as an agent generating the final solution end-to-end without user review and input.
