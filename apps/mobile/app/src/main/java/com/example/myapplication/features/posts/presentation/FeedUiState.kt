package com.example.myapplication.features.posts.presentation

data class FeedUiState(
    val isLoading: Boolean = false,
    val isRefreshing: Boolean = false,
    val posts: List<PostUiModel> = emptyList(),
    val error: String? = null
)