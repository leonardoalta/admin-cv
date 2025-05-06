// services/certificates-service/certificates.service.ts
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Certificates } from '../../models/certificates/certificates.model';

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private readonly dbPath = '/certificates';

  /** Referencia a la colección (se crea en el constructor) */
  private certificatesRef!: AngularFirestoreCollection<Certificates>;

  /** Stream en tiempo real */
  certificates$!: Observable<Certificates[]>;

  constructor(private afs: AngularFirestore) {
    // 1) Inicializamos la referencia
    this.certificatesRef = afs.collection<Certificates>(this.dbPath);

    // 2) Creamos el observable
    this.certificates$ = this.certificatesRef.snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({
          id: c.payload.doc.id,
          ...(c.payload.doc.data() as Certificates),
        })),
      ),
    );
  }

  // CRUD
  create(certificate: Omit<Certificates, 'id'>) {
    return this.certificatesRef.add({ ...certificate });
  }

  update(id: string, data: Partial<Certificates>) {
    return this.certificatesRef.doc(id).update(data);
  }

  delete(id: string) {
    return this.certificatesRef.doc(id).delete();
  }
}

