import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig, MatExpansionPanel, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {EmprunteurService} from '../../service/emprunteur.service';
import {CategoryService} from '../../service/category.service';
import Swal from 'sweetalert2';
import {EmprunteurIndexComponent} from '../../emprunteur/emprunteur-index/emprunteur-index.component';
import {CategoryCreateComponent} from '../category-create/category-create.component';

@Component({
  selector: 'app-category-index',
  templateUrl: './category-index.component.html',
  styleUrls: ['./category-index.component.css']
})
export class CategoryIndexComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['nom', 'description', 'action'];

  constructor(private categoryService: CategoryService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getCategory();
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
    const dialogRef = this.dialog.open(CategoryCreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res != null) {
        this.getCategory();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getCategory() {
    this.categoryService.getCategorys().subscribe((res: any) => {
        this.dataSource.data = res.category;
        console.log(this.dataSource.data);
      },
      error => {
        Swal.fire(
          'Alert',
          error.message,
          'warning'
        );
      });
  }
  deletecategory(id) {
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
          this.categoryService.deleteCategory(id).subscribe((res: any) => {
            if (res.delete) {
              this.getCategory();
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
                'cette categorie liés par des livres',
                'warning'
              );
            }
          });

        }
      });
  }
}
