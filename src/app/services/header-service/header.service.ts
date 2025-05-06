import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Header } from '../../models/header/header.model';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  private readonly dbPath = 'header';
  private headerCol: AngularFirestoreCollection<Header>;

  /** Stream de todos los documentos en /header, con su ID */
  headerList$: Observable<Header[]>;

  constructor(private afs: AngularFirestore) {
    this.headerCol = this.afs.collection<Header>(this.dbPath);
    this.headerList$ = this.headerCol
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({
            id: c.payload.doc.id,
            ...(c.payload.doc.data() as Header)
          }))
        )
      );
  }

  /** Actualiza el documento con el ID dado */
  update(id: string, data: Partial<Header>): Promise<void> {
    return this.headerCol.doc(id).set(data as Header, { merge: true });
  }
}

