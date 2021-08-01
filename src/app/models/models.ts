import {AutoMap} from "@automapper/classes";

export class Bio {
    @AutoMap()
    job!: string;
    @AutoMap()
    age!: number;
    @AutoMap()
    birthday!: Date;
}

export class User {
    @AutoMap()
    firstName!: string;
    @AutoMap()
    lastName!: string;
    @AutoMap({typeFn: () => Bio})
    bio!: Bio;

    get fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}

export class BioVm {
    @AutoMap()
    job!: string;
    @AutoMap()
    isAdult!: boolean;
    @AutoMap()
    birthday!: string;
}

export class UserVm {
    @AutoMap()
    first!: string;
    @AutoMap()
    last!: string;
    @AutoMap()
    full!: string;
    @AutoMap({typeFn: () => BioVm})
    bio!: BioVm;
}
