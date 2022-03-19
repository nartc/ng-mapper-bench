import {PojosMetadataMap} from "@automapper/pojos";

export interface BioInterface {
    job: string;
    age: number;
    birthday: Date;
}

export interface UserInterface {
    firstName: string;
    lastName: string;
    bio: BioInterface;
}

export interface BioVmInterface {
    job: string;
    isAdult: boolean;
    birthday: string;
}

export interface UserVmInterface {
    first: string;
    last: string;
    full: string;
    bio: BioVmInterface;
}

export function runMetadata() {
    PojosMetadataMap.create<BioInterface>('Bio', {
        age: Number,
        job: String,
        birthday: Date
    })

    PojosMetadataMap.create<BioVmInterface>('BioVm', {
        birthday: String,
        isAdult: Boolean,
        job: String
    })

    PojosMetadataMap.create<UserInterface>('User', {
        bio: 'Bio',
        firstName: String,
        lastName: String
    })

    PojosMetadataMap.create<UserVmInterface>('UserVm', {
        first: String,
        last: String,
        full: String,
        bio: 'BioVm'
    })
}
