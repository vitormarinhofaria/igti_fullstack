import express from "express";

import * as AccountController from "../controllers/accountController.js";

export const AccountRouter = express.Router();


AccountRouter.get('/', AccountController.Get);
AccountRouter.post('/', AccountController.Post);
AccountRouter.put('/', AccountController.Put);

AccountRouter.delete('/', AccountController.DeleteAccount);

AccountRouter.post('/deposit', AccountController.Deposit);
AccountRouter.post('/withdraw', AccountController.Withdraw);
AccountRouter.get('/check_balance', AccountController.CheckBalance);
AccountRouter.post('/transfer_value', AccountController.TrasferValue);
AccountRouter.get('/media/:agencia', AccountController.GetMediaAgencia);
AccountRouter.get('/lowest_balance/:maxList', AccountController.GetLowestBalance);
AccountRouter.get('/highest_balance/:maxList', AccountController.GetHighestBalance);
AccountRouter.get('/private_clients', AccountController.TransferClientsToPrivateAgency);
