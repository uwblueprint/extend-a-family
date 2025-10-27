import { NextFunction, Request, Response } from "express";

import {
    getApiValidationError,
    getFileTypeValidationError,
    validateFileType,
    validatePrimitive,
} from "./util";
import { isRole } from "../../types/userTypes"; // is it a vlid role

// validate params passed to endpoint 
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const createTeamMemberDtoValidator = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!validatePrimitive(req.body.firstName, "string")) {
        return res.status(400).send(getApiValidationError("firstName", "string"));
    }
    if (!validatePrimitive(req.body.lastName, "string")) {
        return res.status(400).send(getApiValidationError("lastName", "string"));
    }
    if (!validatePrimitive(req.body.role, "string") && isRole(req.body.role)) {
        return res.status(400).send(getApiValidationError("role", "string"));
    }
    return next();
};