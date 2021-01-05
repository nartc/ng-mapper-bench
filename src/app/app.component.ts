import {Component, Inject, NgZone} from '@angular/core';
import {classes} from "@automapper/classes";
import {CamelCaseNamingConvention, createMapper, mapFrom} from "@automapper/core";
import {pojos} from "@automapper/pojos";
import {mapFrom as oldMapFrom, Mapper} from '@nartc/automapper';
import {plainToClass} from "class-transformer";
import {morphism} from "morphism";
import 'reflect-metadata';
import {defer, of, timer} from "rxjs";
import {switchMapTo} from "rxjs/operators";
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
        <p>
            {{isExecuting ? 'executing...' : 'waiting. open your console'}}
        </p>

        <input type="text" [(ngModel)]="times" placeholder="how many iterations?">
        <br>
        <br>
        <button (click)="map(1)">map</button>
        <br>
        <br>
        <button (click)="map(2)">mapMorphism</button>
        <br>
        <br>
        <button (click)="map(3)">mapMorphismWithMapper</button>
        <br>
        <br>
        <button (click)="map(4)">mapClassTransformer</button>
        <br>
        <br>
        <button (click)="map(5)">mapClassTransformerIterative</button>
        <br>
        <br>
        <button (click)="map(6)">classMapperMap</button>
        <br>
        <br>
        <button (click)="map(7)">pojosMapperMap</button>
        <br>
        <br>
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
    transformIterativeMapperTimes = []

    isExecuting = false;

    mapperMap: { [key: number]: [Function, any[], string] } = {
        1: [this.mapMapper.bind(this), this.mapperTimes, '@nartc/automapper'],
        2: [this.mapMorphism.bind(this), this.mapMorphismTimes, 'morphism'],
        3: [this.mapMorphismWithMapper.bind(this), this.mapMorphismWithMapperTimes, 'morphism (with mapper)'],
        4: [this.mapTransform.bind(this), this.transformIterativeMapperTimes, 'class-transformer'],
        5: [this.mapTransformIterative.bind(this), this.transformMapperTimes, 'class-transformer (iterative)'],
        6: [this.mapClassMapper.bind(this), this.classMapperTimes, '@automapper/classes'],
        7: [this.mapPojosMapper.bind(this), this.pojosMapperTimes, '@automapper/pojos'],
    };

    constructor(@Inject(UsersToken) private users: User[], @Inject(OldUsersToken) private oldUsers: OldUser[], @Inject(TransformUsersToken) private transformUsers: TransformUser[], private ngZone: NgZone) {
    }

    all() {
        this.isExecuting = true;
        timer(0).pipe(
            switchMapTo(defer(() => {
                const tabularData = [];

                this.ngZone.runOutsideAngular(() => {
                    this.mapInternal(1, false)
                    this.mapInternal(2, false)
                    this.mapInternal(3, false)
                    this.mapInternal(4, false)
                    this.mapInternal(5, false)
                    this.mapInternal(6, false)
                    this.mapInternal(7, false)

                    this.pushTo(1, tabularData);
                    this.pushTo(2, tabularData);
                    this.pushTo(3, tabularData);
                    this.pushTo(4, tabularData);
                    this.pushTo(5, tabularData);
                    this.pushTo(6, tabularData);
                    this.pushTo(7, tabularData);
                })

                return of(tabularData)
            }))
        ).subscribe(data => {
            console.table(data)
            this.isExecuting = false;
        })
    }

    pushTo(type, tabularData) {
        tabularData.push({
            name: this.mapperMap[type][2],
            value: this.toMs(this.mapperMap[type][1].reduce((acc, cur) => acc + cur) / this.mapperMap[type][1].length)
        })
    }

    map(type: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
        this.mapInternal(type);
    }

    mapInternal(type: 1 | 2 | 3 | 4 | 5 | 6 | 7, log = true) {
        const times = Number(this.times);

        if (isNaN(times)) {
            return;
        }

        let i = times;
        while (i--) {
            this.mapperMap[type][0](i, times, log);
        }

        if (log) {
            console.log('Average ', this.toMs(this.mapperMap[type][1].reduce((acc, cur) => acc + cur) / this.mapperMap[type][1].length));
        }
    }

    mapTransform(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = plainToClass(TransformUserVm, this.transformUsers, {excludeExtraneousValues: true})
        const t1 = performance.now();

        if (log) {
            console.log(`transform mapper ${times - iteration}`, this.toMs((t1 - t0)), vms);
        }
        this.transformMapperTimes.push(t1 - t0);
    }

    mapTransformIterative(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = []

        let i = this.transformUsers.length;
        while(i--) {
            vms.push(plainToClass(TransformUserVm, this.transformUsers[i], {excludeExtraneousValues: true}))
        }

        const t1 = performance.now();

        if (log) {
            console.log(`transform iterative mapper ${times - iteration}`, this.toMs((t1 - t0)), vms);
        }
        this.transformIterativeMapperTimes.push(t1 - t0);
    }

    mapClassMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = classMapper.mapArray(this.users, UserVm, User)
        const t1 = performance.now();

        if (log) {
            console.log(`class mapper ${times - iteration}`, this.toMs((t1 - t0)), vms);
        }
        this.classMapperTimes.push(t1 - t0);
    }

    mapPojosMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = pojosMapper.mapArray(this.users, 'UserVm', 'User')
        const t1 = performance.now();

        if (log) {
            console.log(`pojos mapper ${times - iteration}`, this.toMs((t1 - t0)), vms);
        }
        this.pojosMapperTimes.push(t1 - t0);
    }

    mapMapper(iteration: number, times: number, log = true) {
        const t0 = performance.now();
        const vms = Mapper.mapArray(this.oldUsers, OldUserVm);
        const t1 = performance.now();
        if (log) {
            console.log(`mapper ${times - iteration}`, this.toMs((t1 - t0)), vms);
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
            console.log(`mapper-morphism ${times - iteration}`, this.toMs((t1 - t0)), vmsMorp);
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
            console.log(`mapper-morphism-create-mapper ${times - iteration}`, this.toMs((t1 - t0)), vmsMorpMapper);
        }
        this.mapMorphismWithMapperTimes.push(t1 - t0);
    }

    toMs(range: number) {
        return range.toFixed(4) + 'ms'
    }
}
