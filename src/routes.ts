import {type FastifyInstance, type FastifyRequest, type FastifyReply} from 'fastify';
import { GeminiService } from './llm_service.js';
import { LearningCardRequest, type ApiResponse, type validatedLLMResponse } from './types.js';


export default async function register_routes(app: FastifyInstance, geminiService: GeminiService) {
    app.get("/health", async (request: FastifyRequest, response: FastifyReply)=>{

        return response.code(200).send({
            succes: true,
            message: "Server is running",
            timestamp: new Date().toISOString()
        });

    });

    app.post<{
        Body: any
    }>("/learning-card", async (request: FastifyRequest, response: FastifyReply)=>{

        try{
            const validationResult = LearningCardRequest.safeParse(request.body);

            if (!validationResult.success) {
                return response.code(400).send({
                    success: false,
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalide Request Format"
                    }
                } as ApiResponse<never>)
            }
            
            const validatedRequest = validationResult.data;

            const conn = await Promise.all([
                await geminiService.generate_concept(validatedRequest),
                await geminiService.generate_svg(validatedRequest),
                await geminiService.generate_bonus(validatedRequest)
            ])

            return response.code(200).send({
                success: true,
                data: {
                    ...conn[0],
                    visuals: {
                        ...conn[1]
                    },
                    bonus: {
                        ...conn[2]
                    }
                }
            } as ApiResponse<validatedLLMResponse>)

        }catch(err){
            console.error("Error generating the repsonse: ", err);
            return response.code(500).send({
                success: false,
                error:{
                    code: "GENERATION_ERROR",
                    message: "Error generating a response"
                }
            } as ApiResponse<never>)
        }

    })
}