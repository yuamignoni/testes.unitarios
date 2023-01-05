import { CreateStatementUseCase } from './CreateStatementUseCase';

import { OperationType } from '../../entities/Statement';

import { User } from '../../../users/entities/User';
import { CreateStatementError } from './CreateStatementError';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import UserNotFound = CreateStatementError.UserNotFound;
import InsufficientFunds = CreateStatementError.InsufficientFunds;

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe('Create Statement Tests', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementRepository = new InMemoryStatementsRepository();

        createStatementUseCase = new CreateStatementUseCase(
            usersRepository,
            statementRepository
        );
    });

    it('should be able to create a new statement.', async () => {
        const user = await usersRepository.create({
            name: 'test',
            email: 'test@gmail.com',
            password: '123123'
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 123321,
            description: 'venda de cupcakess'
        });

        expect(statement).toHaveProperty('id');
    });

    it('should not be able to create a new statement with non existent user', async () => {

        await expect(createStatementUseCase.execute({
            user_id: '99999',
            type: OperationType.DEPOSIT,
            amount: 51233,
            description: 'Tentando roubar o banco'
        })).rejects.toBeInstanceOf(UserNotFound);
    });

    it('should not be able to create a new statement with insufficient funds', async () => {
        const user: User = await usersRepository.create({
            name: 'test',
            email: 'test@gmail.com',
            password: '123123'
        });

        await expect(createStatementUseCase.execute({
            user_id: user.id,
            type: OperationType.WITHDRAW,
            amount: 912323,
            description: 'Tentantiva de roubar o bando número 2'
        })).rejects.toBeInstanceOf(InsufficientFunds);
    });
});