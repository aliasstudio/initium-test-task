import {AbstractControl} from "@angular/forms";

export type PlainObject = Record<keyof any, any>;

export type FormControlMap<T extends PlainObject> = {
  [key in keyof T]?: AbstractControl;
};

export type FormDialogOptions = { title: string }
export type FormDialogData<T extends PlainObject> = {
  options: FormDialogOptions;
  data?: T;
}
