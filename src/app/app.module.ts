import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase imports
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// DevExtreme imports
import {
  DevExtremeModule,
  DxCheckBoxModule,
  DxDateBoxModule,
  DxFormModule,
  DxListModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxTreeViewModule
} from 'devextreme-angular';
import { FileSaverModule } from 'ngx-filesaver';
import {environment} from "../environments/environment";
import {SignInComponent} from "./components/user/sign-in/sign-in.component";
import {AuthGuardService} from "./components/user/services/auth-guard-service.service";
import {UserComponent} from "./components/user/user.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {HttpClient, HttpClientModule, HttpHandler} from "@angular/common/http";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/user/verify-email/verify-email.component';
import {AuthService} from "./components/user/services/auth.service";
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import {HeadComponent} from "./components/head/head.component";
import { DelayPipe } from './shared/pipe/delay/delay.pipe';
import { LengthPipe } from './shared/pipe/length/length.pipe';
import {SwPush, ServiceWorkerModule} from "@angular/service-worker";
import {ShortPipe} from "./shared/pipe/short/short.pipe";
import {ToDatePipe} from "./shared/pipe/todate/todate.pipe";
import {DatestringPipe} from "./shared/pipe/datesrting/datestring.pipe";
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { PaginateTableComponent } from './components/user/users-list/paginate-table/paginate-table.component';
import { AdminListComponent } from './components/user/users-list/admin-list/admin-list.component';
import { SubListComponent } from './components/user/users-list/sub-list/sub-list.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardExamensComponent } from './components/dashboard-examens/dashboard-examens.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { MatterComponent } from './components/matter/matter.component';
import { StudentComponent } from './components/student/student.component';
import { DefaultComponent } from './components/default/default.component';
import { TabsComponent } from './components/user/users-list/tabs/tabs.component';
import {RnComponent} from "./components/rn/rn.component";
import {NoteComponent} from "./components/popup/note/note.component";
import { LogoComponent } from './components/logo/logo.component';
import {NgxPaginationModule} from "ngx-pagination";
import {DxoPagingModule} from "devextreme-angular/ui/nested";
import {UserPipe} from "./shared/pipe/user/user.pipe";



@NgModule({
    declarations: [
      AppComponent,
      UserComponent,
      SignInComponent,
      SignUpComponent,
      DashboardComponent,
      ForgotPasswordComponent,
      VerifyEmailComponent,
      SignUpComponent,
      HeadComponent,
      DelayPipe,
      ShortPipe,
      LengthPipe,
      ToDatePipe,
      DatestringPipe,
      UserPipe,
      UsersListComponent,
      PaginateTableComponent,
      AdminListComponent,
      SubListComponent,
      SidebarComponent,
      DashboardExamensComponent,
      TeacherComponent,
      MatterComponent,
      StudentComponent,
      DefaultComponent,
      TabsComponent,
      RnComponent,
      NoteComponent,
      LogoComponent
    ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    DxListModule,
    DxFormModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule,
    FileSaverModule,
    DevExtremeModule,
    DxTreeViewModule,
    NgxPaginationModule,
    DxoPagingModule,
    HttpClientModule
  ],
  exports: [
    DxCheckBoxModule,
    DxTextAreaModule,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    SwPush
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
