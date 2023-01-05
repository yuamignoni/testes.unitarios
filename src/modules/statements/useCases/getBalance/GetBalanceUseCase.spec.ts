
import { User } from '../../../users/entities/User';
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { OperationType } from '../../entities/Statement';

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe('Get Balance Tests', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementRepository = new InMemoryStatementsRepository();

        getBalanceUseCase = new GetBalanceUseCase(
            statementRepository,
            usersRepository
        );
    });

    it('should be able to list the user balance.', async () => {
        const user: User = await usersRepository.create({
            name: 'test',
            email: 'test@gmail.com',
            password: '123123'
        });

        const deposit = await statementRepository.create({
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 9999,
            description: 'Ganhei na mega'
        });

        const withdraw = await statementRepository.create({
            user_id: user.id,
            type: OperationType.WITHDRAW,
            amount: 1111,
            description: 'Todinho pra todo mundo'
        });

        const balance = await getBalanceUseCase.execute({
            user_id: user.id,
        });

        expect(balance).toStrictEqual({
            statement: expect.arrayContaining([deposit, withdraw]),
            balance: 8888,
        });
    });

    it('should not be able to list a balance for a non existent user', async () => {

        await expect(getBalanceUseCase.execute({
            user_id: 'josé3123',
        })).rejects.toBeInstanceOf(GetBalanceError);
    });

});