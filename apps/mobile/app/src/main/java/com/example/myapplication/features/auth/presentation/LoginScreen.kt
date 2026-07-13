package com.example.myapplication.features.auth.presentation

import android.util.Log
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Lock
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Visibility
import androidx.compose.material.icons.rounded.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.myapplication.R

private val BackgroundTop = Color(0xFF0B1120)
private val BackgroundBottom = Color(0xFF151C2E)

private val AccentColor = Color(0xFF8B7CF6)
private val AccentPressedColor = Color(0xFF7565E8)

private val FormColor = Color(0xFF182131)
private val PrimaryTextColor = Color(0xFFF5F7FF)
private val SecondaryTextColor = Color(0xFF9EA8BD)
private val FieldBorderColor = Color(0xFF3B465A)
private val ErrorColor = Color(0xFFFF8A80)

@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit,
    onRegisterClick: () -> Unit
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(state.isLoggedIn) {
        if (state.isLoggedIn) {
            onLoginSuccess()
        }
    }

    /*
     * Do not place Log.e directly inside LoginContent.
     * A composable can execute multiple times because of recomposition.
     */
    LaunchedEffect(state.error) {
        state.error?.let { error ->
            Log.e("LoginScreen", error)
        }
    }

    LoginContent(
        state = state,
        onUsernameChange = viewModel::onUsernameChange,
        onPasswordChange = viewModel::onPasswordChange,
        onLoginClick = viewModel::login,
        onRegisterClick = onRegisterClick
    )
}

@Composable
fun LoginContent(
    state: LoginUiState,
    onUsernameChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onLoginClick: () -> Unit,
    onRegisterClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        BackgroundTop,
                        BackgroundBottom
                    )
                )
            )
    ) {
        DecorativeBackground()

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .imePadding()
                .padding(
                    horizontal = 24.dp,
                    vertical = 32.dp
                ),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 440.dp)
                    .fillMaxWidth()
            ) {
                LoginHeader()

                Spacer(modifier = Modifier.height(32.dp))

                LoginForm(
                    state = state,
                    onUsernameChange = onUsernameChange,
                    onPasswordChange = onPasswordChange,
                    onLoginClick = onLoginClick,
                    onRegisterClick = onRegisterClick
                )
            }
        }
    }
}

@Composable
private fun DecorativeBackground() {
    Box(
        modifier = Modifier
            .offset(
                x = 72.dp,
                y = (-72).dp
            )
            .size(220.dp)
            .background(
                color = AccentColor.copy(alpha = 0.14f),
                shape = CircleShape
            )
    )

    Box(
        modifier = Modifier
            .offset(
                x = (-90).dp,
                y = 620.dp
            )
            .size(240.dp)
            .background(
                color = AccentColor.copy(alpha = 0.08f),
                shape = CircleShape
            )
    )
}

@Composable
private fun LoginHeader() {
    Text(
        text = stringResource(R.string.social_cat),
        color = PrimaryTextColor,
        fontSize = 38.sp,
        fontWeight = FontWeight.Bold
    )

    Spacer(modifier = Modifier.height(8.dp))

    Text(
        text = stringResource(R.string.login_tagline),
        color = SecondaryTextColor,
        fontSize = 16.sp
    )
}

