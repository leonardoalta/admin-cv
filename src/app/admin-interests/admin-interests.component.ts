import { Component, OnInit } from '@angular/core';
import { Interests } from '../models/interests/interests.model';
import { InterestsService } from '../services/interests-service/interests.service';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrls: ['./admin-interests.component.css'],
})
export class AdminInterestsComponent implements OnInit {
  interestsList: Interests[] = [];
  itemCount = 0;

  newInterest: Interests = new Interests();
  editingInterest: Interests | null = null;

  constructor(private interestsService: InterestsService) {}

  ngOnInit(): void {
    this.interestsService.interests$.subscribe((data: Interests[]) => {
      this.interestsList = data;
      this.itemCount = data.length;
    });
  }

  addInterest(): void {
    if (this.newInterest.name.trim()) {
      this.interestsService
        .create(this.newInterest)
        .then(() => (this.newInterest = new Interests()))
        .catch((err: unknown) => console.error(err));
    }
  }

  deleteInterest(id?: string): void {
    if (id) {
      this.interestsService
        .delete(id)
        .catch((err: unknown) => console.error(err));
    }
  }

  editInterest(i: Interests): void {
    this.editingInterest = { ...i };
  }

  updateInterest(): void {
    if (this.editingInterest?.id) {
      const { id, ...data } = this.editingInterest;
      this.interestsService
        .update(id, data)
        .then(() => (this.editingInterest = null))
        .catch((err: unknown) => console.error(err));
    }
  }

  cancelEdit(): void {
    this.editingInterest = null;
  }
}

