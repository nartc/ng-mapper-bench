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
    @Transform((_, obj) => obj.age > 18, {toClassOnly: true})
    isAdult: boolean;
    @Expose()
    @Transform(val => val.toDateString())
    birthday: string;
}

export class TransformUserVm {
    @Expose()
    @Transform((_, obj) => obj.firstName, {toClassOnly: true})
    first: string;
    @Expose()
    @Transform((_, obj) => obj.lastName, {toClassOnly: true})
    last: string;

    @Expose()
    get full() {
        return this.first + this.last;
    };

    @Expose()
    @Type(() => TransformBioVm)
    bio: TransformBioVm;
}
