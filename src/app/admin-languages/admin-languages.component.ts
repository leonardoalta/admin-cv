import { Component, OnInit } from '@angular/core';
import { Languages } from '../models/languages/languages.model';
import { LanguagesService } from '../services/languages-service/languages.service';

@Component({
  selector: 'app-admin-languages',
  templateUrl: './admin-languages.component.html',
  styleUrls: ['./admin-languages.component.css'],
})
export class AdminLanguagesComponent implements OnInit {
  languagesList: Languages[] = [];
  itemCount = 0;

  newLanguage: Languages = new Languages();
  editingLanguage: Languages | null = null;

  constructor(private languagesService: LanguagesService) {}

  ngOnInit(): void {
    this.languagesService.languages$.subscribe((data: Languages[]) => {
      this.languagesList = data;
      this.itemCount = data.length;
    });
  }

  addLanguage(): void {
    if (this.newLanguage.language.trim()) {
      this.languagesService
        .create(this.newLanguage)
        .then(() => (this.newLanguage = new Languages()))
        .catch((e: unknown) => console.error(e));
    }
  }

  deleteLanguage(id?: string): void {
    if (id) {
      this.languagesService
        .delete(id)
        .catch((e: unknown) => console.error(e));
    }
  }

  editLanguage(lang: Languages): void {
    this.editingLanguage = { ...lang };
  }

  updateLanguage(): void {
    if (this.editingLanguage?.id) {
      const { id, ...data } = this.editingLanguage;
      this.languagesService
        .update(id, data)
        .then(() => (this.editingLanguage = null))
        .catch((e: unknown) => console.error(e));
    }
  }

  cancelEdit(): void {
    this.editingLanguage = null;
  }
}

