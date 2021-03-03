import express, { Request, Response } from 'express'; 
const roleEnum = require("../models/user.ts").roleEnum;
const authValidators = require("./authvalidators.ts");


const requireContributorStatus = (req:Request, res: Response, next: Function) => {
    if (
        authValidators.validateRequestForRole(req, roleEnum.CONTRIBUTOR) ||
        authValidators.validateRequestForRole(req, roleEnum.STAFF) || 
        authValidators.validateRequestForRole(req, roleEnum.ADMIN)
    ) {
        return next();
    }
    res
        .status(401)
        .send("You are not authorized (requires contributor status).");
};

const requireStaffStatus = (req:Request, res: Response, next: Function) => {
    if (
        authValidators.validateRequestForRole(req, roleEnum.STAFF) || 
        authValidators.validateRequestForRole(req, roleEnum.ADMIN)
    ) {
        return next();
    }
    res
        .status(401)
        .send("You are not authorized (requires staff status).");
};

const requireAdminStatus = (req:Request, res: Response, next: Function) => {
    if (
        authValidators.validateRequestForRole(req, roleEnum.ADMIN)
    ) {
        return next();
    }
    res
        .status(401)
        .send("You are not authorized (requires admin status).");
};

module.exports = {
    requireContributorStatus,
    requireStaffStatus,
    requireAdminStatus,
};