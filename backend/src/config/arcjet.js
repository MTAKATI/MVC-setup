import arcjet, {tokenBucket, shield, detectBot} from "@arcjet/node";
import {ENV} from "./env.js";

//Initialise Arcjet with security rules
export const aj = arcjet({
    key: ENV.ARCJECT_KEY,
    characteristics: ["ip.src"],
    rules: [
        //shield protects your app from common attacks
        shield({mode: "LIVE"}),

        //Blocks all bots except the except search engines
        detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
            ],
        }),

        //Rate limiting with token bucket algorithm
        tokenBucket({
            mode: "LIVE",
            refillRate: 10,     //tokens added per second
            interval: 10,       //interval in seconds
            capacity: 15,       //max tokens in buckets
        })
    ],
});