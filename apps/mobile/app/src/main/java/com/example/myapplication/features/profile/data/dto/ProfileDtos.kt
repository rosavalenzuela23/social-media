package com.example.myapplication.features.profile.data.dto

import com.google.gson.annotations.SerializedName

data class CreateProfileRequestDto(
    val name: String,
    val username: String,
    val bio: String? = null,
    val likeText: String? = null
)

data class UpdateProfileRequestDto(
    val name: String? = null,
    val username: String? = null,
    val bio: String? = null,
    val likeText: String? = null
)

data class ProfileDto(
    val uuid: String? = null,
    val name: String? = null,
    val username: String? = null,
    val bio: String? = null,
    val likeText: String? = null,
    val profilePictureName: String? = null,
    @SerializedName("uuidFriendList") val uuidFriendList: List<String> = emptyList(),
    @SerializedName("uuidBlockList") val uuidBlockList: List<String> = emptyList(),
    val friendProfileList: List<ProfileDto> = emptyList(),
    val blockProfileList: List<ProfileDto> = emptyList(),
    @SerializedName("createdAt") val createdAt: String? = null,
    @SerializedName("updatedAt") val updatedAt: String? = null
)
