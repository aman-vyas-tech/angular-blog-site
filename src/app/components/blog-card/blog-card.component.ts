import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css'],
})
export class BlogCardComponent implements OnInit {
  blogPost: Post[] = [];
  private unsubscribe$ = new Subject<void>();
  constructor(
    private blogService: BlogService,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit() {
    this.getBlogPosts();
  }
  getBlogPosts() {
    this.blogService
      .getAllPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.blogPost = result;
      });
  }

  delete(postId: string) {
    if (confirm('Are you sure')) {
      this.blogService.deletePost(postId).then(() => {
        this.snackBarService.showSnackBar(`Blog post deleted
   successfully`);
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
