import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SiteLayoutComponent } from "./site-layout/site-layout.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { HomepageComponent } from "./homepage/homepage.component";
import { CarouselComponent } from "./carousel/carousel.component";
import {
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatRippleModule,
  RippleGlobalOptions,
} from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { ChatspaceComponent } from "./chatspace/chatspace.component";
import { ChatMessageComponent } from "./chat-message/chat-message.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { ChatSuggestionComponent } from "./chat-suggestion/chat-suggestion.component";
import { MatChipsModule } from "@angular/material/chips";
import { MovieModalComponent } from "./movie-modal/movie-modal.component";
import { MovieDetailComponent } from "./movie-detail/movie-detail.component";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { LayoutModule } from "@angular/cdk/layout";

const globalRippleConfig: RippleGlobalOptions = {
  animation: {
    enterDuration: 400,
    exitDuration: 400,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    SiteLayoutComponent,
    HomepageComponent,
    CarouselComponent,
    ChatspaceComponent,
    ChatMessageComponent,
    ChatSuggestionComponent,
    MovieModalComponent,
    MovieDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatRippleModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    HttpClientModule,
    LayoutModule,
  ],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
