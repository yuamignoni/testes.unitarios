import { IUsersRepository } from '../../repositories/IUsersRepository';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { User } from "../../entities/User";
import { ShowUserProfileError } from "./ShowUserProfileError";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;

describe('Show User Profile Tests', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it('should be able to show user profile', async () => {
        const user = await usersRepository.create({
            name: 'Jest',
            email: 'jest@gmail.com',
            password: 'jest'
        });

        const userProfile = await showUserProfileUseCase.execute(user.id);

        expect(userProfile.name).toEqual(user.name);
        expect(userProfile.email).toEqual(user.email);
        expect(userProfile.password).toEqual(user.password);

    });

});