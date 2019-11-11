import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material';
import {CategoryCreateComponent} from '../../category/category-create/category-create.component';
import {AblisFormComponent} from '../../etablis/ablis-form/ablis-form.component';
import {EmprunteurService} from '../../service/emprunteur.service';
import {EtablisService} from '../../service/etablis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emprunteur-index',
  templateUrl: './emprunteur-index.component.html',
  styleUrls: ['./emprunteur-index.component.css']
})
export class EmprunteurIndexComponent implements OnInit {
  EmprunteurForm = this.fb.group({
    nom: [null, [Validators.required, Validators.maxLength(50)]],
    prenom: [null, [Validators.required, Validators.maxLength(50)]],
    cne: [null, [Validators.required, Validators.maxLength(11),
      Validators.pattern('^([a-zA-Z]{0,1}[0-9]{10})$')]],
    cin: [null, [Validators.required, Validators.maxLength(8), Validators.minLength(6),
      Validators.pattern('^([a-zA-Z]{1,2}[0-9]{5,6})$')]],
    filiere: [null, [Validators.required]],
    etablis: [null, [Validators.required]]
  });
  etablis: any = null;
  filiere: any = null;
  idEtudiant: number;
  typeDialog: any = null;
  etablissements: any[] = [];
  Filieres: any[] = [];

  constructor(private dialogRef: MatDialogRef<EmprunteurIndexComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private fb: FormBuilder,
              public dialog: MatDialog,
              public etablisService: EtablisService,
              private emprunteurService: EmprunteurService) {
  }

  ngOnInit() {
    this.typeDialog = this.data.type;
    if (this.typeDialog === 'edit') {
      const row = this.data.row;
      this.EmprunteurForm.setValue({
        nom: row.nom,
        prenom: row.prenom,
        cne: row.cne,
        cin: row.cin,
        filiere: row.filiere_id,
        etablis: row.etablis_id
      });
      this.etablis = row.etablis_id;
      this.filiere = row.filiere_id;
      this.idEtudiant = row.id;
    }
    this.getFilierByEtablis();
    this.etablisService.getEtablissements().subscribe((res: any) => {
      this.etablissements = res.etablissements;
    });
  }

  openDialog(Text: string, Id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      text: Text,
      id: Id
    };
    const dialogRef = this.dialog.open(AblisFormComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        if (res.filieres) {
          this.Filieres = res.filieres;
          this.filiere = this.Filieres[this.Filieres.length - 1].id;
          this.EmprunteurForm.controls.filiere.setValue(this.filiere);
        }
        if (res.etablissements) {
          this.etablissements = res.etablissements;
          const idEtab = this.etablissements[this.etablissements.length - 1].id;
          // @ts-ignore
          this.Filieres = [];
          this.EmprunteurForm.controls.etablis.setValue(idEtab);
          this.getFilierByEtablis();
          this.etablis = idEtab;
        }
      }
    });
  }

  close(res) {
    this.dialogRef.close(res);
  }

  getFilierByEtablis() {
    this.EmprunteurForm.controls.filiere.reset();
    if (this.etablis != null) {
      this.etablisService.getFilieres(this.etablis).subscribe((res: any) => {
        this.Filieres = res.filieres;
      });
    }
  }

  store() {
    if (this.EmprunteurForm.invalid) {
      return;
    }
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
          const data = this.EmprunteurForm.value;
          this.emprunteurService.StoreEmprunteur({
            nom: data.nom,
            prenom: data.prenom,
            cne: data.cne,
            cin: data.cin,
            idetablis: data.etablis,
            idfiliere: data.filiere
          }).subscribe((res) => {
              this.emprunteurService.getEmprunteurs().subscribe((dataEmp: any) => {
                Swal.fire({
                  position: 'center',
                  type: 'success',
                  title: 'enregistrement a été effectué avec succès',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.close({emprunteurs: dataEmp.emprunteurs});
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
      });
  }

  update() {
    if (this.EmprunteurForm.invalid) {
      return;
    }
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
          const data = this.EmprunteurForm.value;
          this.emprunteurService.UpdateEmprunteur({
            nom: data.nom,
            prenom: data.prenom,
            cne: data.cne,
            cin: data.cin,
            idetablis: data.etablis,
            idfiliere: data.filiere
          }, this.idEtudiant).subscribe((res) => {
              if (res) {
                this.close(true);
              }
            },
            error => {
              Swal.fire(
                'Alert',
                error.message,
                'warning'
              );
            });
        }
      });
  }
}
