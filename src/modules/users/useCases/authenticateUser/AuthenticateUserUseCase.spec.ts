import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let authenticateUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe('User Authentication Tests', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        authenticateUseCase = new AuthenticateUserUseCase(usersRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it('should be able to authenticate', async () => {
        const user = await createUserUseCase.execute({
            name: 'jest',
            email: 'jest@jest.com',
            password: 'jest'
        });

        const authUser = await authenticateUseCase.execute({
            email: 'jest@jest.com',
            password: 'jest'
        });

        expect(authUser).toHaveProperty('token');
    });

});