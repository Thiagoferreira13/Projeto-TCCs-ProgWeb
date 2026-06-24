import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Cursos } from './features/cursos/cursos';
import { Departamentos } from './features/departamentos/departamentos';
import { Tccs } from './features/tccs/tccs-list/tccs-list';
import { TccCreate } from './features/tccs/tcc-create/tcc-create';
import { TccEdit } from './features/tccs/tcc-edit/tcc-edit';
import { TccDetails } from './features/tccs/tcc-details/tcc-details';
import { UnidadesAcademicas } from './features/unidades-academicas/unidades-academicas';
import { AlunosList } from './features/alunos/alunos-list/alunos-list';
import { ProfessoresList } from './features/professores/professores-list/professores-list';

export const routes: Routes = [
    {
        path: "",
        component: MainLayout,
        children: [
            {
                path: "",
                component: Dashboard
            },
            {
                path: "alunos",
                component: AlunosList
            },
            {
                path: "cursos",
                component: Cursos
            },
            {
                path: "departamentos",
                component: Departamentos
            },
            {
                path: "professores",
                component: ProfessoresList
            },
            {
                path: "tccs",
                component: Tccs
            },
            {
                path: "tccs/novo",
                component: TccCreate
            },
            {
                path: "tccs/:id/editar",
                component: TccEdit
            },
            {
                path: "tccs/:id/detalhes",
                component: TccDetails
            },
            {
                path: "unidades-academicas",
                component: UnidadesAcademicas
            }
        ]
    }
];
