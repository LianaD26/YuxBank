import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { RegisterAccountComponent } from './features/products/register-account/register-account.component';
import { ViewAccountsComponent } from './features/products/view-accounts/view-accounts.component';
import { TransfersComponent } from './features/transfers/transfers.component';
import { LimitsComponent } from './features/limits/limits.component';
import { PocketsComponent } from './features/pockets/pockets.component';
import { SettingsComponent } from './features/settings/settings.component';
import { AccountStatementComponent } from './features/settings/account-statement/account-statement.component';
import { PasswordChangeComponent } from './features/settings/password-change/password-change.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent},
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      { path: 'register', component: RegisterAccountComponent },
      { path: 'view', component: ViewAccountsComponent }
    ]
  },
  { 
    path: 'settings', 
    component: SettingsComponent,
    children: [
        { path: 'password_change', component: PasswordChangeComponent},
        { path: 'account_statement', component: AccountStatementComponent}
    ]
  },
  { path: 'transfers', component: TransfersComponent },
  { path: 'limits', component: LimitsComponent },
  { path: 'pockets', component: PocketsComponent },
  { path: '', redirectTo: 'products', pathMatch: 'full' }, // default route
  { path: '**', redirectTo: 'products' } // wildcard -> fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }