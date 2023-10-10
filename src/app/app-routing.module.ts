import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import {SignInComponent} from "./components/user/sign-in/sign-in.component";
import {AuthGuardService} from "./components/user/services/auth-guard-service.service";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {ForgotPasswordComponent} from "./components/user/forgot-password/forgot-password.component";
import {VerifyEmailComponent} from "./components/user/verify-email/verify-email.component";
import {SignUpComponent} from "./components/user/sign-up/sign-up.component";
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { AdminListComponent } from './components/user/users-list/admin-list/admin-list.component';
import { SubListComponent } from './components/user/users-list/sub-list/sub-list.component';
import { DashboardExamensComponent } from './components/dashboard-examens/dashboard-examens.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudentComponent } from './components/student/student.component';
import { MatterComponent } from './components/matter/matter.component';
import { DefaultComponent } from './components/default/default.component';
import {RnComponent} from "./components/rn/rn.component";

export const routes: Routes = [
  { path: '', redirectTo: "dashboard", pathMatch: 'full' },
  { path: 'dashboard', canActivate: [AuthGuardService], component: DashboardComponent,
    data: { description: 'Accès au dashboard', component: 'DashboardComponent', roles: ['*'] } },
  { path: 'user/login', component: SignInComponent },
  { path: 'user/forgot-password', component: ForgotPasswordComponent },
  { path: 'user/verify-email-address', component: VerifyEmailComponent },
  { path: 'user/sign-up', component: SignUpComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès à la page nouvel utilisateur', component: 'SignUpComponent', roles: ['ADMIN_ROLE'] } },
  { path: 'users/detail/:uid', component: SignUpComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès au détail du profil connecté', component: 'SignUpComponent', roles: ['*'] } }, // [*] tout utilisateur connecté
  { path: 'users/list', component: UsersListComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès à la liste de tous les utilisateurs', component: 'UsersListComponent', roles: ['ADMIN_ROLE'] } },
  { path: 'users/list/admin', component: AdminListComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès à la liste des administrateurs', component: 'AdminListComponent', roles: ['ADMIN_ROLE'] } },
  { path: 'users/list/others', component: SubListComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès à la liste des autres utilisateurs', component: 'SubListComponent', roles: ['ADMIN_ROLE'] } },
  { path: 'dashboard_examens', component: DashboardExamensComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès au dashboard examen', component: 'DashboardExamensComponent', roles: ['*'] } },
  { path: 'shutters/teachers/list', component: TeacherComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès à la liste des enseignants', component: 'TeacherComponent', roles: ['ADMIN_ROLE'] } },
  { path: 'shutters/students/list', component: StudentComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès à la liste des étudiants', component: 'StudentComponent', roles: ['ADMIN_ROLE', 'TEACHER_ROLE'] } },
  { path: 'shutters/matters/list', component: MatterComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès aux modules d\'enseignement', component: 'MatterComponent', roles: ['ADMIN_ROLE', 'TEACHER_ROLE'] } },
  { path: 'shutters/rn/list/:uid', component: RnComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès aux relevés de notes', component: 'RnComponent', roles: ['ADMIN_ROLE', 'TEACHER_ROLE'] } },
  { path: 'default', component: DefaultComponent, canActivate: [AuthGuardService], outlet: 'dashboard', data: { description: 'Accès au dashboard examen', component: 'DefaultComponent', roles: ['*'] }},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
