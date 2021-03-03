import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Book } from '../models/book';
import { environment } from 'src/environments/environment';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  books$: Observable<Book[]>;
  private env = environment
  private booksUrl: string;

  constructor(private http: HttpClient) {
    this.booksUrl = `https://${this.env.azureContainers.storage}.${this.env.azureContainers.baseUrl}/${this.env.azureContainers.container}/books.json`;
  }

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.books$ = this.http.get<Book[]>(this.booksUrl).pipe(
      tap((data) => console.log(data)),
      catchError(this.handleError<Book[]>()),
      shareReplay()
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
