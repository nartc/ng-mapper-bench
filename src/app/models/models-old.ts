import {AutoMap} from "@nartc/automapper";

export class OldBio {
    @AutoMap()
    job!: string;
    @AutoMap()
    age!: number;
    @AutoMap(() => Date)
    birthday!: Date;
}

export class OldUser {
    @AutoMap()
    firstName!: string;
    @AutoMap()
    lastName!: string;
    @AutoMap(() => OldBio)
    bio!: OldBio;
}

export class OldBioVm {
    @AutoMap()
    job!: string;
    @AutoMap()
    isAdult!: boolean;
    @AutoMap()
    birthday!: string;
}

export class OldUserVm {
    @AutoMap()
    first!: string;
    @AutoMap()
    last!: string;
    @AutoMap()
    full!: string;
    @AutoMap(() => OldBioVm)
    bio!: OldBioVm;
}
