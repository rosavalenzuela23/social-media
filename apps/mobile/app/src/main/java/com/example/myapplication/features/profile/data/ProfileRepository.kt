package com.example.myapplication.features.profile.data

import com.example.myapplication.core.network.ApiResult
import com.example.myapplication.core.network.safeApiCall
import com.example.myapplication.features.profile.data.dto.CreateProfileRequestDto
import com.example.myapplication.features.profile.data.dto.ProfileDto
import com.example.myapplication.features.profile.data.dto.UpdateProfileRequestDto
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File

class ProfileRepository(
    private val api: ProfileApi
) {

    suspend fun createProfile(
        name: String,
        username: String,
        bio: String? = null,
        likeText: String? = null
    ): ApiResult<ProfileDto> {
        return safeApiCall {
            api.createProfile(
                CreateProfileRequestDto(
                    name = name,
                    username = username,
                    bio = bio,
                    likeText = likeText
                )
            )
        }
    }

    suspend fun getOwnProfile(): ApiResult<ProfileDto> {
        return safeApiCall { api.getOwnProfile() }
    }

    suspend fun getProfileById(profileId: String): ApiResult<ProfileDto> {
        return safeApiCall { api.getProfileById(profileId) }
    }

    suspend fun updateProfile(
        name: String? = null,
        username: String? = null,
        bio: String? = null,
        likeText: String? = null
    ): ApiResult<ProfileDto> {
        return safeApiCall {
            api.updateProfile(
                UpdateProfileRequestDto(
                    name = name,
                    username = username,
                    bio = bio,
                    likeText = likeText
                )
            )
        }
    }

    suspend fun setProfilePicture(imageFile: File): ApiResult<ProfileDto> {
        val requestBody = imageFile.asRequestBody("image/*".toMediaTypeOrNull())
        val imagePart = MultipartBody.Part.createFormData(
            name = "image",
            filename = imageFile.name,
            body = requestBody
        )

        return safeApiCall { api.setProfilePicture(imagePart) }
    }

    suspend fun getAllProfiles(): ApiResult<List<ProfileDto>> {
        return safeApiCall { api.getAllProfiles() }
    }
}
