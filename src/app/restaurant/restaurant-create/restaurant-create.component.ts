import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {RestoService} from '../../service/resto.service';
import {FileUploader, FileSelectDirective} from 'ng2-file-upload/ng2-file-upload';
import {HttpClient} from '@angular/common/http';


const UploadURL = 'http://localhost:3000/api/upload';


@Component({
  selector: 'app-restaurant-create',
  templateUrl: './restaurant-create.component.html',
  styleUrls: ['./restaurant-create.component.css']
})

export class RestaurantCreateComponent implements OnInit {
  RestoForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(6)]],
    longitude: [null, [Validators.required, Validators.minLength(6)]],
    latitude: ['', [Validators.required, Validators.minLength(6)]],
    address: [null, [Validators.required, Validators.minLength(6)]],
    ville: null,
    codePostal: [null, Validators.required]
  });
  selectedFile: any = [];
  imageList: any = [];

  constructor(private fb: FormBuilder,
              private restService: RestoService,
              private http: HttpClient) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const dataSource = this.RestoForm.value;
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
    this.restService.StoreResto(dataSource).subscribe((res) => console.log(res));
  }

  public onFileSelected(event) {
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
