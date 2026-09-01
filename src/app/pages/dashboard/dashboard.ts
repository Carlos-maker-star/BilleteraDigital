import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarMenuOptionsComponent } from '../../shared/components/sidebar-menu-options/sidebar-menu-options';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [RouterOutlet, SidebarMenuOptionsComponent],
})
export default class DashboardComponent {}
