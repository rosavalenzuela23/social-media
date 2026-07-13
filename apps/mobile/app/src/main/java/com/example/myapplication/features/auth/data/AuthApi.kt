package com.example.myapplication.features.auth.data

import com.example.myapplication.features.auth.data.dto.CreateUserRequestDto
import com.example.myapplication.features.auth.data.dto.LoginRequestDto
import com.example.myapplication.features.auth.data.dto.LoginResponseDto
import com.example.myapplication.features.auth.data.dto.LogoutResponseDto
import com.example.myapplication.features.auth.data.dto.UserDto
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface AuthApi {

    @POST("api/users/login/")
    suspend fun login(
        @Body request: LoginRequestDto
    ): Response<LoginResponseDto>

    @GET("api/users/logout/")
    suspend fun logout(): Response<LogoutResponseDto>

    @POST("api/users/")
    suspend fun createUser(
        @Body request: CreateUserRequestDto
    ): Response<UserDto>

    @GET("api/users/")
    suspend fun getAllUsers(): Response<List<UserDto>>
}
