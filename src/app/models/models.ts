import {AutoMap} from "@automapper/classes";

export class Bio {
    @AutoMap()
    job: string;
    @AutoMap()
    age: number;
    @AutoMap()
    birthday: Date;
}

export class User {
    @AutoMap()
    firstName: string;
    @AutoMap()
    lastName: string;
    @AutoMap(() => Bio)
    bio: Bio;
}

export class BioVm {
    @AutoMap()
    job: string;
    @AutoMap()
    isAdult: boolean;
    @AutoMap()
    birthday: string;
}

export class UserVm {
    @AutoMap()
    first: string;
    @AutoMap()
    last: string;
    @AutoMap()
    full: string;
    @AutoMap(() => BioVm)
    bio: BioVm;
}
