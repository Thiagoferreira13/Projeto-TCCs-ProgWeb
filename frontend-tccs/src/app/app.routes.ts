import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Alunos } from './features/alunos/alunos';
import { Cursos } from './features/cursos/cursos';
import { Departamentos } from './features/departamentos/departamentos';
import { Professores } from './features/professores/professores';
import { Tccs } from './features/tccs/tccs-list/tccs-list';
import { TccCreate } from './features/tccs/tcc-create/tcc-create';
import { TccEdit } from './features/tccs/tcc-edit/tcc-edit';
import { UnidadesAcademicas } from './features/unidades-academicas/unidades-academicas';

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
                component: Alunos
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
                component: Professores
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
                path: "unidades-academicas",
                component: UnidadesAcademicas
            }
        ]
    }
];
