import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormControlMap } from "@app/shared/utils/types";
import { Client } from "@app/clients/models/client";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { EMAIL, PHONE } from "@app/shared/utils/constants";
import { NgIf } from "@angular/common";
import * as _ from "lodash";

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    NgIf
  ],
})
export class ClientFormComponent implements OnChanges {
  @Input({ required: true }) entity!: Client;

  @Output()
  readonly onEntitySaved = new EventEmitter<Client>();
  readonly destroyRef = inject(DestroyRef);

  protected readonly dialogRef = inject(MatDialogRef<ClientFormComponent>);

  get hasChanges(): boolean {
    const formValue = this.form.getRawValue();

    // Использую lodash для удобства работы с объектами, сравниваю значения ключей для поиска изменений
    return !_.isEqual(formValue, _.pick(this.entity, _.keys(formValue)));
  }

  protected form = new FormGroup<FormControlMap<Client>>({
    name: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    surname: new FormControl(null, [Validators.required, Validators.minLength(2)]),
    email: new FormControl(null, [Validators.required, Validators.pattern(EMAIL)]),
    phone: new FormControl(null, Validators.pattern(PHONE)),
  });

  protected save() {
    const value = this.form.value as Client;
    const entity = this.entity;

    this.onEntitySaved.emit(entity ? Object.assign(entity, value) : value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if('entity' in changes) {
      const entity = changes['entity'].currentValue;

      this.form.reset(entity);
      this.form.updateValueAndValidity();
    }
  }
}
