import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
    {
        routeLink: '',
        icon: 'home',
        label: 'Administración',
        items: [
            {
                routeLink: 'cargos',
                icon: 'work',
                label: 'Tipos de cargos '
            },
            {
                routeLink: 'asociados',
                icon: 'account_circle',
                label: 'Asociados',
            },
            {
                routeLink: 'periodos',
                icon: 'calendar_today',
                label: 'Periodos',
            },
            {
                routeLink: 'miembros',
                icon: 'perm_identity',
                label: 'Miembros',
        
            },
        ]
    },
    {
        routeLink: '',
        icon: 'event_available',
        label: 'Actividades',
        items: [
            {
                routeLink: 'fiestas',
                icon: 'event_available',
                label: 'Fiesta Patronal'
            },
            {
                routeLink: 'principales',
                icon: 'event_available',
                label: 'Principales '
            },
            {
                routeLink: 'secundarias',
                icon: 'event_available',
                label: 'Secundarias'
            },
        ]
    },
    {
        routeLink: 'proyectos',
        icon: 'folder',
        label: 'Proyectos',

    },
    {
        routeLink: 'mobiliarios',
        icon: 'chair',
        label: 'Mobiliarios',

    },
    {
        routeLink: 'ingresos',
        icon: 'credit_card',
        label: 'Gastos',
        items:
            [
                {
                    routeLink: 'ingresos',
                    icon: '',
                    label: 'Ingresos',
                },
                {
                    routeLink: 'egresos',
                    icon: '',
                    label: 'Egresos',
                },
            ]
    },
    {
        routeLink: '',
        icon: 'view_list',
        label: 'Tipos',
        items: [
            {
                routeLink: 'tipo-ingresos',
                icon: 'fiber_manual_record"',
                label: 'Tipos de Ingresos',
            },
            {
                routeLink: 'tipo-egresos',
                icon: 'fiber_manual_record"',
                label: 'Tipos de Egresos',
            },
            {
                routeLink: 'tipo-actividades',
                icon: 'fiber_manual_record"',
                label: 'Tipos de Actividades',
            },
        ]
    }
    

]

