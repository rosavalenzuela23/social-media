package com.example.myapplication.features.posts.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.myapplication.core.network.ApiResult
import com.example.myapplication.features.posts.data.PostsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class FeedViewModel(
    private val repository: PostsRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(FeedUiState(isLoading = true))
    val uiState = _uiState.asStateFlow()

    init {
        loadFeed()
    }

    fun loadFeed() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                error = null
            )

            when (
                val result = repository.getFeed(
                    page = 0,
                    size = 10
                )
            ) {
                is ApiResult.Success -> {
                    val posts = result.data.map { it.toUiModel() }

                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        posts = posts,
                        error = null
                    )
                }

                is ApiResult.Error -> {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = result.message
                    )
                }
            }
        }
    }

    fun refresh() {
        loadFeed()
    }

    fun toggleLike(post: PostUiModel) {
        val newLikedValue = !post.likedByMe

        _uiState.value = _uiState.value.copy(
            posts = _uiState.value.posts.map { current ->
                if (current.uuid == post.uuid) {
                    current.copy(
                        likedByMe = newLikedValue,
                        likesCount = if (newLikedValue) {
                            current.likesCount + 1
                        } else {
                            (current.likesCount - 1).coerceAtLeast(0)
                        }
                    )
                } else {
                    current
                }
            }
        )

        viewModelScope.launch {
            when (
                repository.setLike(
                    postId = post.uuid,
                    liked = newLikedValue
                )
            ) {
                is ApiResult.Success -> {
                    // Por ahora dejamos el update optimista.
                    // Después podemos reemplazar el post con la respuesta real.
                }

                is ApiResult.Error -> {
                    // Revertimos si falló.
                    _uiState.value = _uiState.value.copy(
                        posts = _uiState.value.posts.map { current ->
                            if (current.uuid == post.uuid) {
                                current.copy(
                                    likedByMe = post.likedByMe,
                                    likesCount = post.likesCount
                                )
                            } else {
                                current
                            }
                        }
                    )
                }
            }
        }
    }
}

class FeedViewModelFactory(
    private val repository: PostsRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return FeedViewModel(repository) as T
    }
}