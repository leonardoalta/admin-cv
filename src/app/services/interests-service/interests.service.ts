import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Interests } from '../../models/interests/interests.model';

@Injectable({ providedIn: 'root' })
export class InterestsService {
  private readonly dbPath = '/interests';
  private interestsRef: AngularFirestoreCollection<Interests>;
  interests$: Observable<Interests[]>;

  constructor(private afs: AngularFirestore) {
    this.interestsRef = afs.collection<Interests>(this.dbPath);

    this.interests$ = this.interestsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          id: c.payload.doc.id,
          ...(c.payload.doc.data() as Interests),
        })),
      ),
    );
  }

  create(interest: Omit<Interests, 'id'>): Promise<void> {
    return this.interestsRef.add({ ...interest }).then();
  }

  update(id: string, data: Partial<Interests>): Promise<void> {
    return this.interestsRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.interestsRef.doc(id).delete();
  }
}

