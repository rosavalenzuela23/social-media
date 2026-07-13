package com.example.myapplication.features.profile.data

import com.example.myapplication.features.profile.data.dto.CreateProfileRequestDto
import com.example.myapplication.features.profile.data.dto.ProfileDto
import com.example.myapplication.features.profile.data.dto.UpdateProfileRequestDto
import okhttp3.MultipartBody
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Multipart
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Part
import retrofit2.http.Path
import retrofit2.http.Streaming

interface ProfileApi {

    @POST("api/profiles/me")
    suspend fun createProfile(
        @Body request: CreateProfileRequestDto
    ): Response<ProfileDto>

    @GET("api/profiles/me")
    suspend fun getOwnProfile(): Response<ProfileDto>

    @GET("api/profiles/{profileId}")
    suspend fun getProfileById(
        @Path("profileId") profileId: String
    ): Response<ProfileDto>

    @Streaming
    @GET("api/profiles/{profileId}/picture")
    suspend fun getProfilePicture(
        @Path("profileId") profileId: String
    ): Response<ResponseBody>

    @PUT("api/profiles/me")
    suspend fun updateProfile(
        @Body request: UpdateProfileRequestDto
    ): Response<ProfileDto>

    @Multipart
    @POST("api/profiles/me/picture")
    suspend fun setProfilePicture(
        @Part image: MultipartBody.Part
    ): Response<ProfileDto>

    @GET("api/admin/profiles/")
    suspend fun getAllProfiles(): Response<List<ProfileDto>>
}
