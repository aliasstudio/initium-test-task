import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {FormControlMap, FormDialogData} from "@app/shared/types";
import {Client} from "@app/clients/models/client";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ClientFormComponent {
  protected dialogData = inject(MAT_DIALOG_DATA) as FormDialogData<Client>;

  protected dialogOptions = this.dialogData.options;
  protected data = this.dialogData.data;

  protected form = new FormGroup<FormControlMap<Client>>({
    name: new FormControl(null),
    surname: new FormControl(null),
    email: new FormControl(null),
    phone: new FormControl(null),
  });
}
