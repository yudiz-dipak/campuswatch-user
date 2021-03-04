import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { ChatComponent } from "./components/chat/chat.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { NewAlertComponent } from "./components/new-alert/new-alert.component";
import { ProfileComponent } from "./components/profile/profile.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "chat", pathMatch: "full" },
      { path: "chat", component: ChatComponent },
      { path: "create-alert", component: NewAlertComponent },
      { path: "profile", component: ProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
