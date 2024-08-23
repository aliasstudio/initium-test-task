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
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { first, map, of, switchMap, tap } from "rxjs";
import { db } from "@app/shared/db/db";
import { DeleteDialogComponent } from "@app/shared/components/delete-dialog/delete-dialog.component";

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
    // Использовал Dexie для хранения записей в IndexedDB
    fromPromise(db.clients.toArray())
      .pipe(
        switchMap(users => users.length
          ? of(users)
          : this.httpClient.get<{ users: Client[] }>('https://test-data.directorix.cloud/task1')
            .pipe(
              // Добавляю в бд записи с бэка, чтобы далее работать с ними локально, т.к. указана только "начальная загрузка записей"
              map(data => data.users),
              switchMap(users => db.clients.bulkAdd(users)),
              switchMap(() => db.clients.toArray()),
            ),
        ),
        tap(users => (this.dataSource.data = users)),
        first(), // Получили ответ и отписались, т.к. данные с бэка нужны только при инициализации
      )
      .subscribe();
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
      this.save(entity);
      // После сохранения либо закрываем диалог, либо обновляем модель в диалоге
      // Вариант 1.
      dialogRef.close();
      // Вариант 2.
      // Обновляем модель после сохранения, чтобы форма узнала об ее существовании в гриде
      // componentRef?.setInput('entity', entity);
    })
  }

  protected delete(): void {
    const selection = this.selection;
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: selection.selected.length });

    dialogRef.afterClosed().pipe(first()).subscribe(isAccepted => {
      if (isAccepted) {
        const dataSource = this.dataSource;

        selection.selected.forEach(entity => {
          db.clients.delete(entity.id).then(() => {
            const index = dataSource.data.findIndex(el => el === entity);

            if(index !== -1) {
              selection.deselect(entity);
              dataSource.data.splice(index, 1);
              dataSource._updateChangeSubscription();
              this.changeDetector.markForCheck();
            }
          })
        });
      }
    });
  }

  private save(entity: Client): void {
    const updateView = () => {
      dataSource._updateChangeSubscription();
      this.changeDetector.markForCheck();
    }
    const dataSource = this.dataSource;
    const dataItem = dataSource.data.find(el => el === entity);

    if(dataItem) {
      db.clients.put(entity).then(() => updateView())
    } else {
      db.clients.add(entity).then(() => {
        dataSource.data.push(entity);
        updateView();
      })
    }
  }
}

// При желании весь функционал для формы и таблицы можно перенести в абстрактные директивы с дженериком в виде модели
