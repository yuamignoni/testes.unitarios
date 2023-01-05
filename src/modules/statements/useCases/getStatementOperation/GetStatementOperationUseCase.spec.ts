import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { User } from '../../../users/entities/User';
import { OperationType, Statement } from '../../entities/Statement';
import { GetStatementOperationError } from "./GetStatementOperationError";
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';


let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement Operation tests', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementRepository = new InMemoryStatementsRepository();

        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementRepository);
    });

    it('should be able to get a statement', async () => {
        const user: User = await usersRepository.create({
            name: 'test',
            email: 'test@gmail.com',
            password: '123123'
        });

        const createdStatement: Statement = await statementRepository.create({
            user_id: user.id,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: 'Test'
        });

        const checkStatement = await getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: createdStatement.id
        });

        expect(createdStatement).toBe(checkStatement);
    });

    it('should not be able to get a statement operation that doesnt exists', async () => {
        const user: User = await usersRepository.create({
            name: 'test',
            email: 'test@gmail.com',
            password: '123123'
        });

        await expect(getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: 'jest'
        })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});