import { log } from "console";
import { hash } from "bcryptjs";
// import { Request } from "express";

export const getUsernameFromRequest = (request: any): string => {
    return request.username;
};

export const getPasswordFromRequest = (request: any): string => {
    return request.password;
};

export const getHashedPasswordFromRequest = async (request: any) => {
    return await hash(request.password, 10);
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
