import {createMetadataMap} from "@automapper/pojos";

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
    createMetadataMap<BioInterface>('Bio', {
        age: Number,
        job: String,
        birthday: Date
    })

    createMetadataMap<BioVmInterface>('BioVm', {
        birthday: String,
        isAdult: Boolean,
        job: String
    })

    createMetadataMap<UserInterface>('User', {
        bio: 'Bio',
        firstName: String,
        lastName: String
    })

    createMetadataMap<UserVmInterface>('UserVm', {
        first: String,
        last: String,
        full: String,
        bio: 'BioVm'
    })
}
