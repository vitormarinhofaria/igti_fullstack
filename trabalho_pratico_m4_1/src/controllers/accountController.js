import express from "express";
import mongoose from "mongoose";
import AccountSchema from "../models/account.js";

const TAXAS = {
    saque: 1,
    transferencia: 8
}

export async function Get(request, response) {
    response.json({ message: "Sucesso Get" });
}

export async function Post(request, response) {
    response.json({ message: "Sucesso Post" });
}

export async function Put(request, response) {
    response.json({ message: "Sucesso Put" });
}

export async function Delete(request, response) {
    response.json({ message: "Sucesso Delete" });
}

//4 - Crie um endpoint para registrar um deposito em uma conta
export async function Deposit(request, response) {
    const accounts = await mongoose.model('account', AccountSchema);
    const depositData = request.body.depositData;

    let acc = await accounts.findOne({ agencia: depositData.agencia, conta: depositData.conta });
    console.log(acc);

    if (acc) {
        acc.balance = acc.balance + depositData.valor;
        await accounts.findByIdAndUpdate({ _id: acc.id }, acc);
        response.statusCode = 200;
        response.json({ newBalance: acc.balance, favorecido: acc.name });
    } else {
        response.statusCode = 404;
        response.json({ Error: `Account ${depositData.conta} not found in agency ${depositData.agencia}. \n Please check your data and try again.` });
    }
}

//5 - Crie um endpoint para registrar um saque em uma conta.
export async function Withdraw(request, response) {
    const accounts = mongoose.model('account', AccountSchema);
    const withdrawData = request.body.withdrawData;

    let acc = await accounts.findOne({ agencia: withdrawData.agencia, conta: withdrawData.conta });
    console.log(acc);

    if (acc) {
        let deductValue = withdrawData.valor + TAXAS.saque
        if (acc.balance >= deductValue) {
            acc.balance = acc.balance - deductValue;
            await accounts.findByIdAndUpdate({ _id: acc.id }, acc);
            response.statusCode = 200;
            response.json({ Balance: acc.balance, Titula: acc.name, ValorSacado: withdrawData.valor });
        } else {
            response.statusCode = 500;
            response.json({ Error: `${acc.name} não possui saldo nescecssario. \n Saldo disponivel: ${acc.balance}` });
        }
    } else {
        response.statusCode = 404;
        response.json({ Error: `Account ${withdrawData.conta} not found in agency ${withdrawData.agencia}. \n Please check your data and try again.` });
    }
}

//6 - Crie um endpoint para consultar o saldo da conta
export async function CheckBalance(request, response) {

    try {
        const { agenciaNum, contaNum } = extractAgencyAccountNumFromHeaders(request.headers);

        const accounts = mongoose.model('account', AccountSchema);

        let acc = await accounts.findOne({ agencia: agenciaNum, conta: contaNum });
        console.log(acc);

        if (acc) {
            response.statusCode = 200;
            response.json({ Saldo: acc.balance, Titular: acc.name });
        } else {
            response.statusCode = 404;
            response.json({ Error: `Account ${contaNum} not found in agency ${agenciaNum}. Please check your data and try again.` });
        }

    } catch (e) {
        response.statusCode = 400;
        response.json({ Error: e });
    }
}

//7 - Crie um endpoint para excluir uma conta
export async function DeleteAccount(request, response) {
    try {
        const { agenciaNum, contaNum } = extractAgencyAccountNumFromHeaders(request.headers);

        const accounts = mongoose.model('account', AccountSchema);

        const deletedAccount = await accounts.findOneAndDelete({ agencia: agenciaNum, conta: contaNum });
        const allAccounts = await accounts.find({agencia: agenciaNum});
        response.statusCode = 200;
        response.json({ DeletedAccount: deletedAccount, Message: `Numero de clientes ativos: ${allAccounts.length}` });
    } catch (error) {
        response.statusCode = 400;
        response.json({ Error: error });
    }
}

