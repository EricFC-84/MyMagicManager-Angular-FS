import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchCardsComponent } from './search-cards/search-cards.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { CreateDeckComponent } from './create-deck/create-deck.component';
import { FiltersComponent } from './filters/filters.component';
import { ProfileComponent } from './profile/profile.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { DeckDetailsComponent } from './deck-details/deck-details.component';
import { DeckCardsTableComponent } from './deck-cards-table/deck-cards-table.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { HomeComponent } from './home/home.component';
import { SpinnerComponent } from './spinner/spinner.component';


let AppRoutes: Routes = [
  {"path": "", "component": HomeComponent},
  {"path": "search-cards", "component": SearchCardsComponent},
  {"path": "login", "component":LoginComponent},
  {"path": "register", "component":RegisterComponent},
  {"path":"create-deck", "component":CreateDeckComponent, "canActivate": [AuthGuard] },
  {"path":"edit-deck/:id", "component":CreateDeckComponent, "canActivate": [AuthGuard] },
  {"path":"profile/:id", "component":ProfileComponent},
  {"path":"deck/:id", "component":DeckDetailsComponent},


  


]



@NgModule({
  declarations: [
    AppComponent,
    SearchCardsComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    FooterComponent,
    CreateDeckComponent,
    FiltersComponent,
    ProfileComponent,
    SearchResultsComponent,
    DeckDetailsComponent,
    DeckCardsTableComponent,
    StatisticsComponent,
    HomeComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {useHash: true})

  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
