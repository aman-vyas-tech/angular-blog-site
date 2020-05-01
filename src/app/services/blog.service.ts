import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private db: AngularFirestore) {}

  createPost(post: Post) {
    const postData = JSON.parse(JSON.stringify(post));
    return this.db.collection('blogs').add(postData);
    }
    
}
