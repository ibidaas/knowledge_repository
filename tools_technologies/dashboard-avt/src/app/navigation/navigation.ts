import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'dashboard',
                title    : 'dashboard',
                translate: 'NAV.IBIDAAS.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/ibidaas',
                badge    : {
                    title    : '25',
                    translate: 'NAV.IBIDAAS.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    }
];
