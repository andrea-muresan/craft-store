import { Component } from '@angular/core';
import { MatBadge} from "@angular/material/badge";
import { LucideContact, LucideHome, LucideHouse, LucideMenu, LucideShoppingBag, LucideStore, LucideUser } from '@lucide/angular';


@Component({
  selector: 'app-header',
  imports: [
    MatBadge,
    LucideShoppingBag,
    LucideUser, 
    LucideMenu,
    LucideContact,
    LucideStore,
    LucideHouse
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  title = 'Craft Store';
  tagline = 'Handmade happiness delivered';
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
