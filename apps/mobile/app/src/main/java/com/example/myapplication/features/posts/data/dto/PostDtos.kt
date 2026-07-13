package com.example.myapplication.features.posts.data.dto

import com.google.gson.annotations.SerializedName

data class ImageDto(
    val path: String? = null,
    val uuid: String? = null
)

data class LikeDto(
    val userUuid: String? = null,
    val username: String? = null,
    val postId: String? = null,
    @SerializedName("createdAt") val createdAt: String? = null
)

data class CommentDto(
    val uuid: String? = null,
    val message: String? = null,
    val date: String? = null,
    val creatorUuid: String? = null,
    val creatorUsername: String? = null,
    val postUuid: String? = null,
    val likes: List<LikeDto> = emptyList()
) {
    val likesCount: Int get() = likes.size
}

data class PostDto(
    val uuid: String? = null,
    val creatorUuid: String? = null,
    val creatorUsername: String? = null,
    val message: String? = null,
    @SerializedName("createdAt") val createdAt: String? = null,
    val date: String? = null,
    val userUuidExcludeList: List<String> = emptyList(),
    @SerializedName("postImages") val postImages: List<ImageDto> = emptyList(),
    val images: List<ImageDto> = emptyList(),
    val comments: List<CommentDto> = emptyList(),
    val likes: List<LikeDto> = emptyList()
) {
    val displayDate: String? get() = createdAt ?: date
    val imageList: List<ImageDto> get() = if (postImages.isNotEmpty()) postImages else images
    val likesCount: Int get() = likes.size
    val commentsCount: Int get() = comments.size
}

data class CreatePostRequestDto(
    val message: String,
    val postImages: List<ImageDto> = emptyList()
)

data class AddCommentRequestDto(
    val content: String
)

data class SetLikeRequestDto(
    val liked: Boolean
)

data class ActionMessageDto(
    val message: String
)

data class LikeCommentRequestDto(
    val liked: Boolean
)

data class PostsPageResponseDto(
    val posts: List<PostDto> = emptyList(),
    val data: List<PostDto> = emptyList(),
    val items: List<PostDto> = emptyList(),
    val page: Int? = null,
    val size: Int? = null,
    val limit: Int? = null,
    val total: Int? = null,
    val totalPages: Int? = null,
    val hasNextPage: Boolean? = null
) {
    fun getPostList(): List<PostDto> {
        return when {
            posts.isNotEmpty() -> posts
            data.isNotEmpty() -> data
            items.isNotEmpty() -> items
            else -> emptyList()
        }
    }
}

data class CommentsPageResponseDto(
    val comments: List<CommentDto> = emptyList(),
    val data: List<CommentDto> = emptyList(),
    val items: List<CommentDto> = emptyList(),
    val page: Int? = null,
    val size: Int? = null,
    val limit: Int? = null,
    val total: Int? = null,
    val totalPages: Int? = null,
    val hasNextPage: Boolean? = null
) {
    fun getCommentList(): List<CommentDto> {
        return when {
            comments.isNotEmpty() -> comments
            data.isNotEmpty() -> data
            items.isNotEmpty() -> items
            else -> emptyList()
        }
    }
}
