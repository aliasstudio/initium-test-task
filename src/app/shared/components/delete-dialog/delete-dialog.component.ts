import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: 'app-delete-dialog',
  template: `
    <div class="d-flex flex-column" style="padding: 40px; width: 450px; height: 300px; gap: 28px">
      <h2>Удаление строк</h2>
      <span>Удалить выбранные строки ({{ count }})?</span>
      <div class="d-flex justify-content-end gap-3 mt-auto">
        <button mat-button color="accent" [mat-dialog-close]="false">Отмена</button>
        <button mat-flat-button color="accent" [mat-dialog-close]="true">Удалить</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
  ]
})
export class DeleteDialogComponent {
  count = inject(MAT_DIALOG_DATA);
}
