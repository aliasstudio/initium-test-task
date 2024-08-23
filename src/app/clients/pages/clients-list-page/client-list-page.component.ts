import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { SelectionModel } from "@angular/cdk/collections";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Client } from "@app/clients/models/client";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ClientFormComponent } from "@app/clients/components/client-form/client-form.component";
import { HttpClient } from "@angular/common/http";
import { first, map, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-client-list-page',
  templateUrl: './client-list-page.component.html',
  styleUrls: ['./client-list-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatDialogModule],
})
export class ClientListPageComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) protected sort!: MatSort;

  protected displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];
  protected dataSource = new MatTableDataSource<Client>();
  protected selection = new SelectionModel<Client>(true, []);

  private dialog = inject(MatDialog);
  private httpClient = inject(HttpClient);
  private changeDetector = inject(ChangeDetectorRef);

  ngOnInit() : void {
    this.httpClient.get<{ users: Client[] }>('https://test-data.directorix.cloud/task1')
      .pipe(
        map(data => data.users),
        tap(users => (this.dataSource.data = users)),
        first(), // Получили ответ и отписались, т.к. данные с бэка нужны только при инициализации
      ).subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  protected isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  protected toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  protected open(entity?: Client): void {
    const dialogRef = this.dialog.open(ClientFormComponent);
    const instance = dialogRef.componentInstance;
    const componentRef = dialogRef.componentRef;
    // Если есть модель в таблице - прокидываем ссылку в инпут
    const dataSource = this.dataSource;
    const dataItem = dataSource.data.find(el => el === entity);
    dataItem && componentRef?.setInput('entity', dataItem);

    // Подписываемся на сохранение до уничтожения формы
    instance.onEntitySaved.pipe(takeUntilDestroyed(instance.destroyRef)).subscribe(entity => {
      const dataItem = dataSource.data.find(el => el === entity);

      // Если нет в таблице - добавляем
      !dataItem && dataSource.data.push(entity);
      // Обновляем представление
      dataSource._updateChangeSubscription();
      // Ссылка не меняется, поэтому обновляем вручную
      this.changeDetector.markForCheck();

      // Обновляем модель после сохранения, чтобы форма узнала об ее существовании в гриде
      componentRef?.setInput('entity', entity);
    })
  }

  protected delete(): void {
    const dataSource = this.dataSource;
    this.selection.selected.forEach(entity => {
      const index = dataSource.data.findIndex(
        el => el === entity,
      );

      if(index !== -1) {
        this.selection.deselect(entity);
        dataSource.data.splice(index, 1);
      }
    });
    dataSource._updateChangeSubscription();
  }
}
