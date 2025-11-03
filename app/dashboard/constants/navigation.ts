import { VIEWS } from '../types';

export type IconType = 'home' | 'add' | 'menu' | 'upload';

interface NavItem {
    name: string;
    iconType: IconType;
    view: typeof VIEWS[keyof typeof VIEWS];
}

export const NAV_ITEMS: NavItem[] = [
    { 
        name: 'Browse Exams', 
        iconType: 'home', 
        view: VIEWS.BROWSE 
    },
    { 
        name: 'Create Test', 
        iconType: 'add', 
        view: VIEWS.CREATE 
    },
    { 
        name: 'My Results', 
        iconType: 'home', 
        view: VIEWS.RESULTS 
    },
    { 
        name: 'Profile', 
        iconType: 'home', 
        view: VIEWS.PROFILE 
    }
];