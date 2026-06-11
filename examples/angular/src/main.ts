import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { AppComponent } from "./app/app.component";

// Zoneless on purpose: proves the motion-forge-angular directives are
// zoneless-compatible (signal inputs, no zone-dependent APIs).
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
}).catch((err) => console.error(err));
