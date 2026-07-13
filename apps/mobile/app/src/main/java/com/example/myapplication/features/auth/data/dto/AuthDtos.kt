package com.example.myapplication.features.auth.data.dto

import com.google.gson.annotations.SerializedName

data class LoginRequestDto(
    val username: String,
    val password: String
)

data class LoginResponseDto(
    val message: String? = null,
    val sessionData: SessionDataDto? = null
)

data class SessionDataDto(
    val username: String? = null,
    val uuid: String? = null
)

data class CreateUserRequestDto(
    val name: String,
    val username: String,
    val password: String
)

data class UserDto(
    val uuid: String? = null,
    val name: String? = null,
    val username: String? = null,
    @SerializedName("createdAt") val createdAt: String? = null,
    @SerializedName("updatedAt") val updatedAt: String? = null
)

data class LogoutResponseDto(
    val message: String? = null
)
