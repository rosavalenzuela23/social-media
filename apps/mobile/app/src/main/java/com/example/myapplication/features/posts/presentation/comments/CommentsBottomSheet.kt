package com.example.myapplication.features.posts.presentation.comments

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val SheetBackground = Color(0xFF151B22)
private val CommentBackground = Color(0xFF1D2631)
private val PrimaryText = Color(0xFFF5F7FF)
private val SecondaryText = Color(0xFFAAB3C2)
private val AccentColor = Color(0xFF8B7CF6)
private val ErrorColor = Color(0xFFFF8A80)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CommentsBottomSheet(
    state: CommentsUiState,
    onDismiss: () -> Unit,
    onMessageChange: (String) -> Unit,
    onSendClick: () -> Unit,
    onLikeClick: (CommentUiModel) -> Unit,
    onRetryClick: () -> Unit,
    onLoadMoreClick: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(
        /*
         * Opens almost as a complete screen, but the user can still
         * drag it down to dismiss it.
         */
        skipPartiallyExpanded = true
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SheetBackground,
        contentColor = PrimaryText,
        dragHandle = {
            Surface(
                modifier = Modifier
                    .padding(vertical = 12.dp)
                    .width(40.dp)
                    .height(4.dp),
                shape = RoundedCornerShape(50),
                color = SecondaryText.copy(alpha = 0.6f)
            ) {}
        }
    ) {
        CommentsContent(
            state = state,
            onDismiss = onDismiss,
            onMessageChange = onMessageChange,
            onSendClick = onSendClick,
            onLikeClick = onLikeClick,
            onRetryClick = onRetryClick,
            onLoadMoreClick = onLoadMoreClick
        )
    }
}

