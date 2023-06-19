import { log } from "console";
import { hash } from "bcrypt";
import { Request } from "express";

export const getUsernameFromRequest = (request: Request) => {
    return request.body.username;
};

export const getHashedPasswordFromRequest = (request: Request) => {
    return hash(request.body.password, 10);
};

export const logUserAlreadyExists = () => {
    log("--- User already exists ---");
};

export const logUserCreated = () => {
    log("--- Created new user ---");
};
