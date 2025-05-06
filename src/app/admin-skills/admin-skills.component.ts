import { Component, OnInit } from '@angular/core';
import { Skills } from '../models/skills/skills.model';
import { SkillsService } from '../services/skills-service/skills.service';

@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrls: ['./admin-skills.component.css'],
})
export class AdminSkillsComponent implements OnInit {
  skillsList: Skills[] = [];
  itemCount = 0;

  newSkill: Skills = new Skills();
  editingSkill: Skills | null = null;

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.skillsService.skills$.subscribe((data: Skills[]) => {
      this.skillsList = data;
      this.itemCount = data.length;
    });
  }

  addSkill(): void {
    if (this.newSkill.skill.trim()) {
      this.skillsService
        .create(this.newSkill)
        .then(() => (this.newSkill = new Skills()))
        .catch((e: unknown) => console.error(e));
    }
  }

  deleteSkill(id?: string): void {
    if (id) {
      this.skillsService.delete(id).catch((e: unknown) => console.error(e));
    }
  }

  editSkill(s: Skills): void {
    this.editingSkill = { ...s };
  }

  updateSkill(): void {
    if (this.editingSkill?.id) {
      const { id, ...data } = this.editingSkill;
      this.skillsService
        .update(id, data)
        .then(() => (this.editingSkill = null))
        .catch((e: unknown) => console.error(e));
    }
  }

  cancelEdit(): void {
    this.editingSkill = null;
  }
}


