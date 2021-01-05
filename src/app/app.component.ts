import {Component, Inject} from '@angular/core';
import {classes} from "@automapper/classes";
import {CamelCaseNamingConvention, createMapper, mapFrom} from "@automapper/core";
import {pojos} from "@automapper/pojos";
import {mapFrom as oldMapFrom, Mapper} from '@nartc/automapper';
import {plainToClass} from "class-transformer";
import {morphism} from "morphism";
import 'reflect-metadata';
import {OldUsersToken, TransformUsersToken, UsersToken} from "../constants";
import {Bio, BioVm, User, UserVm} from "./models/models";
import {OldBio, OldBioVm, OldUser, OldUserVm} from './models/models-old';
import {BioInterface, BioVmInterface, runMetadata, UserInterface, UserVmInterface} from "./models/models.interface";
import {TransformUser, TransformUserVm} from "./models/models.transformer";

const classMapper = createMapper({
    name: 'class',
    pluginInitializer: classes,
    namingConventions: new CamelCaseNamingConvention()
})

classMapper.createMap(Bio, BioVm)
    .forMember(d => d.isAdult, mapFrom(s => s.age > 18))
    .forMember(d => d.birthday, mapFrom(s => s.birthday.toDateString()));
classMapper.createMap(User, UserVm)
    .forMember(d => d.first, mapFrom(s => s.firstName))
    .forMember(d => d.last, mapFrom(s => s.lastName))
    .forMember(d => d.full, mapFrom(s => s.firstName + ' ' + s.lastName));

const pojosMapper = createMapper({
    name: 'pojos',
    pluginInitializer: pojos,
    namingConventions: new CamelCaseNamingConvention()
})

runMetadata()

pojosMapper.createMap<BioInterface, BioVmInterface>('Bio', 'BioVm')
    .forMember(d => d.isAdult, mapFrom(s => s.age > 18))
    .forMember(d => d.birthday, mapFrom(s => s.birthday.toDateString()));
pojosMapper.createMap<UserInterface, UserVmInterface>('User', 'UserVm')
    .forMember(d => d.first, mapFrom(s => s.firstName))
    .forMember(d => d.last, mapFrom(s => s.lastName))
    .forMember(d => d.full, mapFrom(s => s.firstName + ' ' + s.lastName));

Mapper.createMap(OldUser, OldUserVm)
    .forMember(d => d.first, oldMapFrom(s => s.firstName))
    .forMember(d => d.last, oldMapFrom(s => s.lastName))
    .forMember(d => d.full, oldMapFrom(s => s.firstName + ' ' + s.lastName));
Mapper.createMap(OldBio, OldBioVm)
    .forMember(d => d.job, oldMapFrom(s => s.job))
    .forMember(d => d.isAdult, oldMapFrom(s => s.age > 18))
    .forMember(d => d.birthday, oldMapFrom(s => s.birthday.toDateString()));

@Component({
    selector: 'app-root',
    template: `
        <!--The content below is only a placeholder and can be replaced.-->
        <input type="text" [(ngModel)]="times">
        <button (click)="map(1)">map</button>
        <button (click)="map(2)">mapMorphism</button>
        <button (click)="map(3)">mapMorphismWithMapper</button>
        <button (click)="map(4)">mapClassTransformer</button>
        <button (click)="map(5)">classMapperMap</button>
        <button (click)="map(6)">pojosMapperMap</button>
        <button (click)="all()">All</button>
    `,
    styles: []
})
export class AppComponent {
    title = 'ng-automapper-bench';

    times = '20';
    mapperTimes = [];
    mapMorphismTimes = [];
    mapMorphismWithMapperTimes = [];
    classMapperTimes = [];
    pojosMapperTimes = []
    transformMapperTimes = []

    mapperMap: { [key: number]: [Function, any[], string] } = {
        1: [this.mapMapper.bind(this), this.mapperTimes, '@nartc/automapper'],
        2: [this.mapMorphism.bind(this), this.mapMorphismTimes, 'morphism'],
        3: [this.mapMorphismWithMapper.bind(this), this.mapMorphismWithMapperTimes, 'morphism (with mapper)'],
        4: [this.mapTransform.bind(this), this.transformMapperTimes, 'class-transformer'],
        5: [this.mapClassMapper.bind(this), this.classMapperTimes, '@automapper/classes'],
        6: [this.mapPojosMapper.bind(this), this.pojosMapperTimes, '@automapper/pojos'],
    };

