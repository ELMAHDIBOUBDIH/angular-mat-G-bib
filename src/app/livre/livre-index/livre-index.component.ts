import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatCheckbox, MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import {CategoryCreateComponent} from '../../category/category-create/category-create.component';
import {FormBuilder, Validators} from '@angular/forms';
import {LivreService} from '../../service/livre.service';
import {CategoryService} from '../../service/category.service';
import Swal from 'sweetalert2';
import {HttpClient} from '@angular/common/http';

// jqwidgets
@Component({
  selector: 'app-livre-index',
  templateUrl: './livre-index.component.html',
  styleUrls: ['./livre-index.component.css']
})

export class LivreIndexComponent implements OnInit {
  // @ts-ignore
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ts-ignore
  @ViewChild('checkAll') checkAll: MatCheckbox;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['select', 'id', 'name', 'ref', 'qnt', 'action'];
  livreData: any[] = [];
  checkall = false;
  LivreForm = this.fb.group({
    name: [null, [Validators.required]],
    category: [null, [Validators.required]],
    qnt: [null, [Validators.required, Validators.min(1)]]
  });
  nbCheck = 0;
  idChecked: any[] = [];
  categoryData: any[] = [];
  selectedFile: any;

  constructor(public dialog: MatDialog,
              private fb: FormBuilder,
              private livreService: LivreService,
              private serviceCategory: CategoryService,
              private  http: HttpClient) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getLivres();
    this.getCategorys();
  }

  Oncheck(event, id) {
    this.checkAll.checked = false;
    if (event.checked) {
      this.nbCheck++;
      this.dataSource.filteredData.forEach((item: any) => {
        if (item.id === id) {
          item.checked = true;
        }
      });
      this.idChecked.push(id);
    } else {
      this.nbCheck--;
      this.dataSource.filteredData.forEach((item: any) => {
        if (item.id === id) {
          item.checked = false;
        }
      });
      const index = this.idChecked.indexOf(id, 0);
      if (index > -1) {
        this.idChecked.splice(index, 1);
      }
    }
  }

  applyFilter(filterValue: string) {
    if (this.checkall) {
      this.checkAll.checked = false;
      this.dataSource.filteredData.forEach((item: any) => {
        item.checked = false;
      });
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  OncheckAll(event) {
    console.log(event, this.dataSource.filteredData.length);
    const nb = this.dataSource.filteredData.length;
    if (event.checked) {
      this.checkall = true;
      this.nbCheck = nb;
      this.dataSource.filteredData.forEach((item: any) => {
        item.checked = true;
        this.idChecked.push(item.id);
      });
    } else {
      this.nbCheck = 0;
      this.checkall = false;
      this.dataSource.filteredData.forEach((item: any) => {
        item.checked = false;
        this.idChecked = [];
      });
    }
  }

  openDialog(typeDialog) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {
      row: null,
      type: typeDialog
    };
    const dialogRef = this.dialog.open(CategoryCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        this.categoryData = res;
      }
    });
  }

  storeLivre() {
    if (this.LivreForm.invalid) {
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
    }).then((result) => {
      if (result.value) {
        this.livreService.StoreLivre(this.LivreForm.value).subscribe((res) => {
          this.getLivres();
          Swal.fire({
            position: 'center',
            type: 'success',
            title: 'enregistrement a été effectué avec succès',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }

  getLivres() {
    this.livreData = [];
    this.livreService.getLivres().subscribe((res: any) => {
      const data = res.livres;
      for (let i = 0; i < data.length; i++) {
        this.livreData.push({
          checked: false,
          id: data[i].id,
          id_categorie: data[i].id_categorie,
          name: data[i].name,
          qnt: data[i].qnt,
          ref: data[i].ref,
          disp: data[i].disp
        });
      }
      this.dataSource.data = this.livreData;
    }, error => {
      Swal.fire(
        'Alert',
        error.message,
        'warning'
      );
    });
  }

  getCategorys() {
    this.serviceCategory.getCategorys().subscribe((res: any) => {
      this.categoryData = res.category;
    });
  }

  wait() {
    Swal.fire({
      position: 'center',
      text: 'Traitement en cours, veuillez patienter ...',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {
        clearInterval(500);
      }
    });
  }

  destroyLivre() {
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
    }).then((result) => {
      if (result.value) {
        for (let i = 0; i < this.idChecked.length; i++) {
          this.livreService.destroyLivre(this.idChecked[i]).subscribe((res) => {
              if (res) {
                if (i === this.idChecked.length - 1) {
                  console.log('asa');
                  this.dataSource.data = [];
                  this.getLivres();
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  );
                }
              }
            },
            error => {
              Swal.fire(
                'Alert',
                error.message,
                'warning'
              );
            }
          );
        }
        this.nbCheck = 0;
      }
    });
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files as File;
    const fd = new FormData();
    fd.append('file', this.selectedFile[0]);
    this.wait();
    let url = 'http://localhost:3000/api/uploadxls/book';
    if (event.target.name === 'category') {
      url = 'http://localhost:3000/api/uploadxls/category';
    }
    this.http.post(url, fd).subscribe((res: any) => {
      if (res) {
        Swal.close();
        Swal.fire(
          'Alert!',
          'l\'importaion a été effectué avec succès',
          'success'
        );
        this.getLivres();
        this.getCategorys();
      } else {
        Swal.close();
        Swal.fire(
          'Alert',
          'importation des données refusé',
          'warning'
        );
      }
    }, (err: any) => {
      console.log(err);
    });
  }
}
