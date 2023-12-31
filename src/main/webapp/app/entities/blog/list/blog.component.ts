import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';

import { IBlog } from '../blog.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, BlogService } from '../service/blog.service';
import { BlogDeleteDialogComponent } from '../delete/blog-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-blog',
  templateUrl: './blog.component.html',
})
export class BlogComponent implements OnInit {
  blogs?: IBlog[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected blogService: BlogService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IBlog): number => this.blogService.getBlogIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  delete(blog: IBlog): void {
    const modalRef = this.modalService.open(BlogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.blog = blog;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }
/*
  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }
*/

 load(): void {
  // Intentar cargar desde caché primero
  this.loadFromCache().subscribe({
    next: (cachedData: EntityArrayResponseType | null) => {
      if (!navigator.onLine && cachedData) {
        // Los datos están en caché, manejarlos
        this.onResponseSuccess(cachedData);
      } else {
        // No se encontraron datos en caché, cargar desde el backend
        this.loadFromBackendWithRouteInformations().subscribe({
          next: (res: EntityArrayResponseType) => {
            this.onResponseSuccess(res);
          },
        });
      }
    },
  });
}

loadFromCache(): Observable<EntityArrayResponseType | null> {
  // Nombre de la caché que deberías haber utilizado para almacenar estos datos
  const cacheName = 'miCache';

  return from(
    caches.open(cacheName).then((cache) => {
      // Intentar recuperar la solicitud desde la caché
      return cache.match('/api/blogs/').then((response) => {
        if (response) {
          // Si se encuentra en caché, devolver los datos
          return response.json();
        }
        // Si no se encuentra en caché, devolver nulo
        return null;
      });
    })
  );
}

navigateToWithComponentValues(): void {
  this.handleNavigation(this.predicate, this.ascending);
}



  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.blogs = this.refineData(dataFromBody);
  }

  protected refineData(data: IBlog[]): IBlog[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IBlog[] | null): IBlog[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.blogService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
