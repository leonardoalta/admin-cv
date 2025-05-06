import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Languages } from '../../models/languages/languages.model';

@Injectable({ providedIn: 'root' })
export class LanguagesService {
  private readonly dbPath = '/languages';
  private languagesRef: AngularFirestoreCollection<Languages>;
  languages$: Observable<Languages[]>;

  constructor(private afs: AngularFirestore) {
    this.languagesRef = afs.collection<Languages>(this.dbPath);

    this.languages$ = this.languagesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          id: c.payload.doc.id,
          ...(c.payload.doc.data() as Languages),
        }))
      )
    );
  }

  create(lang: Omit<Languages, 'id'>): Promise<void> {
    return this.languagesRef.add({ ...lang }).then();
  }

  update(id: string, data: Partial<Languages>): Promise<void> {
    return this.languagesRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.languagesRef.doc(id).delete();
  }
}

