import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, MEMO_PROGRAM_ID } from "@solana/actions"
import { Transaction, TransactionInstruction, ComputeBudgetProgram, PublicKey, Connection, clusterApiUrl } from "@solana/web3.js"

export const GET = (req: Request) => {

    const payload : ActionGetResponse  = {
        icon : new URL("/garden.jpg", new URL(req.url).origin).toString(),
        label : "Kiyomi",
        description : "my beautiful woman",
        title : "Memo demo"
    }

    return Response.json(payload, {
        headers : ACTIONS_CORS_HEADERS 
    });
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
    const body: ActionPostRequest = await req.json(); 
        let account: PublicKey
    try {
        account = new PublicKey(body.account)
        console.log(account)
    } catch (err) {
        return new Response("Invalid Public key provided", {
            status : 400,
            headers :ACTIONS_CORS_HEADERS
        });
    }

    const transaction = new Transaction();

        transaction.add(
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports : 1000,
                }),
                new TransactionInstruction({
                    programId : new PublicKey(MEMO_PROGRAM_ID),
                    data : Buffer.from("Kiyomi's Solana actions memo", "utf8"), 
                    keys : []
            }),
        );
    
        transaction.feePayer = account;
        const connection = new Connection(clusterApiUrl("devnet"));
        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
                fields: {
                    transaction,
                },
                // signers : []
        });
        return Response.json(payload, {headers: ACTIONS_CORS_HEADERS})
   
    } catch (err) {
        return Response.json("An unknown error occured, sorry!"), {status: 400}
    };
};

