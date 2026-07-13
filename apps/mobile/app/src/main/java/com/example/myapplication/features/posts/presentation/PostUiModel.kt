package com.example.myapplication.features.posts.presentation

import com.example.myapplication.features.posts.data.dto.PostDto

data class PostUiModel(
    val uuid: String,
    val username: String,
    val message: String,
    val date: String,
    val commentsCount: Int,
    val likesCount: Int,
    val likedByMe: Boolean = false
)

fun PostDto.toUiModel(): PostUiModel {
    val rawDate = displayDate.orEmpty()

    return PostUiModel(
        uuid = uuid.orEmpty(),
        username = creatorUsername ?: "usuario",
        message = message.orEmpty(),
        date = rawDate.take(10),
        commentsCount = commentsCount,
        likesCount = likesCount,
        likedByMe = false
    )
}