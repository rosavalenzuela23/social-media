package com.example.myapplication.features.auth.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.myapplication.core.network.ApiResult
import com.example.myapplication.features.auth.data.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class LoginViewModel(
    private val repository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState = _uiState.asStateFlow()

    fun onUsernameChange(value: String) {
        _uiState.value = _uiState.value.copy(
            username = value,
            error = null
        )
    }

    fun onPasswordChange(value: String) {
        _uiState.value = _uiState.value.copy(
            password = value,
            error = null
        )
    }

    fun login() {
        val state = _uiState.value

        if (state.username.isBlank()) {
            _uiState.value = state.copy(error = "Ingresa tu username")
            return
        }

        if (state.password.isBlank()) {
            _uiState.value = state.copy(error = "Ingresa tu password")
            return
        }

        viewModelScope.launch {
            _uiState.value = state.copy(
                isLoading = true,
                error = null
            )

            when (
                val result = repository.login(
                    username = state.username.trim(),
                    password = state.password
                )
            ) {
                is ApiResult.Success -> {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        isLoggedIn = true,
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
}

class LoginViewModelFactory(
    private val repository: AuthRepository
) : ViewModelProvider.Factory {

    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return LoginViewModel(repository) as T
    }
}