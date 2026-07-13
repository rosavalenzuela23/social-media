package com.example.myapplication.features.posts.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapplication.features.posts.presentation.comments.CommentsBottomSheet
import com.example.myapplication.features.posts.presentation.comments.CommentsViewModel
import kotlinx.coroutines.launch

@Composable
fun FeedScreen(
    viewModel: FeedViewModel,
    commentsViewModel: CommentsViewModel,
    onLogoutClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    val commentsState by commentsViewModel.uiState
        .collectAsStateWithLifecycle()

    var selectedPostId by rememberSaveable {
        mutableStateOf<String?>(null)
    }

    /*
     * Only this effect opens the post comments.
     * Do not also call openPost() inside onCommentClick,
     * otherwise the endpoint may be called twice.
     */
    LaunchedEffect(selectedPostId) {
        selectedPostId?.let { postId ->
            commentsViewModel.openPost(postId)
        }
    }

    FeedContent(
        state = state,
        onRefreshClick = viewModel::refresh,
        onLikeClick = viewModel::toggleLike,
        onCommentClick = { post ->
            selectedPostId = post.uuid
        },
        onLogoutClick = onLogoutClick,
        onProfileClick = onProfileClick
    )

    if (selectedPostId != null) {
        CommentsBottomSheet(
            state = commentsState,
            onDismiss = {
                val feedNeedsRefresh =
                    commentsState.hasChanges

                selectedPostId = null
                commentsViewModel.closePost()

                /*
                 * Updates commentsCount after publishing a comment.
                 */
                if (feedNeedsRefresh) {
                    viewModel.refresh()
                }
            },
            onMessageChange =
                commentsViewModel::onMessageChange,
            onSendClick =
                commentsViewModel::addComment,
            onLikeClick =
                commentsViewModel::toggleLike,
            onRetryClick =
                commentsViewModel::retry,
            onLoadMoreClick =
                commentsViewModel::loadNextPage
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedContent(
    state: FeedUiState,
    onRefreshClick: () -> Unit,
    onLikeClick: (PostUiModel) -> Unit,
    onCommentClick: (PostUiModel) -> Unit,
    onLogoutClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    val drawerState = rememberDrawerState(
        initialValue = DrawerValue.Closed
    )

    val scope = rememberCoroutineScope()

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet(
                drawerContainerColor = Color(0xFF151B22)
            ) {
                Column(
                    modifier = Modifier
                        .width(260.dp)
                        .padding(20.dp)
                ) {
                    Text(
                        text = "SocialCat 🐈",
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(24.dp))

                    TextButton(
                        onClick = {
                            scope.launch {
                                drawerState.close()
                            }

                            onProfileClick()
                        }
                    ) {
                        Text(
                            text = "Profile",
                            color = Color.White
                        )
                    }

                    TextButton(
                        onClick = {
                            scope.launch {
                                drawerState.close()
                            }

                            onLogoutClick()
                        }
                    ) {
                        Text(
                            text = "Log out",
                            color = Color.White
                        )
                    }
                }
            }
        }
    ) {
        Scaffold(
            containerColor = Color(0xFF1D242C),
            topBar = {
                TopAppBar(
                    title = {
                        Text(
                            text = "SocialCat 🐈",
                            fontWeight = FontWeight.Bold
                        )
                    },
                    navigationIcon = {
                        TextButton(
                            onClick = {
                                scope.launch {
                                    drawerState.open()
                                }
                            }
                        ) {
                            Text("☰")
                        }
                    },
                    actions = {
                        OutlinedTextField(
                            modifier = Modifier
                                .padding(end = 16.dp)
                                .widthIn(max = 300.dp),
                            value = "",
                            onValueChange = {},
                            singleLine = true,
                            placeholder = {
                                Text("Looking for something?")
                            }
                        )
                    }
                )
            }
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(Color(0xFF1D242C))
            ) {
                when {
                    state.isLoading -> {
                        CircularProgressIndicator(
                            modifier = Modifier.align(
                                Alignment.Center
                            )
                        )
                    }

                    state.error != null -> {
                        Column(
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(24.dp),
                            horizontalAlignment =
                                Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = state.error,
                                color = Color(0xFFFF8A80)
                            )

                            Spacer(
                                modifier = Modifier.height(16.dp)
                            )

                            Button(
                                onClick = onRefreshClick
                            ) {
                                Text("Retry")
                            }
                        }
                    }

                    state.posts.isEmpty() -> {
                        Column(
                            modifier = Modifier
                                .align(Alignment.Center)
                                .padding(24.dp),
                            horizontalAlignment =
                                Alignment.CenterHorizontally
                        ) {
                            Text(
                                text = "No posts yet",
                                color = Color.White
                            )

                            Spacer(
                                modifier = Modifier.height(16.dp)
                            )

                            Button(
                                onClick = onRefreshClick
                            ) {
                                Text("Refresh")
                            }
                        }
                    }

                    else -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            verticalArrangement =
                                Arrangement.spacedBy(18.dp),
                            horizontalAlignment =
                                Alignment.CenterHorizontally
                        ) {
                            item {
                                Spacer(
                                    modifier = Modifier.height(18.dp)
                                )
                            }

                            items(
                                items = state.posts,
                                key = { post ->
                                    post.uuid
                                }
                            ) { post ->
                                PostCard(
                                    post = post,
                                    onCommentClick = {
                                        onCommentClick(post)
                                    },
                                    onLikeClick = {
                                        onLikeClick(post)
                                    }
                                )
                            }

                            item {
                                Spacer(
                                    modifier = Modifier.height(24.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PostCard(
    post: PostUiModel,
    onCommentClick: () -> Unit,
    onLikeClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .padding(horizontal = 20.dp)
            .widthIn(max = 720.dp)
            .fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFFFFAEA)
        )
    ) {
        Column(
            modifier = Modifier.padding(28.dp)
        ) {
            Text(
                text = post.username,
                color = Color.Black,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(14.dp)
            )

            Text(
                text = post.message,
                color = Color.Black
            )

            Spacer(
                modifier = Modifier.height(28.dp)
            )

            HorizontalDivider(
                color = Color.Transparent
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = post.date,
                    color = Color.Black
                )

                Spacer(
                    modifier = Modifier.weight(1f)
                )

                Button(
                    onClick = onCommentClick
                ) {
                    val commentsText = when (
                        post.commentsCount
                    ) {
                        1 -> "1 comment"
                        else -> "${post.commentsCount} comments"
                    }

                    Text(commentsText)
                }

                Spacer(
                    modifier = Modifier.width(12.dp)
                )

                Button(
                    onClick = onLikeClick
                ) {
                    val likesText = if (post.likedByMe) {
                        "Meowed ${post.likesCount}"
                    } else {
                        "Meow ${post.likesCount}"
                    }

                    Text(likesText)
                }
            }
        }
    }
}

@Preview(
    showBackground = true,
    widthDp = 1200,
    heightDp = 800
)
@Composable
private fun FeedContentPreview() {
    FeedContent(
        state = FeedUiState(
            posts = listOf(
                PostUiModel(
                    uuid = "1",
                    username = "johndoe",
                    message = "Watching the birds at my new garden feeder.",
                    date = "2026-07-09",
                    commentsCount = 1,
                    likesCount = 0
                ),
                PostUiModel(
                    uuid = "2",
                    username = "charlieg",
                    message = "Saw a family of deer in my backyard.",
                    date = "2026-07-09",
                    commentsCount = 2,
                    likesCount = 2
                )
            )
        ),
        onRefreshClick = {},
        onLikeClick = {},
        onCommentClick = {},
        onLogoutClick = {},
        onProfileClick = {}
    )
}