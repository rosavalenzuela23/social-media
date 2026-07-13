package com.example.myapplication.features.auth.data

import com.example.myapplication.core.network.ApiProvider
import com.example.myapplication.core.network.ApiResult
import com.example.myapplication.core.network.safeApiCall
import com.example.myapplication.core.session.SessionManager
import com.example.myapplication.features.auth.data.dto.CreateUserRequestDto
import com.example.myapplication.features.auth.data.dto.LoginRequestDto
import com.example.myapplication.features.auth.data.dto.LoginResponseDto
import com.example.myapplication.features.auth.data.dto.LogoutResponseDto
import com.example.myapplication.features.auth.data.dto.UserDto

class AuthRepository(
    private val api: AuthApi,
    private val sessionManager: SessionManager
) {

    suspend fun login(
        username: String,
        password: String
    ): ApiResult<LoginResponseDto> {
        val result = safeApiCall {
            api.login(
                LoginRequestDto(
                    username = username,
                    password = password
                )
            )
        }

        if (result is ApiResult.Success) {
            val userUuid = result.data
                .sessionData
                ?.uuid
                ?.trim()

            if (userUuid.isNullOrBlank()) {
                return ApiResult.Error(
                    message = "Login succeeded, but the server did not return sessionData.uuid."
                )
            }

            sessionManager.saveUserUuid(
                userUuid = userUuid
            )
        }

        return result
    }

    suspend fun logout(): ApiResult<LogoutResponseDto> {
        val result = safeApiCall {
            api.logout()
        }

        if (result is ApiResult.Success) {
            ApiProvider.cookieJar.clear()
            sessionManager.clearSession()
        }

        return result
    }

    suspend fun createUser(
        name: String,
        username: String,
        password: String
    ): ApiResult<UserDto> {
        return safeApiCall {
            api.createUser(
                CreateUserRequestDto(
                    name = name,
                    username = username,
                    password = password
                )
            )
        }
    }

    suspend fun getAllUsers(): ApiResult<List<UserDto>> {
        return safeApiCall {
            api.getAllUsers()
        }
    }
}