@Composable
private fun LoginForm(
    state: LoginUiState,
    onUsernameChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onLoginClick: () -> Unit,
    onRegisterClick: () -> Unit
) {
    var passwordVisible by rememberSaveable {
        mutableStateOf(false)
    }

    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        color = FormColor.copy(alpha = 0.96f),
        border = BorderStroke(
            width = 1.dp,
            color = Color.White.copy(alpha = 0.08f)
        ),
        shadowElevation = 16.dp
    ) {
        Column(
            modifier = Modifier.padding(24.dp)
        ) {
            Text(
                text = stringResource(R.string.welcome_back),
                color = PrimaryTextColor,
                fontSize = 25.sp,
                fontWeight = FontWeight.SemiBold
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = stringResource(R.string.login_subtitle),
                color = SecondaryTextColor,
                fontSize = 14.sp
            )

            Spacer(modifier = Modifier.height(28.dp))

            AuthTextField(
                modifier = Modifier.fillMaxWidth(),
                value = state.username,
                onValueChange = onUsernameChange,
                label = stringResource(R.string.username),
                leadingIcon = Icons.Rounded.Person,
                enabled = !state.isLoading,
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Text,
                    imeAction = ImeAction.Next
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            AuthTextField(
                modifier = Modifier.fillMaxWidth(),
                value = state.password,
                onValueChange = onPasswordChange,
                label = stringResource(R.string.password),
                leadingIcon = Icons.Rounded.Lock,
                enabled = !state.isLoading,
                visualTransformation = if (passwordVisible) {
                    VisualTransformation.None
                } else {
                    PasswordVisualTransformation()
                },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Done
                ),
                keyboardActions = KeyboardActions(
                    onDone = {
                        if (!state.isLoading) {
                            onLoginClick()
                        }
                    }
                ),
                trailingIcon = {
                    IconButton(
                        onClick = {
                            passwordVisible = !passwordVisible
                        },
                        enabled = !state.isLoading
                    ) {
                        Icon(
                            imageVector = if (passwordVisible) {
                                Icons.Rounded.VisibilityOff
                            } else {
                                Icons.Rounded.Visibility
                            },
                            contentDescription = stringResource(
                                if (passwordVisible) {
                                    R.string.hide_password
                                } else {
                                    R.string.show_password
                                }
                            )
                        )
                    }
                }
            )

            AnimatedVisibility(
                visible = state.error != null
            ) {
                Column {
                    Spacer(modifier = Modifier.height(16.dp))

                    ErrorMessage(
                        message = state.error.orEmpty()
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            Button(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),
                onClick = onLoginClick,
                enabled = !state.isLoading,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AccentColor,
                    contentColor = Color.White,
                    disabledContainerColor = AccentColor.copy(alpha = 0.45f),
                    disabledContentColor = Color.White.copy(alpha = 0.7f)
                )
            ) {
                if (state.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(22.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = stringResource(R.string.sign_in),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            RegisterSection(
                enabled = !state.isLoading,
                onRegisterClick = onRegisterClick
            )
        }
    }
}

@Composable
private fun AuthTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    leadingIcon: ImageVector,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    trailingIcon: (@Composable () -> Unit)? = null
) {
    OutlinedTextField(
        modifier = modifier,
        value = value,
        onValueChange = onValueChange,
        label = {
            Text(text = label)
        },
        leadingIcon = {
            Icon(
                imageVector = leadingIcon,
                contentDescription = null
            )
        },
        trailingIcon = trailingIcon,
        enabled = enabled,
        singleLine = true,
        visualTransformation = visualTransformation,
        keyboardOptions = keyboardOptions,
        keyboardActions = keyboardActions,
        shape = RoundedCornerShape(16.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = PrimaryTextColor,
            unfocusedTextColor = PrimaryTextColor,
            disabledTextColor = PrimaryTextColor.copy(alpha = 0.5f),

            focusedBorderColor = AccentColor,
            unfocusedBorderColor = FieldBorderColor,
            disabledBorderColor = FieldBorderColor.copy(alpha = 0.5f),

            focusedLabelColor = AccentColor,
            unfocusedLabelColor = SecondaryTextColor,

            cursorColor = AccentColor,

            focusedLeadingIconColor = AccentColor,
            unfocusedLeadingIconColor = SecondaryTextColor,

            focusedTrailingIconColor = AccentColor,
            unfocusedTrailingIconColor = SecondaryTextColor
        )
    )
}

@Composable
private fun ErrorMessage(
    message: String
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = ErrorColor.copy(alpha = 0.11f),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(
            width = 1.dp,
            color = ErrorColor.copy(alpha = 0.28f)
        )
    ) {
        Text(
            modifier = Modifier.padding(
                horizontal = 14.dp,
                vertical = 12.dp
            ),
            text = message,
            color = ErrorColor,
            fontSize = 14.sp
        )
    }
}

@Composable
private fun RegisterSection(
    enabled: Boolean,
    onRegisterClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = stringResource(R.string.no_account),
            color = SecondaryTextColor,
            fontSize = 14.sp
        )

        TextButton(
            onClick = onRegisterClick,
            enabled = enabled,
            contentPadding = PaddingValues(
                horizontal = 6.dp,
                vertical = 0.dp
            ),
            colors = ButtonDefaults.textButtonColors(
                contentColor = AccentColor,
                disabledContentColor = AccentPressedColor.copy(alpha = 0.5f)
            )
        ) {
            Text(
                text = stringResource(R.string.create_account),
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Preview(
    showBackground = true,
    widthDp = 390,
    heightDp = 844
)
@Composable
private fun LoginContentPreview() {
    MaterialTheme {
        LoginContent(
            state = LoginUiState(),
            onUsernameChange = {},
            onPasswordChange = {},
            onLoginClick = {},
            onRegisterClick = {}
        )
    }
}