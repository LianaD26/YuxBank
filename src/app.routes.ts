import { Routes } from '@angular/router';
import { HomeComponent } from './app/features/home/home.component';
import { ProductsComponent } from './app/features/products/products.component';
import { RegisterAccountComponent } from './app/features/products/register-account/register-account.component';
import { ViewAccountsComponent } from './app/features/products/view-accounts/view-accounts.component';
import { TransfersComponent } from './app/features/transfers/transfers.component';
import { LimitsComponent } from './app/features/limits/limits.component';
import { PocketsComponent } from './app/features/pockets/pockets.component';
import { SettingsComponent } from './app/features/settings/settings.component';
import { AccountStatementComponent } from './app/features/settings/account-statement/account-statement.component';
import { PasswordChangeComponent } from './app/features/settings/password-change/password-change.component';
import { LayoutComponent } from './app/shared/layout/layout.component';
import { HistoryComponent } from './app/features/transfers/history/history.component';
import { TransferComponent } from './app/features/transfers/transfer/transfer.component';
import { RegisterComponent } from './app/features/register/register.component';
import { LogInComponent } from './app/features/log-in/log-in.component';
import { LayoutHomeComponent } from './app/shared/layout-home/layout-home.component';
import { RecoverPasswordComponent } from './app/features/recover-password/recover-password.component';
import { RecoverPasswordConfirmComponent } from './app/features/recover-password-confirm/recover-password-confirm.component';

export const routes: Routes = [
  //paginas independientes
  {path:"recover-password", component: RecoverPasswordComponent},
  {path:"recover-password-confirm",component: RecoverPasswordConfirmComponent},
  
  // LayoutHome para autenticación
  {
    path: '',
    component: LayoutHomeComponent,
    children: [
      {path: '', component: HomeComponent},  //{ path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'log-in', component: LogInComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'recover-password', component: RecoverPasswordComponent },
    ]
  },

  // Layout principal
  {
    path: '',
    component: LayoutComponent,
    children: [
      //{ path: '', redirectTo: 'login', pathMatch: 'full' }, //{ path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent, children: [
        { path: 'register', component: RegisterAccountComponent },
        { path: 'view', component: ViewAccountsComponent },
      ]},
      { path: 'settings', component: SettingsComponent, children: [
        { path: 'password_change', component: PasswordChangeComponent },
        { path: 'account_statement', component: AccountStatementComponent },
      ]},
      { path: 'transfers', component: TransfersComponent, children: [
        { path: 'history', component: HistoryComponent },
        { path: 'transfer', component: TransferComponent }
      ]},
      { path: 'limits', component: LimitsComponent },
      { path: 'pockets', component: PocketsComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];

