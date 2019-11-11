import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestoService} from '../../service/resto.service';

@Component({
  selector: 'app-restaurant-index',
  templateUrl: './restaurant-index.component.html',
  styleUrls: ['./restaurant-index.component.css']
})
export class RestaurantIndexComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['img', 'name', 'ville', 'codePostal', 'address', 'actions'];

  constructor(private restoService: RestoService) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.restoService.getResto().subscribe((res: any) => {
      this.dataSource.data = res.resto;
      console.log(res.users);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
