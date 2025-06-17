import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { SearchBarComponent } from './componentes/search-bar/search-bar.component';
import { PaymentOptionsComponent } from './componentes/payment-options/payment-options.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ProdutListComponent } from './componentes/produt-list/produt-list.component';

import { FormsModule } from '@angular/forms';
import { HomePdvComponent } from './pages/home-pdv/home-pdv.component';
import { ContainerComponent } from './componentes/container/container.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchBarComponent,
    PaymentOptionsComponent,
    FooterComponent,
    ProdutListComponent,
    HomePdvComponent,
    ContainerComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
