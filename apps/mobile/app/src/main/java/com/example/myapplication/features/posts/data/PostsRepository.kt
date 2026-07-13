package com.example.myapplication.features.posts.data

import com.example.myapplication.core.network.ApiResult
import com.example.myapplication.core.network.safeApiCall
import com.example.myapplication.features.posts.data.dto.ActionMessageDto
import com.example.myapplication.features.posts.data.dto.AddCommentRequestDto
import com.example.myapplication.features.posts.data.dto.CommentDto
import com.example.myapplication.features.posts.data.dto.CreatePostRequestDto
import com.example.myapplication.features.posts.data.dto.LikeCommentRequestDto
import com.example.myapplication.features.posts.data.dto.PostDto
import com.example.myapplication.features.posts.data.dto.SetLikeRequestDto

class PostsRepository(
    private val api: PostsApi
) {

    suspend fun getFeed(
        page: Int,
        size: Int
    ): ApiResult<List<PostDto>> {
        return safeApiCall {
            api.getFeed(
                page = page,
                size = size
            )
        }
    }

    suspend fun getPostById(
        postId: String
    ): ApiResult<PostDto> {
        return safeApiCall {
            api.getPostById(postId)
        }
    }

    suspend fun getUserPosts(
        uuid: String
    ): ApiResult<List<PostDto>> {
        return safeApiCall {
            api.getUserPosts(uuid)
        }
    }

    suspend fun getMyPosts(): ApiResult<List<PostDto>> {
        return safeApiCall {
            api.getUserLoggedPosts()
        }
    }

    suspend fun createPost(
        message: String
    ): ApiResult<PostDto> {
        return safeApiCall {
            api.createPost(
                CreatePostRequestDto(
                    message = message
                )
            )
        }
    }

    suspend fun setLike(
        postId: String,
        liked: Boolean
    ): ApiResult<PostDto> {
        return safeApiCall {
            api.setLike(
                postId = postId,
                request = SetLikeRequestDto(
                    liked = liked
                )
            )
        }
    }

    suspend fun getPostComments(
        postId: String,
        page: Int,
        size: Int
    ): ApiResult<List<CommentDto>> {
        return safeApiCall {
            api.getPostComments(
                postId = postId,
                page = page,
                size = size
            )
        }
    }

    suspend fun addCommentToPost(
        postId: String,
        message: String
    ): ApiResult<Unit> {
        return safeApiCall {
            api.addCommentToPost(
                postId = postId,
                request = AddCommentRequestDto(
                    content = message
                )
            )
        }
    }

    suspend fun likeComment(
        postId: String,
        commentId: String,
        liked: Boolean
    ): ApiResult<ActionMessageDto> {
        return safeApiCall {
            api.likeComment(
                postId = postId,
                commentId = commentId,
                request = LikeCommentRequestDto(
                    liked = liked
                )
            )
        }
    }
}