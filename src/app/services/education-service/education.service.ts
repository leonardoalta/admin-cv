import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Education } from '../../models/education/education.model';

@Injectable({ providedIn: 'root' })
export class EducationService {
  private readonly dbPath = '/education';
  private educationRef: AngularFirestoreCollection<Education>;
  education$: Observable<Education[]>;

  constructor(private afs: AngularFirestore) {
    // referencia a la colección
    this.educationRef = afs.collection<Education>(this.dbPath);

    // stream en tiempo real
    this.education$ = this.educationRef.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({
          id: c.payload.doc.id,
          ...(c.payload.doc.data() as Education),
        })),
      ),
    );
  }

  create(education: Omit<Education, 'id'>) {
    return this.educationRef.add({ ...education });
  }

  update(id: string, data: Partial<Education>) {
    return this.educationRef.doc(id).update(data);
  }

  delete(id: string) {
    return this.educationRef.doc(id).delete();
  }
}


