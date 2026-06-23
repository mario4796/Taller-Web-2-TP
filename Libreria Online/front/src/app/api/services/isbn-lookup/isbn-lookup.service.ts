import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

export interface OpenLibraryBook {
  title?: string;
  subtitle?: string;
  authors?: Array<{ name?: string }>;
  cover?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class IsbnLookupService {
  private http = inject(HttpClient);
  private apiUrl = environment.OPEN_LIBRARY_API_URL;

  buscarEnOpenLibrary(isbn: string): Observable<OpenLibraryBook | null> {
    const url = `${this.apiUrl}?bibkeys=ISBN:${encodeURIComponent(isbn)}&jscmd=data&format=json`;

    return this.http.get<Record<string, OpenLibraryBook>>(url).pipe(
      map((respuesta) => respuesta[`ISBN:${isbn}`] ?? null)
    );
  }

  portadaUrl(isbn: string, size: 'S' | 'M' | 'L' = 'S'): string {
    return `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-${size}.jpg?default=false`;
  }
}
