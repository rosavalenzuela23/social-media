package com.example.myapplication.features.posts.data

import com.example.myapplication.features.posts.data.dto.ActionMessageDto
import com.example.myapplication.features.posts.data.dto.AddCommentRequestDto
import com.example.myapplication.features.posts.data.dto.CommentDto
import com.example.myapplication.features.posts.data.dto.CreatePostRequestDto
import com.example.myapplication.features.posts.data.dto.LikeCommentRequestDto
import com.example.myapplication.features.posts.data.dto.PostDto
import com.example.myapplication.features.posts.data.dto.SetLikeRequestDto
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query
import retrofit2.http.Streaming

interface PostsApi {

    @Streaming
    @GET("api/posts/images/{uuid}")
    suspend fun getImageByUuid(
        @Path("uuid") uuid: String
    ): Response<ResponseBody>

    @GET("api/posts/users/{uuid}")
    suspend fun getUserPosts(
        @Path("uuid") uuid: String
    ): Response<List<PostDto>>

    @GET("api/posts/me/")
    suspend fun getUserLoggedPosts(): Response<List<PostDto>>

    @GET("api/posts/feed")
    suspend fun getFeed(
        @Query("page") page: Int,
        @Query("size") size: Int
    ): Response<List<PostDto>>

    @PUT("api/posts/{postId}/like")
    suspend fun setLike(
        @Path("postId") postId: String,
        @Body request: SetLikeRequestDto
    ): Response<PostDto>

    @GET("api/posts/{postId}/comments")
    suspend fun getPostComments(
        @Path("postId") postId: String,
        @Query("page") page: Int,
        @Query("size") size: Int
    ): Response<List<CommentDto>>

    @POST("api/posts/{postId}/comments")
    suspend fun addCommentToPost(
        @Path("postId") postId: String,
        @Body request: AddCommentRequestDto
    ): Response<Unit>
    @POST("api/posts/{postId}/comments/{commentId}/like")
    suspend fun likeComment(
        @Path("postId") postId: String,
        @Path("commentId") commentId: String,
        @Body request: LikeCommentRequestDto
    ): Response<ActionMessageDto>

    @GET("api/posts/{postId}")
    suspend fun getPostById(
        @Path("postId") postId: String
    ): Response<PostDto>

    @POST("api/posts/")
    suspend fun createPost(
        @Body request: CreatePostRequestDto
    ): Response<PostDto>
}