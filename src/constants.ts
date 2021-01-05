import {InjectionToken} from '@angular/core';
import {User} from "./app/models/models";
import {OldUser} from "./app/models/models-old";
import {TransformUser} from "./app/models/models.transformer";

export const UsersToken = new InjectionToken<User[]>('USERS');
export const OldUsersToken = new InjectionToken<OldUser[]>('OLD_USERS');
export const TransformUsersToken = new InjectionToken<TransformUser[]>('TRANSFORM_USERS');
