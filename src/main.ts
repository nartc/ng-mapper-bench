import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {Bio, User} from "./app/models/models";
import {OldBio, OldUser} from "./app/models/models-old";
import {TransformBio, TransformUser} from "./app/models/models.transformer";
import {OldUsersToken, TransformUsersToken, UsersToken} from "./constants";
import {environment} from './environments/environment';

if (environment.production) {
    enableProdMode();
}

const users = [];
const oldUsers = [];
const transformUsers = [];

for (let i = 0; i < 10000; i++) {
    const user = new User();
    user.firstName = 'Chau' + i;
    user.lastName = 'Tran' + i;
    user.bio = new Bio();
    user.bio.age = i + 1;
    user.bio.job = 'dev' + i;
    user.bio.birthday = new Date();
    users.push(user);

    const oldUser = new OldUser()
    oldUser.firstName = 'Old Chau' + i;
    oldUser.lastName = 'Old Tran' + i;
    oldUser.bio = new OldBio();
    oldUser.bio.age = i + 1;
    oldUser.bio.job = 'old dev' + i;
    oldUser.bio.birthday = new Date();
    oldUsers.push(oldUser)

    const transformUser = new TransformUser()
    transformUser.firstName = 'Old Chau' + i;
    transformUser.lastName = 'Old Tran' + i;
    transformUser.bio = new TransformBio();
    transformUser.bio.age = i + 1;
    transformUser.bio.job = 'old dev' + i;
    transformUser.bio.birthday = new Date();
    transformUsers.push(oldUser)
}

platformBrowserDynamic([
    {provide: UsersToken, useValue: users},
    {provide: OldUsersToken, useValue: oldUsers},
    {provide: TransformUsersToken, useValue: transformUsers},
]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
