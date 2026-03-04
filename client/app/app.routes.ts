import { Routes } from '@angular/router';
// import { LoggedInGuardService } from '../services/logged-in-guard.service';


export const routes: Routes = [
    { path: '', redirectTo: 'start', pathMatch: 'full' },
    {
        path: 'start',
        loadComponent: () =>
            import('./start/start.component').then((m) => m.StartComponent),
    },
    {
        path: 'home',
        loadComponent: () =>
            import('./school/school.component').then((m) => m.SchoolComponent),
    },
    {
        path: 'admin',
        loadComponent: () =>
            import('./school/admin/admin.component').then((m) => m.AdminComponent),
    },
    {
        path: 'teacher',
        loadComponent: () =>
            import('./school/teacher/teacher.component').then((m) => m.TeacherComponent),
    },
    {
        path: 'teachers-table',
        loadComponent: () =>
            import('./teachers-table/teachers-table.component').then((m) => m.TeachersTableComponent),
    },
    {
        path: 'classes-table',
        loadComponent: () =>
            import('./classes-table/classes-table.component').then((m) => m.ClassesTableComponent),
    },
    {
        path: 'settings',
        loadComponent: () =>
            import('./settings/settings.component').then((m) => m.SettingsComponent),
    },


];
