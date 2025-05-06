import { Component, OnInit } from '@angular/core';
import { Education } from '../models/education/education.model';
import { EducationService } from '../services/education-service/education.service';

@Component({
  selector: 'app-admin-education',
  templateUrl: './admin-education.component.html',
  styleUrls: ['./admin-education.component.css'],
})
export class AdminEducationComponent implements OnInit {
  itemCount = 0;
  educationList: Education[] = [];

  /** Modelo del formulario */
  myEducation: Education = new Education();

  /** Para edición; null ⇒ no se edita */
  editingEducation: Education | null = null;

  constructor(private educationService: EducationService) {}

  ngOnInit(): void {
    this.educationService.education$.subscribe((data) => {
      this.educationList = data;
      this.itemCount = data.length;
    });
  }

  addEducation(): void {
    this.educationService
      .create(this.myEducation)
      .then(() => {
        console.log('Education created');
        this.myEducation = new Education(); // limpia formulario
      })
      .catch((e) => console.error(e));
  }

  deleteEducation(id?: string): void {
    if (!id) return;
    this.educationService
      .delete(id)
      .then(() => console.log('Education deleted'))
      .catch((e) => console.error(e));
  }

  editEducation(edu: Education): void {
    this.editingEducation = { ...edu };
  }

  updateEducation(): void {
    if (!this.editingEducation?.id) return;
    const { id, ...data } = this.editingEducation;
    this.educationService
      .update(id, data)
      .then(() => {
        console.log('Education updated');
        this.editingEducation = null;
      })
      .catch((e) => console.error(e));
  }

  cancelEdit(): void {
    this.editingEducation = null;
  }
}

