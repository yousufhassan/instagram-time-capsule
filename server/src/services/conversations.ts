import { log } from "console";

export const logConversationInserted = (numConversations: number) => {
    log(`--- ${numConversations} conversations inserted into database ---`);
};
