import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatExpansionPanel, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import Swal from 'sweetalert2';
import {EmprunteurService} from '../../service/emprunteur.service';
import {AblisFormComponent} from '../../etablis/ablis-form/ablis-form.component';
import {EmprunteurIndexComponent} from '../emprunteur-index/emprunteur-index.component';

@Component({
  selector: 'app-etudiant-list',
  templateUrl: './etudiant-list.component.html',
  styleUrls: ['./etudiant-list.component.css']
})
export class EtudiantListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ts-ignore
  @ViewChild('mep') myPanels: MatExpansionPanel;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['nom', 'prenom', 'cin', 'cne', 'etablis', 'filiere', 'action'];

  constructor(private emprunteurService: EmprunteurService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getEmprunteurs();
  }

  getEmprunteurs() {
    this.emprunteurService.getEmprunteurs().subscribe((res: any) => {
        const data = [];
        const results = res.emprunteurs;
        for (let i = 0; i < results.length; i++) {
          data.push({
            id: results[i].id,
            nom: results[i].nom,
            prenom: results[i].prenom,
            cne: results[i].cne,
            cin: results[i].cin,
            etablis_id: results[i].etablis.id,
            etablis: results[i].etablis.name,
            filiere_id: results[i].filiere.id,
            filiere: results[i].filiere.name
          });
        }
        console.log(data);
        this.dataSource.data = data;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteEmprunteur(id) {
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
          this.emprunteurService.deleteEmprunteur(id).subscribe((res: any) => {
            if (res.delete) {
              this.getEmprunteurs();
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

  openDialog(data, typeDialog) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '80%';
    dialogConfig.data = {
      row: data,
      type: typeDialog
    };
    const dialogRef = this.dialog.open(EmprunteurIndexComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        this.getEmprunteurs();
      }
    });
  }
}
