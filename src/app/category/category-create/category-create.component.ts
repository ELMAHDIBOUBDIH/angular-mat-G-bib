import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {CategoryService} from '../../service/category.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent implements OnInit {
  CatForm = this.fb.group({
    name: [null, [Validators.required]],
    description: [null]
  });
  public categoryData: any[] = [];
  private idCategorey: number;
  private typeDialog: any;

  constructor(private dialogRef: MatDialogRef<CategoryCreateComponent>,
              @Inject(MAT_DIALOG_DATA) private data, private fb: FormBuilder,
              private serviceCategory: CategoryService) {
  }

  ngOnInit() {
    this.typeDialog = this.data.type;
    if (this.typeDialog === 'edit') {
      const row = this.data.row;
      this.CatForm.setValue({
        name: row.name,
        description: row.description
      });
    }
  }

  close(res) {
    this.dialogRef.close(res);
  }

  store() {
    this.serviceCategory.StoreCategory(this.CatForm.value).subscribe((res) => {
      this.getCategorys();
    });
  }

  getCategorys() {
    this.serviceCategory.getCategorys().subscribe((res: any) => {
      this.categoryData = res.category;
      this.close(this.categoryData);
    });
  }

  update() {
    this.idCategorey = this.data.row.id;
    this.serviceCategory.UpdateCategory(this.CatForm.value, this.idCategorey).subscribe((res) => {
      this.getCategorys();
    });
  }
}
