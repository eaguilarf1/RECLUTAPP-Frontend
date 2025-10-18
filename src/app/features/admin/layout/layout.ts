import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDividerModule],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class AdminLayoutComponent {}