//8 - Crie um endpoint para realizar transferências entre contas
export async function TrasferValue(request, response) {
    const accounts = mongoose.model('account', AccountSchema);
    const { transferData } = request.body;

    let transferFrom = await accounts.findOne({ conta: transferData.from });
    let transferTo = await accounts.findOne({ conta: transferData.to });

    if (transferFrom != null && transferTo != null) {
        const deductValue = transferData.value + TAXAS.transferencia;
        if (transferFrom.balance >= deductValue) {

            if (transferFrom.agencia === transferTo.agencia) {
                transferFrom.balance = transferFrom.balance - transferData.value;
            } else {
                transferFrom.balance = transferFrom.balance - deductValue;
            }
            transferTo.balance = transferTo.balance + transferData.value;

            await transferTo.save();
            await transferFrom.save();

            response.statusCode = 200;
            response.json({ De: transferFrom, Para: transferTo });
        } else {
            response.statusCode = 300;
            response.json({ Error: `Saldo de ${transferFrom.name} insuficiente para transferencia. Saldo disponivel: ${transferFrom.balance}` });
        }
    } else {
        response.statusCode = 404;
        response.json({ Error: "Conta(s) não encontrada(s)" });
    }
}

//9 - Crie um endpoint para consultar a média do saldo dos clientes de determinada agência.
export async function GetMediaAgencia(request, response) {
    const accounts = mongoose.model('account', AccountSchema);

    const { agencia } = request.params;

    const allAccounts = await accounts.find({ agencia: agencia });
    const allBalanceSum = allAccounts.reduce((soma, conta) => {
        return soma += conta.balance;
    }, 0);
    const media = allBalanceSum / allAccounts.length;

    response.statusCode = 200;
    response.json({ Message: `Média do saldo dos clientes da agencia ${agencia} é ${media}` });
}

//10 - Crie um endpoint para consultar os clientes com o menor saldo em conta.
export async function GetLowestBalance(request, response) {
    const accounts = mongoose.model('account', AccountSchema);

    let { maxList } = request.params;
    const allAccounts = await accounts.find({});

    let maxListAccounts = getAllClientsSorted(allAccounts, maxList, false);
    response.statusCode = 200;
    response.json(maxListAccounts);
}

//11 - Crie um endpoint para consultar os clientes mais ricos do banco.
export async function GetHighestBalance(request, response) {
    const accounts = mongoose.model('account', AccountSchema);

    let { maxList } = request.params;
    const allAccounts = await accounts.find({});

    const maxListAccounts = getAllClientsSorted(allAccounts, maxList, true);
    response.statusCode = 200;
    response.json(maxListAccounts);
}

//12 - Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada agência para a agência private agencia=99.
export async function TransferClientsToPrivateAgency(request, response) {
    const accounts = mongoose.model('account', AccountSchema);

    const allAccounts = await accounts.find({});

    let agencies = [];

    allAccounts.forEach((client) => {
        if(agencies.includes(client.agencia, 0) === false){
            agencies.push(client.agencia);
        }
    });

    let private_clients = [];

    agencies.forEach(async (agen) => {
        let agencyClients = allAccounts.filter((client) => client.agencia === agen).sort((a, b) => b.balance - a.balance);
        let pClient = agencyClients[0];
        pClient.agencia = 99;
        // await pClient.save();
        // console.log(pClient);
        await accounts.findOneAndUpdate({_id: pClient.id}, pClient);
    });

    let private_clients2 = await accounts.find({agencia: 99});
    private_clients2.sort((a, b) => b.balance - a.balance);
    response.json(private_clients2);
}


function extractAgencyAccountNumFromHeaders(headers) {
    const { agencia, conta } = headers;

    let agenciaNum = parseInt(agencia);
    let contaNum = parseInt(conta);

    if (isNaN(agenciaNum) || isNaN(contaNum)) {
        throw "Headers 'agencia' e 'conta' devem ser valores numericos inteiros";
    } else {
        return { agenciaNum, contaNum }
    }
}

function getAllClientsSorted(allAccounts, maxList, decreasing) {
    const orderedAccounts = decreasing ? allAccounts.sort((a, b) => b.balance - a.balance) : allAccounts.sort((a, b) => a.balance - b.balance)

    let maxListAccounts = [];

    if (maxList > orderedAccounts.length) {
        maxList = orderedAccounts.length;
    }
    for (let i = 0; i < maxList; i++) {
        maxListAccounts.push(orderedAccounts[i]);
    }

    return maxListAccounts;
}