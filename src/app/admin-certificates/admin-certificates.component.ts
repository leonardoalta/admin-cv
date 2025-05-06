// admin-certificates.component.ts
import { Component, OnInit } from '@angular/core';
import { Certificates } from '../models/certificates/certificates.model';
import { CertificatesService } from '../services/certificates-service/certificates.service';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrls: ['./admin-certificates.component.css'],
})
export class AdminCertificatesComponent implements OnInit {
  /** Número total de certificados */
  itemCount = 0;

  /** Lista de certificados que muestra la vista */
  certificatesList: Certificates[] = [];

  /** Modelo para el formulario de creación */
  newCertificate: Omit<Certificates, 'id'> = {
    title: 'titulo',
    description: '',
    year: '0000',
  };

  /** Certificado que se edita (null ⇒ no hay edición) */
  editingCertificate: Certificates | null = null;

  constructor(private certificatesService: CertificatesService) {}

  /** Suscribimos al stream de Firestore */
  ngOnInit(): void {
    this.certificatesService.certificates$.subscribe((data) => {
      this.certificatesList = data;
      this.itemCount = data.length;
    });
  }

  /** Crear certificado */
  addCertificate(): void {
    if (this.newCertificate.title?.trim()) {
      this.certificatesService
        .create(this.newCertificate)
        .then(() => {
          console.log('Certificate added successfully');
          // reiniciar modelo del formulario
          this.newCertificate = { title: 'titulo', description: '', year: '0000' };
        })
        .catch((error: Error) => console.error('Error adding certificate:', error));
    } else {
      console.error('The title cannot be empty');
    }
  }

  /** Eliminar certificado */
  deleteCertificate(id: string): void {
    this.certificatesService
      .delete(id)
      .then(() => console.log('Certificate deleted successfully'))
      .catch((error: Error) => console.error('Error deleting certificate:', error));
  }

  /** Poner certificado en modo edición */
  editCertificate(certificate: Certificates): void {
    this.editingCertificate = { ...certificate };
  }

  /** Actualizar certificado en Firestore */
  updateCertificate(): void {
    if (this.editingCertificate?.id) {
      const { id, ...data } = this.editingCertificate;
      this.certificatesService
        .update(id, data)
        .then(() => {
          console.log('Certificate updated successfully');
          this.editingCertificate = null;
        })
        .catch((error: Error) => console.error('Error updating certificate:', error));
    }
  }

  /** Cancelar edición */
  cancelEdit(): void {
    this.editingCertificate = null;
  }
}

