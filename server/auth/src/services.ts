import { log } from "console";
import { hash } from "bcrypt";
import { Request } from "express";

export const getUsernameFromRequest = (request: Request): string => {
    return request.body.username;
};

export const getPasswordFromRequest = (request: Request): string => {
    return request.body.password;
};

export const getHashedPasswordFromRequest = (request: Request) => {
    return hash(request.body.password, 10);
};

export const logUserAlreadyExists = () => {
    log("--- User already exists ---");
};

export const logUserDoesNotExist = () => {
    log("--- User does not exist ---");
};

export const logUserCreated = () => {
    log("--- Created new user ---");
};

export const logSuccessfulLogin = () => {
    log("--- Login Successful ---");
};

export const logIncorrectPassword = () => {
    log("--- Password Incorrect ---");
};
