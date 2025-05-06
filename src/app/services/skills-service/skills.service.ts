import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Skills } from '../../models/skills/skills.model';

@Injectable({ providedIn: 'root' })
export class SkillsService {
  private readonly dbPath = '/skills';
  private skillsRef: AngularFirestoreCollection<Skills>;
  skills$: Observable<Skills[]>;

  constructor(private afs: AngularFirestore) {
    this.skillsRef = afs.collection<Skills>(this.dbPath);

    this.skills$ = this.skillsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          id: c.payload.doc.id,
          ...(c.payload.doc.data() as Skills),
        }))
      )
    );
  }

  create(skill: Omit<Skills, 'id'>): Promise<void> {
    return this.skillsRef.add({ ...skill }).then();
  }

  update(id: string, data: Partial<Skills>): Promise<void> {
    return this.skillsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.skillsRef.doc(id).delete();
  }
}

