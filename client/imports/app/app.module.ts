import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: 'overivew',
        component: OverviewPageComponent
      },
      // Home Page
      {
        path: '',
        redirectTo: '/overivew',
        pathMatch: 'full'
      },
      // 404 Page
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ])
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    OverviewPageComponent,
    ChartComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
