package com.example.myapplication.features.posts.presentation.comments

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.myapplication.core.network.ApiResult
import com.example.myapplication.core.session.SessionManager
import com.example.myapplication.features.posts.data.PostsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

private const val COMMENTS_PAGE_SIZE = 20

class CommentsViewModel(
    private val repository: PostsRepository,
    private val sessionManager: SessionManager,
) : ViewModel() {

    private val _uiState = MutableStateFlow(CommentsUiState())
    val uiState = _uiState.asStateFlow()

    fun openPost(postId: String) {
        if (postId.isBlank()) {
            return
        }

        val currentState = _uiState.value

        /*
         * Prevents duplicate requests when the same post is already
         * loading or has already been loaded.
         */
        val samePostAlreadyOpen =
            currentState.postId == postId &&
                    (
                            currentState.isLoading ||
                                    currentState.comments.isNotEmpty()
                            )

        if (samePostAlreadyOpen) {
            return
        }

        _uiState.value = CommentsUiState(
            postId = postId,
            isLoading = true
        )

        loadPage(
            page = 0,
            append = false
        )
    }

    fun closePost() {
        _uiState.value = CommentsUiState()
    }

    fun onMessageChange(message: String) {
        _uiState.value = _uiState.value.copy(
            message = message,
            error = null
        )
    }

    fun retry() {
        val postId = _uiState.value.postId ?: return

        _uiState.value = _uiState.value.copy(
            isLoading = true,
            isLoadingMore = false,
            error = null
        )

        loadPage(
            page = 0,
            append = false
        )
    }

    fun loadNextPage() {
        val state = _uiState.value

        if (
            state.postId == null ||
            !state.hasNextPage ||
            state.isLoading ||
            state.isLoadingMore
        ) {
            return
        }

        loadPage(
            page = state.page + 1,
            append = true
        )
    }

    private fun loadPage(
        page: Int,
        append: Boolean
    ) {
        val postId = _uiState.value.postId ?: return

        _uiState.value = if (append) {
            _uiState.value.copy(
                isLoadingMore = true,
                error = null
            )
        } else {
            _uiState.value.copy(
                isLoading = true,
                error = null
            )
        }

        viewModelScope.launch {
            when (
                val result = repository.getPostComments(
                    postId = postId,
                    page = page,
                    size = COMMENTS_PAGE_SIZE
                )
            ) {
                is ApiResult.Success -> {
                    if (_uiState.value.postId != postId) {
                        return@launch
                    }

                    val currentUserUuid =
                        sessionManager.getUserUuid()

                    Log.d(
                        "CommentsViewModel",
                        "Current authenticated user UUID: $currentUserUuid"
                    )

                    val receivedComments = result.data.map { comment ->
                        comment.toUiModel(
                            currentUserUuid = currentUserUuid
                        )
                    }

                    val previousComments = if (append) {
                        _uiState.value.comments
                    } else {
                        emptyList()
                    }

                    val comments = (
                            previousComments + receivedComments
                            ).distinctBy { comment ->
                            comment.uuid
                        }

                    val hasNextPage =
                        receivedComments.size == COMMENTS_PAGE_SIZE

                    _uiState.value = _uiState.value.copy(
                        comments = comments,
                        page = page,
                        hasNextPage = hasNextPage,
                        isLoading = false,
                        isLoadingMore = false,
                        error = null
                    )
                }

                is ApiResult.Error -> {
                    if (_uiState.value.postId != postId) {
                        return@launch
                    }

                    Log.e(
                        "CommentsViewModel",
                        result.message
                    )

                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isLoadingMore = false,
                        error = if (append) {
                            "Unable to load more comments."
                        } else {
                            "Unable to load comments."
                        }
                    )
                }
            }
        }
    }

    fun addComment() {
        val state = _uiState.value
        val postId = state.postId ?: return
        val message = state.message.trim()

        if (message.isBlank()) {
            _uiState.value = state.copy(
                error = "Write a comment first."
            )
            return
        }

        if (state.isSending) {
            return
        }

        _uiState.value = state.copy(
            isSending = true,
            error = null
        )

        viewModelScope.launch {
            when (
                val result = repository.addCommentToPost(
                    postId = postId,
                    message = message
                )
            ) {
                is ApiResult.Success -> {
                    if (_uiState.value.postId != postId) {
                        return@launch
                    }

                    _uiState.value = _uiState.value.copy(
                        message = "",
                        isSending = false,
                        hasChanges = true,
                        error = null
                    )

                    /*
                     * The API does not return the created comment,
                     * so reload the first page to obtain its UUID,
                     * date, username and likes from the server.
                     */
                    loadPage(
                        page = 0,
                        append = false
                    )
                }

                is ApiResult.Error -> {
                    if (_uiState.value.postId != postId) {
                        return@launch
                    }

                    Log.e(
                        "CommentsViewModel",
                        result.message
                    )

                    _uiState.value = _uiState.value.copy(
                        isSending = false,
                        error = "Unable to publish your comment."
                    )
                }
            }
        }
    }

    fun toggleLike(comment: CommentUiModel) {
        val state = _uiState.value
        val postId = state.postId

        Log.d(
            "CommentsViewModel",
            """
        toggleLike:
        postId=$postId
        commentUuid=${comment.uuid}
        likedByMe=${comment.likedByMe}
        likesCount=${comment.likesCount}
        """.trimIndent()
        )

        if (postId.isNullOrBlank()) {
            Log.e(
                "CommentsViewModel",
                "Like was not sent because postId is empty."
            )
            return
        }

        if (comment.uuid.isBlank()) {
            Log.e(
                "CommentsViewModel",
                "Like was not sent because commentUuid is empty."
            )
            return
        }

        if (comment.uuid in state.likingCommentIds) {
            Log.w(
                "CommentsViewModel",
                "Like request already running for ${comment.uuid}"
            )
            return
        }

        val newLikedValue = !comment.likedByMe

        Log.d(
            "CommentsViewModel",
            "Sending comment like: postId=$postId, commentId=${comment.uuid}, liked=$newLikedValue"
        )

        // Continúa aquí con tu implementación actual

        val optimisticComment = comment.copy(
            likedByMe = newLikedValue,
            likesCount = if (newLikedValue) {
                comment.likesCount + 1
            } else {
                (comment.likesCount - 1).coerceAtLeast(0)
            }
        )

        _uiState.value = state.copy(
            comments = state.comments.map { current ->
                if (current.uuid == comment.uuid) {
                    optimisticComment
                } else {
                    current
                }
            },
            likingCommentIds =
                state.likingCommentIds + comment.uuid,
            error = null
        )

        viewModelScope.launch {
            when (
                val result = repository.likeComment(
                    postId = postId,
                    commentId = comment.uuid,
                    liked = newLikedValue
                )
            ) {
                is ApiResult.Success -> {
                    Log.d(
                        "CommentsViewModel",
                        "Comment like request completed successfully."
                    )

                    if (_uiState.value.postId != postId) {
                        return@launch
                    }

                    _uiState.value = _uiState.value.copy(
                        comments = _uiState.value.comments.map { current ->
                            if (current.uuid == comment.uuid) {
                                optimisticComment
                            } else {
                                current
                            }
                        },
                        likingCommentIds =
                            _uiState.value.likingCommentIds -
                                    comment.uuid,
                        error = null
                    )

                    loadPage(
                        page = 0,
                        append = false
                    )
                }

                is ApiResult.Error -> {
                    Log.e(
                        "CommentsViewModel",
                        "Comment like request failed: ${result.message}"
                    )
                    if (_uiState.value.postId != postId) {
                        return@launch
                    }

                    Log.e(
                        "CommentsViewModel",
                        result.message
                    )

                    /*
                     * Restore the original comment if the request failed.
                     */
                    _uiState.value = _uiState.value.copy(
                        comments = _uiState.value.comments.map { current ->
                            if (current.uuid == comment.uuid) {
                                comment
                            } else {
                                current
                            }
                        },
                        likingCommentIds =
                            _uiState.value.likingCommentIds -
                                    comment.uuid,
                        error = "Unable to update this comment."
                    )
                }
            }
        }
    }
}

class CommentsViewModelFactory(
    private val repository: PostsRepository,
    private val sessionManager: SessionManager
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(
        modelClass: Class<T>
    ): T {
        if (
            modelClass.isAssignableFrom(
                CommentsViewModel::class.java
            )
        ) {
            return CommentsViewModel(
                repository = repository,
                sessionManager = sessionManager
            ) as T
        }

        throw IllegalArgumentException(
            "Unknown ViewModel class: ${modelClass.name}"
        )
    }
}