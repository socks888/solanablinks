import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions"

export const GET = (req: Request) => {

    const payload : ActionGetResponse  = {
        icon : new URL("/garden.jpg", new URL(req.url).origin).toString(),
        label : "Kiyomi",
        description : "my beautiful woman",
        title : "Memo demo"
    }

    return Response.json(payload, {
        headers : ACTIONS_CORS_HEADERS 
    })
}