import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {PlatService} from '../../service/plat.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-plat-create',
  templateUrl: './plat-create.component.html',
  styleUrls: ['./plat-create.component.css']
})
export class PlatCreateComponent implements OnInit {
  idResto: any;
  platForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(6)]],
    description: [null, Validators.required],
    prix: ['', Validators.required],
  });
  selectedFile: any = [];
  imageList: any = [];

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private platService: PlatService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.idResto = this.route.snapshot.paramMap.get('id');
  }

  onSubmit() {
    const dataSource = this.platForm.value;
    if (this.imageList[0]) {
      dataSource.img1 = this.imageList[0].filename;
    }
    if (this.imageList[1]) {
      dataSource.img2 = this.imageList[1].filename;
    }
    if (this.imageList[2]) {
      dataSource.img3 = this.imageList[2].filename;
    }
    if (this.imageList[3]) {
      dataSource.img4 = this.imageList[3].filename;
    }
    dataSource.id_resto = this.idResto;
    this.platService.StorePlat(dataSource).subscribe((res) => console.log(res));
  }
  onFileSelected(event) {
    this.selectedFile = event.target.files as File;
    if (this.imageList.length + this.selectedFile.length > 4) {
      alert('You are only allowed to upload a maximum of 4 files');
      return;
    }

    for (let i = 0; i < this.selectedFile.length; i++) {
      this.upload(i);
    }
  }
  upload(i) {
    const fd = new FormData();
    fd.append('image', this.selectedFile[i]);
    this.http.post('http://localhost:3000/api/upload', fd).subscribe((res: any) => {
      this.imageList.push({filename: res.filename, originalname: res.originalname});
      console.log(res);
    }, (err: any) => {
      // Show error message or make something.
    });
  }
  deleteImage(i) {
    const path = this.imageList[i].filename;
    this.http.delete('http://localhost:3000/api/deleteImage/' + path.toString()).subscribe((res: any) => {
      if (res.response) {
        this.imageList.splice(i, 1);
      }
    });
  }
}
