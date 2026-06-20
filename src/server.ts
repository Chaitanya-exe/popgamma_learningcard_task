import Fastify, {type FastifyInstance, type RouteShorthandOptions} from "fastify";

const server: FastifyInstance = Fastify({
    logger: true
});

const opts: RouteShorthandOptions = {
    schema:{
        response:{
            200:{
                type: "object",
                properties:{
                    message: {
                        type:"string"
                    }
                }
            }
        }
    }
};

const post_opts: RouteShorthandOptions = {
    schema:{
        body:{
            type:"object",
            properties:{
                name:{
                    type:"string",
                },
                age: {
                    type: "number"
                }
            }
        },
        response:{
            200:{
                type:"object",
                properties:{
                    message:{
                        type:"string",
                        
                    },
                    data:{
                        type: "object"
                    },
                }
            },
            500:{
                type:"object",
                properties:{
                    message:{type:"string"}
                }
            }
        }
    }
}

server.get("/", opts, async (request, response)=>{
    response.send({message:"Hello world"});
});

server.post("/data", post_opts, async (request, response) =>{
    try{
        const data = await request.body;
        console.log(typeof data)
        response.send({message:"You send the following data", data: data});
    } catch(err) {
        server.log.error(err)
        response.send({message:"some error occured"});
    }
})

try{
    await server.listen({port:8000});
    const address = server.server.address();
    const port = typeof address === "string" ? address: address?.port

} catch(err) {
    server.log.error(err);
    process.exit(1);
}