@Composable
fun CommentsContent(
    state: CommentsUiState,
    onDismiss: () -> Unit,
    onMessageChange: (String) -> Unit,
    onSendClick: () -> Unit,
    onLikeClick: (CommentUiModel) -> Unit,
    onRetryClick: () -> Unit,
    onLoadMoreClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.92f)
            .imePadding()
            .navigationBarsPadding()
    ) {
        CommentsHeader(
            commentsCount = state.comments.size,
            onDismiss = onDismiss
        )

        HorizontalDivider(
            color = Color.White.copy(alpha = 0.08f)
        )

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            when {
                state.isLoading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = AccentColor
                    )
                }

                state.error != null &&
                        state.comments.isEmpty() -> {
                    CommentsError(
                        message = state.error,
                        onRetryClick = onRetryClick,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }

                state.comments.isEmpty() -> {
                    EmptyComments(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }

                else -> {
                    /*
                     * LazyColumn is preferable here because the number of
                     * comments may grow and only visible items need to be
                     * composed.
                     */
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(
                            horizontal = 20.dp,
                            vertical = 16.dp
                        ),
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        itemsIndexed(
                            items = state.comments,
                            key = { index, comment ->
                                comment.uuid.takeIf { it.isNotBlank() }
                                    ?: "comment-fallback-$index"
                            }
                        ) { _, comment ->
                            CommentItem(
                                comment = comment,
                                isUpdatingLike =
                                    comment.uuid in state.likingCommentIds,
                                onLikeClick = {
                                    onLikeClick(comment)
                                }
                            )
                        }
                        if (state.hasNextPage) {
                            item {
                                TextButton(
                                    modifier = Modifier.fillMaxWidth(),
                                    onClick = onLoadMoreClick,
                                    enabled = !state.isLoadingMore
                                ) {
                                    if (state.isLoadingMore) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(20.dp),
                                            strokeWidth = 2.dp,
                                            color = AccentColor
                                        )
                                    } else {
                                        Text(
                                            text = "Load more comments",
                                            color = AccentColor
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (
            state.error != null &&
            state.comments.isNotEmpty()
        ) {
            Text(
                modifier = Modifier.padding(
                    horizontal = 20.dp,
                    vertical = 8.dp
                ),
                text = state.error,
                color = ErrorColor,
                fontSize = 13.sp
            )
        }

        HorizontalDivider(
            color = Color.White.copy(alpha = 0.08f)
        )

        CommentComposer(
            message = state.message,
            isSending = state.isSending,
            canSend = state.canSend,
            onMessageChange = onMessageChange,
            onSendClick = onSendClick
        )
    }
}

@Composable
private fun CommentsHeader(
    commentsCount: Int,
    onDismiss: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(
                start = 20.dp,
                end = 12.dp,
                bottom = 12.dp
            ),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = "Comments",
                color = PrimaryText,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold
            )

            Text(
                text = when (commentsCount) {
                    0 -> "No comments"
                    1 -> "1 comment"
                    else -> "$commentsCount comments"
                },
                color = SecondaryText,
                fontSize = 13.sp
            )
        }

        TextButton(
            onClick = onDismiss
        ) {
            Text(
                text = "Close",
                color = AccentColor
            )
        }
    }
}

@Composable
private fun CommentItem(
    comment: CommentUiModel,
    isUpdatingLike: Boolean,
    onLikeClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Surface(
            modifier = Modifier.size(40.dp),
            shape = CircleShape,
            color = AccentColor.copy(alpha = 0.22f)
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = comment.username
                        .firstOrNull()
                        ?.uppercase()
                        ?: "?",
                    color = PrimaryText,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.width(10.dp))

        Column(
            modifier = Modifier.weight(1f)
        ) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                color = CommentBackground
            ) {
                Column(
                    modifier = Modifier.padding(
                        horizontal = 14.dp,
                        vertical = 11.dp
                    )
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            modifier = Modifier.weight(1f),
                            text = comment.username,
                            color = PrimaryText,
                            fontWeight = FontWeight.SemiBold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    Spacer(modifier = Modifier.height(5.dp))

                    Text(
                        text = comment.message,
                        color = PrimaryText,
                        fontSize = 14.sp,
                        lineHeight = 20.sp
                    )
                }
            }

            TextButton(
                onClick = onLikeClick,
                enabled = !isUpdatingLike
            ) {
                if (isUpdatingLike) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp,
                        color = AccentColor
                    )
                } else {
                    Text(
                        text = if (comment.likedByMe) {
                            "Meowed ${comment.likesCount}"
                        } else {
                            "Meow ${comment.likesCount}"
                        },
                        color = if (comment.likedByMe) {
                            AccentColor
                        } else {
                            SecondaryText
                        },
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@Composable
private fun CommentComposer(
    message: String,
    isSending: Boolean,
    canSend: Boolean,
    onMessageChange: (String) -> Unit,
    onSendClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(SheetBackground)
            .padding(16.dp),
        verticalAlignment = Alignment.Bottom
    ) {
        OutlinedTextField(
            modifier = Modifier.weight(1f),
            value = message,
            onValueChange = onMessageChange,
            placeholder = {
                Text(
                    text = "Write a comment...",
                    color = SecondaryText
                )
            },
            enabled = !isSending,
            maxLines = 4,
            shape = RoundedCornerShape(18.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = PrimaryText,
                unfocusedTextColor = PrimaryText,
                disabledTextColor = PrimaryText.copy(alpha = 0.5f),

                cursorColor = AccentColor,

                focusedBorderColor = AccentColor,
                unfocusedBorderColor = SecondaryText.copy(alpha = 0.45f),
                disabledBorderColor = SecondaryText.copy(alpha = 0.2f),

                focusedContainerColor = CommentBackground,
                unfocusedContainerColor = CommentBackground,
                disabledContainerColor = CommentBackground.copy(alpha = 0.6f),

                focusedPlaceholderColor = SecondaryText,
                unfocusedPlaceholderColor = SecondaryText
            )
        )

        Spacer(modifier = Modifier.width(10.dp))

        Button(
            modifier = Modifier.height(56.dp),
            onClick = onSendClick,
            enabled = canSend,
            colors = ButtonDefaults.buttonColors(
                containerColor = AccentColor
            ),
            shape = RoundedCornerShape(16.dp)
        ) {
            if (isSending) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp,
                    color = Color.White
                )
            } else {
                Text("Post")
            }
        }
    }
}

@Composable
private fun EmptyComments(
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "No comments yet",
            color = PrimaryText,
            fontWeight = FontWeight.SemiBold,
            fontSize = 18.sp
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = "Start the conversation.",
            color = SecondaryText
        )
    }
}

@Composable
private fun CommentsError(
    message: String,
    onRetryClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = message,
            color = ErrorColor
        )

        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = onRetryClick
        ) {
            Text("Retry")
        }
    }
}