package com.example.myapplication.features.posts.presentation.comments

data class CommentsUiState(
    val postId: String? = null,
    val comments: List<CommentUiModel> = emptyList(),

    val message: String = "",

    val page: Int = 0,
    val hasNextPage: Boolean = false,

    val isLoading: Boolean = false,
    val isLoadingMore: Boolean = false,
    val isSending: Boolean = false,

    val likingCommentIds: Set<String> = emptySet(),

    val hasChanges: Boolean = false,
    val error: String? = null
) {
    val canSend: Boolean
        get() = message.isNotBlank() && !isSending
}