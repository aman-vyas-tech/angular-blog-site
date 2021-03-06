import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'src/app/models/appuser';
import { AuthService } from 'src/app/services/auth.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css'],
})
export class BlogCardComponent implements OnInit {
  blogPost: Post[] = [];
  private unsubscribe$ = new Subject<void>();
  config: any;
  pageSizeOptions = [];
  appUser: AppUser;

  constructor(
    private blogService: BlogService,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private commentService: CommentService
  ) {
    this.pageSizeOptions = [2, 4, 6];
    const pageSize = localStorage.getItem('pageSize');
    this.config = {
      currentPage: 1,
      itemsPerPage: pageSize ? +pageSize : this.pageSizeOptions[0],
    };
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.config.currentPage = +params['pagenum'];
      this.getBlogPosts();
    });
    this.authService.appUser$.subscribe(appUser => this.appUser = appUser);
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
      this.commentService.deleteAllCommentForBlog(postId);
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