    constructor(@Inject(UsersToken) private users: User[], @Inject(OldUsersToken) private oldUsers: OldUser[], @Inject(TransformUsersToken) private transformUsers: TransformUser[]) {
    }

    all() {
        this.mapInternal(1, false)
        this.mapInternal(2, false)
        this.mapInternal(3, false)
        this.mapInternal(4, false)
        this.mapInternal(5, false)
        this.mapInternal(6, false)

        const tabularData = [];
        this.pushTo(1, tabularData);
        this.pushTo(2, tabularData);
        this.pushTo(3, tabularData);
        this.pushTo(4, tabularData);
        this.pushTo(5, tabularData);
        this.pushTo(6, tabularData);

        console.table(tabularData)
    }

    pushTo(type, tabularData) {
        tabularData.push({
            name: this.mapperMap[type][2],
            value: this.mapperMap[type][1].reduce((acc, cur) => acc + cur) / this.mapperMap[type][1].length
        })
    }

    map(type: 1 | 2 | 3 | 4 | 5 | 6) {
        this.mapInternal(type);
    }

    mapInternal(type: 1 | 2 | 3 | 4 | 5 | 6, log = true) {
        const times = Number(this.times);

        if (isNaN(times)) {
            return;
        }

        let i = times;
        while (i--) {
            this.mapperMap[type][0](i, times, log);
        }

        if (log) {
            console.log('Average ', this.mapperMap[type][1].reduce((acc, cur) => acc + cur) / this.mapperMap[type][1].length);
        }
    }

    mapTransform(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = plainToClass(TransformUserVm, this.transformUsers, {excludeExtraneousValues: true})
        const t1 = performance.now();

        if (log) {
            console.log(`transform mapper ${times - iteration}`, (t1 - t0).toFixed(4) + 'ms', vms);
        }
        this.transformMapperTimes.push(t1 - t0);
    }

    mapClassMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = classMapper.mapArray(this.users, UserVm, User)
        const t1 = performance.now();

        if (log) {
            console.log(`class mapper ${times - iteration}`, (t1 - t0).toFixed(4) + 'ms', vms);
        }
        this.classMapperTimes.push(t1 - t0);
    }

    mapPojosMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = pojosMapper.mapArray(this.users, 'UserVm', 'User')
        const t1 = performance.now();

        if (log) {
            console.log(`pojos mapper ${times - iteration}`, (t1 - t0).toFixed(4) + 'ms', vms);
        }
        this.pojosMapperTimes.push(t1 - t0);
    }

    mapMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = Mapper.mapArray(this.oldUsers, OldUserVm);
        const t1 = performance.now();
        if (log) {
            console.log(`mapper ${times - iteration}`, (t1 - t0).toFixed(4) + 'ms', vms);
        }
        this.mapperTimes.push(t1 - t0);
    }

    mapMorphism(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vmsMorp = morphism({
            first: 'firstName',
            last: 'lastName',
            full: ({firstName, lastName}: any) => firstName + ' ' + lastName,
            bio: {
                job: 'bio.job',
                isAdult: ({bio}: any) => bio.age > 18,
                birthday: ({bio}: any) => bio.birthday.toDateString()
            }
        }, this.users);
        const t1 = performance.now();
        if (log) {
            console.log(`mapper-morphism ${times - iteration}`, (t1 - t0).toFixed(4) + 'ms', vmsMorp);
        }
        this.mapMorphismTimes.push(t1 - t0);
    }

    mapMorphismWithMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const mapper = morphism({
            first: 'firstName',
            last: 'lastName',
            full: ({firstName, lastName}: any) => firstName + ' ' + lastName,
            bio: {
                job: 'bio.job',
                isAdult: ({bio}: any) => bio.age > 18,
                birthday: ({bio}: any) => bio.birthday.toDateString()
            }
        });

        const vmsMorpMapper = mapper(this.users);
        const t1 = performance.now();
        if (log) {
            console.log(`mapper-morphism-create-mapper ${times - iteration}`, (t1 - t0).toFixed(4) + 'ms', vmsMorpMapper);
        }
        this.mapMorphismWithMapperTimes.push(t1 - t0);
    }
}
