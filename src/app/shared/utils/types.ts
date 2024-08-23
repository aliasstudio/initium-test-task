import { AbstractControl } from "@angular/forms";

export type PlainObject = Record<keyof any, any>;

export type FormControlMap<T extends PlainObject> = {
  [key in keyof T]?: AbstractControl;
};
