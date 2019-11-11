import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {
  MatAccordion,
  MatCheckbox,
  MatDialog,
  MatDialogConfig, MatExpansionPanel,
  MatPaginator,
  MatSelect,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import {DateAdapter} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import {LivreService} from '../../service/livre.service';
import {EmprunteurIndexComponent} from '../../emprunteur/emprunteur-index/emprunteur-index.component';
import {EmprunteurService} from '../../service/emprunteur.service';
import {EmprunteService} from '../../service/emprunte.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import {ActivatedRoute} from '@angular/router';
import {viewClassName} from '@angular/compiler';


@Component({
  selector: 'app-emprunte-index',
  templateUrl: './emprunte-index.component.html',
  styleUrls: ['./emprunte-index.component.css']
})
export class EmprunteIndexComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ts-ignore
  @ViewChild('checkAll') checkAll: MatCheckbox;
  // @ts-ignore
  @ViewChild('mep') myPanels: MatExpansionPanel;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['livre', 'Emprunteur', 'DateEmp', 'DateRendu', 'rendu', 'action'];
  EmpruntForm = this.fb.group({
    nameLivre: [null, [Validators.required]],
    nameEmpr: [null, [Validators.required]],
    dateEmpr: [null, [Validators.required]],
    Rendu: [null],
  });
  livres = [];
  livresFilter: any[] = [];
  rendu = false;
  dateRendu = new Date();
  dateEmpr = new Date();
  isdialog = false;
  emprunteurs: any[] = [];
  Empruntes: any[] = [];
  checkall = false;
  nbCheck = 0;
  sub: any;
  idLivre = 0;
  showBtnUpdate: any = false;
  idEmprunte = 0;

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private livreService: LivreService,
              private emprunteurService: EmprunteurService,
              private emprunteService: EmprunteService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getLivres();
    this.getEmprunteurs();
    this.getEmprunte();
    this.sub = this.route.params.subscribe(params => {
      if (params.id !== undefined) {
        this.myPanels.expanded = true;
        this.idLivre = params.id;
        // @ts-ignore
        this.EmpruntForm.controls.nameLivre.setValue(this.idLivre);
      }

    });
  }

  renduLivre(event) {
    if (event.checked) {
      this.rendu = true;
    } else {
      this.rendu = false;
      this.dateRendu = null;
    }
  }

  filterSelectLiver(event) {
    this.livresFilter = this.livres.filter((res) => {
      return res.name.trim().toLowerCase().match(event.trim().toLowerCase().toString());
    });
    if (event.length === 0) {
      this.livresFilter = this.livres;
    }
  }

  openDialog(isdialog) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = {
      row: null,
      type: 'store'
    };
    const dialogRef = this.dialog.open(EmprunteurIndexComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        this.emprunteurs = res.emprunteurs;
        // @ts-ignore
        this.EmpruntForm.controls.nameEmpr.setValue(this.emprunteurs[this.emprunteurs.length - 1].id);
      }
    });
  }

  store() {
    if (this.EmpruntForm.invalid) {
      return;
    }
    const Emprunte = this.EmpruntForm.value;
    this.emprunteurService.getEmprunteur(Emprunte.nameEmpr).subscribe(
      (res: any) => {
        if (res.emprunteur.emprunte.length > 0) {
          Swal.fire({
            type: 'warning',
            title: 'Oops...',
            text: res.emprunteur.nom + ' ' + res.emprunteur.prenom + ' Deja emprunter un livre!',
          });
        } else {
          let dataInsert;
          if (!this.rendu) {
            dataInsert = {
              idLivre: Emprunte.nameLivre,
              idEmprunteur: Emprunte.nameEmpr,
              dateEmprunte: Emprunte.dateEmpr,
              Rendu: Emprunte.Rendu
            };
          } else {
            dataInsert = {
              idLivre: Emprunte.nameLivre,
              idEmprunteur: Emprunte.nameEmpr,
              dateEmprunte: Emprunte.dateEmpr,
              dateRendu: this.dateRendu,
              Rendu: Emprunte.Rendu
            };
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
            .then((result) => {
              if (result.value) {
                this.emprunteService.StoreEmprunte(dataInsert).subscribe(() => {
                    Swal.fire({
                      position: 'center',
                      type: 'success',
                      title: 'enregistrement a été effectué avec succès',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    this.getEmprunte();
                    this.getLivres();
                    this.EmpruntForm.reset();
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
      },
      error => {
        console.log(error.message);
        Swal.fire(
          'Alert',
          error.message,
          'warning'
        );
      });
  }

  getEmprunte() {
    this.Empruntes = [];
    this.emprunteService.getEmpruntes().subscribe((res: any) => {
      const emprunteData: any[] = [];
      for (let i = 0; i < res.empruntes.length; i++) {
        const data = res.empruntes[i];
        emprunteData.push({
          id: data.id,
          livre: data.Livre.name,
          idLivre: data.Livre.id,
          idEmprunteur: data.Emprunteur.id,
          Emprunteur: data.Emprunteur.nom + '  ' + data.Emprunteur.prenom,
          DateEmp: data.dateEmprunte,
          DateRendu: data.dateRendu,
          rendu: data.Rendu
        });
      }
      this.dataSource.data = emprunteData;
    });
  }

  getFormat(date) {
    if (date == null) {
      return 'pas encore rendu';
    }
    return moment(date).format('DD-MM-YYYY');
  }

  applyFilter(filterValue: string) {
    if (this.checkall) {
      this.checkAll.checked = false;
      this.nbCheck = 0;
      this.dataSource.filteredData.forEach((item: any) => {
        item.checked = false;
      });
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filteredData);
  }

  getLivres() {
    this.livreService.getLivres().subscribe((res: any) => {
        this.livres = res.livres;
        this.livresFilter = this.livres;
        console.log(this.livresFilter);
      },
      error => {
        Swal.fire(
          'Alert',
          error.message,
          'warning'
        );
      });
  }

  getEmprunteurs() {
    this.emprunteurService.getEmprunteurs().subscribe((res: any) => {
        this.emprunteurs = res.emprunteurs;
      },
      error => {
        Swal.fire(
          'Alert',
          error.message,
          'warning'
        );
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  deleteEmprunte(id) {
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
      .then((result) => {
        if (result.value) {
          this.emprunteService.deleteEmprunte(id).subscribe((res: any) => {
            if (res.delete) {
              this.getEmprunte();
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Your file has been deleted.',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire(
                'Error!',
                res.msg,
                'warning'
              );
            }
          });

        }
      });
  }

  editEmprunte(row) {
    this.showBtnUpdate = true;
    this.EmpruntForm.reset();
    this.idLivre = row.idLivre;
    this.idEmprunte = row.id;
    // @ts-ignore
    this.EmpruntForm.setValue({
      nameLivre: row.idLivre,
      nameEmpr: row.idEmprunteur,
      dateEmpr: row.DateEmp,
      Rendu: true,
    });
    if (row.DateRendu != null) {
      this.dateRendu = row.DateRendu;
    }
    this.myPanels.expanded = true;
  }

  closeUpdate() {
    this.showBtnUpdate = false;
    this.EmpruntForm.reset();
  }

  updateEmprunte() {
    const data = this.EmpruntForm.value;
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
      .then((result) => {
        if (result.value) {
          this.emprunteService.UpdateEmprunte(
            {
              idLivre: data.nameLivre,
              idEmprunteur: data.nameEmpr,
              dateEmprunte: data.dateEmpr,
              Rendu: data.Rendu,
              dateRendu: this.dateRendu
            }, this.idEmprunte
          ).subscribe((res) => {
            if (res) {
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Your work has been Updated',
                showConfirmButton: false,
                timer: 1500
              });
              this.getLivres();
              this.getEmprunteurs();
              this.getEmprunte();
            }
          });
        }
      });
  }
}
