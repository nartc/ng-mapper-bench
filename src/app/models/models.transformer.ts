import {Expose, Transform, Type} from "class-transformer";

export class TransformBio {
    job: string;
    age: number;
    birthday: Date;
}

export class TransformUser {
    firstName: string;
    lastName: string;
    bio: TransformBio;
}

export class TransformBioVm {
    @Expose()
    job: string;
    @Expose()
    @Transform(({obj}) => obj.age > 18, {toClassOnly: true})
    isAdult: boolean;
    @Expose()
    @Transform(({value}) => value.toDateString())
    birthday: string;
}

export class TransformUserVm {
    @Expose({name: 'firstName'})
    first: string;
    @Expose({name: 'lastName'})
    last: string;

    @Expose()
    @Transform(({obj}) => obj.firstName + ' ' + obj.lastName, {toClassOnly: true})
    full: string;

    @Expose()
    @Type(() => TransformBioVm)
    bio: TransformBioVm;
}
