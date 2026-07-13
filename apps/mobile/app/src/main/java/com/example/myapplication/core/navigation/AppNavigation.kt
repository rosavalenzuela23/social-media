package com.example.myapplication.core.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.myapplication.core.navigation.routes.Routes
import com.example.myapplication.core.network.ApiProvider
import com.example.myapplication.features.auth.data.AuthRepository
import com.example.myapplication.features.auth.presentation.LoginScreen
import com.example.myapplication.features.auth.presentation.LoginViewModel
import com.example.myapplication.features.auth.presentation.LoginViewModelFactory
import com.example.myapplication.features.posts.data.PostsRepository
import com.example.myapplication.features.posts.presentation.FeedScreen
import com.example.myapplication.features.posts.presentation.FeedViewModel
import com.example.myapplication.features.posts.presentation.FeedViewModelFactory
import com.example.myapplication.features.posts.presentation.comments.CommentsViewModel
import com.example.myapplication.features.posts.presentation.comments.CommentsViewModelFactory

@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Routes.Login.route
    ) {
        composable(Routes.Login.route) {
            val authRepository = AuthRepository(
                api = ApiProvider.authApi,
                sessionManager = ApiProvider.sessionManager
            )

            val loginViewModel: LoginViewModel = viewModel(
                factory = LoginViewModelFactory(
                    repository = authRepository
                )
            )

            LoginScreen(
                viewModel = loginViewModel,
                onLoginSuccess = {
                    navController.navigate(Routes.Feed.route) {
                        popUpTo(Routes.Login.route) {
                            inclusive = true
                        }
                    }
                },
                onRegisterClick = {
                    // RegisterScreen will be connected later.
                }
            )
        }

        composable(Routes.Feed.route) {
            val postsRepository = PostsRepository(
                api = ApiProvider.postsApi
            )

            val feedViewModel: FeedViewModel = viewModel(
                factory = FeedViewModelFactory(
                    repository = postsRepository
                )
            )

            val commentsViewModel: CommentsViewModel = viewModel(
                factory = CommentsViewModelFactory(
                    repository = postsRepository,
                    sessionManager = ApiProvider.sessionManager
                )
            )

            FeedScreen(
                viewModel = feedViewModel,
                commentsViewModel = commentsViewModel,
                onLogoutClick = {
                    navController.navigate(Routes.Login.route) {
                        popUpTo(Routes.Feed.route) {
                            inclusive = true
                        }
                    }
                },
                onProfileClick = {
                    // ProfileScreen will be connected later.
                }
            )
        }
    }
}