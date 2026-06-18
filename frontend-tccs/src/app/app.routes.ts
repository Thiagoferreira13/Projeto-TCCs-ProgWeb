import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Alunos } from './features/alunos/alunos';
import { Cursos } from './features/cursos/cursos';
import { Departamentos } from './features/departamentos/departamentos';
import { Professores } from './features/professores/professores';
import { Tccs } from './features/tccs/tccs';
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
                path: "unidades-academicas",
                component: UnidadesAcademicas
            }
        ]
    }
];
