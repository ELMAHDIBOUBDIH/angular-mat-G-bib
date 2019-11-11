import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import Swal from 'sweetalert2';
import {EtablisService} from '../../service/etablis.service';

@Component({
  selector: 'app-ablis-form',
  templateUrl: './ablis-form.component.html',
  styleUrls: ['./ablis-form.component.css']
})
export class AblisFormComponent implements OnInit {
  Form = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(50)]],
  });
  public Data: any;

  constructor(private dialogAblis: MatDialogRef<AblisFormComponent>, @Inject(MAT_DIALOG_DATA) private data, private fb: FormBuilder,
              private etablisService: EtablisService) {
  }

  ngOnInit() {
    this.Data = this.data;
  }

  close(res) {
    this.dialogAblis.close(res);
  }

  store(type) {
    if (this.Form.invalid) {
      return;
    }
    const data = this.Form.value;
    Swal.fire({
      title: 'voulez vous vraiment continuer ?',
      text: 'vous ne pourrez pas revenir en arrière!',
      type: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      reverseButtons: true
    })
      .then((rs) => {
        if (rs.value) {
          if (type === 'etablis') {
            this.etablisService.storeEtablissement({
              name: data.name
            }).subscribe((res) => {
                this.etablisService.getEtablissements().subscribe((result: any) => {
                    Swal.fire({
                      position: 'center',
                      type: 'success',
                      title: 'enregistrement a été effectué avec succès',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    this.close({etablissements: result.etablissements});
                  },
                  error => {
                    Swal.fire(
                      'Alert',
                      error.message,
                      'warning'
                    );
                  });
              },
              error => {
                Swal.fire(
                  'Alert',
                  error.message,
                  'warning'
                );
              });
          } else {
            this.etablisService.storeFiliere({
              name: data.name,
              idetablis: this.Data.id
            }).subscribe((res) => {
                this.etablisService.getFilieres(this.Data.id).subscribe((result: any) => {
                  Swal.fire({
                    position: 'center',
                    type: 'success',
                    title: 'enregistrement a été effectué avec succès',
                    showConfirmButton: false,
                    timer: 1500
                  });
                  this.close({filieres: result.filieres});
                });
              },
              error => {
                Swal.fire(
                  'Alert',
                  error.message,
                  'warning'
                );
              });
          }
        }
      });
  }
}
