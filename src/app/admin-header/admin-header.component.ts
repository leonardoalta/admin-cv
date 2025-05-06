import { Component, OnInit } from '@angular/core';
import { Header } from '../models/header/header.model';
import { HeaderService } from '../services/header-service/header.service';

type HeaderKey = keyof Header;

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent implements OnInit {
  header: Header = new Header();
  headerId: string = '';
  editingKey: HeaderKey | null = null;
  tmpValue = '';

  constructor(private headerService: HeaderService) {}

  ngOnInit(): void {
    // 1) Nos suscribimos a la lista de documentos /header
    this.headerService.headerList$.subscribe(list => {
      if (list.length > 0) {
        // Tomamos siempre el primero (Bf1fC2fgQuw4jQQwzeOd en tu caso)
        this.header = list[0];
        this.headerId = list[0].id!;
      }
    });
  }

  startEdit(key: HeaderKey): void {
    this.editingKey = key;
    this.tmpValue = (this.header[key] ?? '') as string;
  }

  save(): void {
    if (!this.editingKey || !this.headerId) return;

    const key = this.editingKey;
    const value = this.tmpValue.trim();
    if (!value) { this.cancel(); return; }

    // Actualiza localmente para que la UI cambie de inmediato
    (this.header as any)[key] = value;

    // Envia el cambio a Firestore usando el ID real
    this.headerService
      .update(this.headerId, { [key]: value })
      .then(() => console.log(`Campo ${key} guardado en Firestore`))
      .catch(err => {
        console.error('Error guardando en Firestore:', err);
      })
      .finally(() => {
        this.editingKey = null;
      });
  }

  cancel(): void {
    this.editingKey = null;
  }
}

