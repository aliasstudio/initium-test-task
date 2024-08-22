import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { SelectionModel } from "@angular/cdk/collections";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

export interface Client {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

const ELEMENT_DATA: Client[] = [
  { name: "Александр", surname: "Петров", email: "petrov@mail.ru", phone: "+79061856195" },
  { name: "Павел", surname: "Прилучный", email: "ppl98@mail.ru", phone: "+79891456090" },
  { name: "Иван", surname: "Охлобыстин", email: "iohl_990@mail.ru", phone: "+79053856195" },
  { name: "Марина", surname: "Александрова", email: "malexan21@mail.ru", phone: "+79052206950" },
  { name: "Юрий", surname: "Борисов", email: "borisov@gmail.com", phone: "" }
];

@Component({
  selector: 'app-clients-list-page',
  templateUrl: './clients-list-page.component.html',
  styleUrls: ['./clients-list-page.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatCheckboxModule, MatButtonModule, MatIconModule],
})
export class ClientsListPageComponent implements AfterViewInit {
  @ViewChild(MatSort) protected sort!: MatSort;

  protected displayedColumns: string[] = ['select', 'name', 'surname', 'email', 'phone'];
  protected dataSource = new MatTableDataSource<Client>(ELEMENT_DATA);
  protected selection = new SelectionModel<Client>(true, []);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  protected isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  protected toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
}
