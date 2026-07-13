package com.example.myapplication.features.posts.presentation.comments

import com.example.myapplication.features.posts.data.dto.CommentDto

data class CommentUiModel(
    val uuid: String,
    val username: String,
    val message: String,
    val date: String,
    val likesCount: Int,
    val likedByMe: Boolean
)

fun CommentDto.toUiModel(
    currentUserUuid: String?
): CommentUiModel {
    val normalizedUserUuid =
        currentUserUuid?.trim()

    return CommentUiModel(
        uuid = uuid.orEmpty(),
        username = creatorUsername ?: "Unknown user",
        message = message.orEmpty(),
        date = date.orEmpty(),
        likesCount = likes.size,
        likedByMe =
            !normalizedUserUuid.isNullOrBlank() &&
                    likes.any { like ->
                        like.userUuid?.trim() ==
                                normalizedUserUuid
                    }
    )
}