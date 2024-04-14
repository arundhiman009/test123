import { Response } from "express";

const SendResponse = (res : Response, data : unknown, msg: string, status = 400) => {
    res.status(status).json({ status: status, message: msg, result : data})
}

export default SendResponse;