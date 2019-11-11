import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RestoService} from '../../service/resto.service';
import {PlatService} from '../../service/plat.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-plat-index',
  templateUrl: './plat-index.component.html',
  styleUrls: ['./plat-index.component.css']
})
export class PlatIndexComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['img', 'name', 'prix', 'description'];
  idResto: any;

  constructor(private platService: PlatService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.idResto = this.route.snapshot.paramMap.get('id');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.platService.getplat(this.idResto).subscribe((res: any) => {
      this.dataSource.data = res.plat;
    });
  }

}
